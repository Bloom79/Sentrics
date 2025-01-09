from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
from typing import List
import pandas as pd
import numpy as np
from datetime import datetime
import io
import json
import asyncio
from asyncio import Queue
import time

app = FastAPI(title="Renewergy Harmony API")

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global queue for progress updates
progress_queue = Queue()

async def progress_generator():
    """Generate SSE messages for progress updates."""
    try:
        while True:
            message = await progress_queue.get()
            if message is None:  # End of progress updates
                break
            yield f"data: {json.dumps(message)}\n\n"
    except asyncio.CancelledError:
        pass

@app.get("/api/simulation/progress")
async def simulation_progress():
    """SSE endpoint for progress updates."""
    return StreamingResponse(
        progress_generator(),
        media_type="text/event-stream"
    )

async def update_progress(progress: int, message: str):
    """Update simulation progress."""
    await progress_queue.put({
        "progress": progress,
        "message": message
    })

@app.get("/")
async def root():
    return {"message": "Welcome to Renewergy Harmony API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

def clean_float_value(value):
    """Clean float values to ensure JSON compatibility."""
    if pd.isna(value) or np.isinf(value):
        return 0.0
    return float(value)

def downsample_data(df, freq='1H'):
    """Downsample data to reduce volume while preserving patterns."""
    # Resample to specified frequency
    resampled = df.resample(freq, on='DateTime').agg({
        'P_MWh': 'mean',
        'C_MWh': 'mean',
        'bess_charge_end': 'mean',
        'location': 'first'
    }).reset_index()
    
    # Calculate net energy after resampling
    resampled['net_energy'] = resampled['P_MWh'] - resampled['C_MWh']
    
    # Replace NaN and inf values
    resampled = resampled.fillna(0)
    for col in ['P_MWh', 'C_MWh', 'bess_charge_end', 'net_energy']:
        resampled[col] = resampled[col].replace([np.inf, -np.inf], 0)
    
    return resampled

@app.post("/api/simulation")
async def run_simulation(files: List[UploadFile] = File(...)):
    try:
        await update_progress(0, "Starting simulation process...")
        
        if not files:
            raise HTTPException(status_code=400, detail="No files were uploaded")

        # Read uploaded files
        await update_progress(5, f"Processing {len(files)} uploaded files...")
        dataframes = {}
        file_count = len(files)
        
        for i, file in enumerate(files, 1):
            try:
                await update_progress(
                    5 + (i * 15 // file_count),
                    f"Reading file: {file.filename}"
                )
                
                content = await file.read()
                # Try different encodings
                encodings = ['utf-8', 'latin1', 'iso-8859-1', 'cp1252']
                df = None
                last_error = None
                
                for encoding in encodings:
                    try:
                        text_content = content.decode(encoding)
                        # Split content into lines
                        lines = text_content.split('\n')
                        
                        # Find the header line (contains 'time' and 'P_Wh')
                        header_line = None
                        data_start = 0
                        for i, line in enumerate(lines):
                            if 'time' in line and 'P_Wh' in line and not line.startswith('#'):
                                header_line = line.strip()  # Remove whitespace
                                data_start = i + 1
                                break
                        
                        if header_line is None:
                            continue
                        
                        print(f"Found header at line {data_start}: {header_line}")  # Debug log
                        
                        # Create a string buffer with header and data
                        data_content = header_line + '\n' + '\n'.join(lines[data_start:])
                        
                        # Read the CSV data
                        df = pd.read_csv(io.StringIO(data_content), 
                                       delimiter=';',
                                       engine='python')
                        print(f"Successfully read {len(df)} rows")  # Debug log
                        break
                    except Exception as e:
                        last_error = e
                        continue
                
                if df is None:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Could not read file {file.filename}. Last error: {str(last_error)}"
                    )

                # Ensure the required columns exist
                required_columns = ['time', 'P_Wh']
                missing_columns = [col for col in required_columns if col not in df.columns]
                if missing_columns:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Missing required columns in file {file.filename}: {', '.join(missing_columns)}"
                    )
                
                # Extract location from filename (data_location_*.csv)
                filename_parts = file.filename.split('_')
                if len(filename_parts) < 2:
                    raise HTTPException(status_code=400, detail=f"Invalid filename format: {file.filename}")
                
                location = filename_parts[1]  # Get location from filename
                df['location'] = location

                # Convert time column to datetime
                try:
                    # First ensure the time column is a string
                    df['time'] = df['time'].astype(str)
                    # Then parse to datetime
                    df['DateTime'] = pd.to_datetime(df['time'], format='%Y-%m-%dT%H:%M:%S')
                    print(f"Converted datetime for {len(df)} rows")  # Debug log
                except Exception as e:
                    # Print the first few rows of the time column for debugging
                    sample_times = df['time'].head().tolist()
                    raise HTTPException(
                        status_code=400,
                        detail=f"Error parsing time column in file {file.filename}. Sample values: {sample_times}. Error: {str(e)}"
                    )

                dataframes[location] = df
                print(f"Successfully processed file for location: {location}")  # Debug log
                
                await update_progress(
                    20 + (i * 15 // file_count),
                    f"Successfully processed file for location: {location}"
                )
                
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Error processing file {file.filename}: {str(e)}"
                )

        if not dataframes:
            raise HTTPException(status_code=400, detail="No valid data files were processed")

        # Combine dataframes
        await update_progress(40, "Combining dataframes...")
        df = pd.concat(dataframes.values())
        
        # Convert power to MWh
        df['P_MWh'] = df['P_Wh'] / 1000000
        await update_progress(50, "Converted power values")

        # Simulate consumption
        await update_progress(60, "Starting consumption simulation...")
        df_uc = simulate_consumption(df)
        await update_progress(70, "Consumption simulation completed")
        
        # Simulate BESS
        await update_progress(80, "Starting BESS simulation...")
        df_bess = simulate_bess(df.merge(df_uc, on='DateTime'))
        await update_progress(90, "BESS simulation completed")

        # Prepare results
        await update_progress(95, "Preparing results...")
        results = []
        for location in df['location'].unique():
            location_data = df_bess[df_bess['location'] == location]
            
            # Downsample data for charts (e.g., to hourly intervals for better performance)
            downsampled_data = downsample_data(location_data, freq='1H')
            
            # Convert to list of dicts more efficiently with value cleaning
            hourly_data = downsampled_data.apply(
                lambda row: {
                    'timestamp': row['DateTime'].isoformat(),
                    'production': clean_float_value(row['P_MWh']),
                    'consumption': clean_float_value(row['C_MWh']),
                    'batteryCharge': clean_float_value(row['bess_charge_end']),
                    'netEnergy': clean_float_value(row['net_energy'])
                },
                axis=1
            ).tolist()
            
            # Calculate summary statistics from original (non-downsampled) data
            # with value cleaning
            summary = {
                'totalProduction': clean_float_value(location_data['P_MWh'].sum()),
                'totalConsumption': clean_float_value(location_data['C_MWh'].sum()),
                'maxBatteryCharge': clean_float_value(location_data['bess_charge_end'].max())
            }
            
            results.append({
                'location': location,
                'hourlyData': hourly_data,
                'summary': summary
            })
        
        await update_progress(100, "Simulation completed successfully")
        # Signal end of progress updates
        await progress_queue.put(None)
        
        return {"data": results}
        
    except HTTPException as he:
        await progress_queue.put(None)
        raise he
    except Exception as e:
        await progress_queue.put(None)
        raise HTTPException(status_code=500, detail=str(e))

def simulate_consumption(df):
    """Simulate consumption patterns using vectorized operations."""
    print("Starting optimized consumption simulation...")  # Debug log
    
    df_uc = df[['DateTime']].copy()
    st_dev = 0.050
    
    # Create hour categories for vectorized operations
    hours = df_uc['DateTime'].dt.hour
    
    # Generate random values for each category at once
    n_rows = len(df_uc)
    
    # Night hours (1-6)
    night_mask = hours.between(1, 6)
    night_values = np.random.normal(0.075, st_dev, n_rows)
    night_values = np.clip(night_values, 0.050, 0.100)
    
    # Morning peak (7-8)
    morning_mask = hours.between(7, 8)
    morning_values = np.random.normal(0.200, st_dev, n_rows)
    morning_values = np.clip(morning_values, 0.150, 0.300)
    
    # Mid-day peak (9-12)
    midday_mask = hours.between(9, 12)
    midday_values = np.random.normal(0.550, st_dev, n_rows)
    midday_values = np.clip(midday_values, 0.450, 0.700)
    
    # Afternoon (13-14)
    afternoon_mask = hours.between(13, 14)
    afternoon_values = np.random.normal(0.500, st_dev, n_rows)
    afternoon_values = np.clip(afternoon_values, 0.400, 0.600)
    
    # Evening/Other hours
    other_values = np.random.normal(0.150, st_dev, n_rows)
    other_values = np.clip(other_values, 0.100, 0.200)
    
    # Combine all values using masks
    df_uc['C_MWh'] = other_values  # Default values
    df_uc.loc[night_mask, 'C_MWh'] = night_values[night_mask]
    df_uc.loc[morning_mask, 'C_MWh'] = morning_values[morning_mask]
    df_uc.loc[midday_mask, 'C_MWh'] = midday_values[midday_mask]
    df_uc.loc[afternoon_mask, 'C_MWh'] = afternoon_values[afternoon_mask]
    
    print("Consumption simulation completed")  # Debug log
    return df_uc

def simulate_bess(df):
    """Simulate battery energy storage system behavior using vectorized operations."""
    print("Starting optimized BESS simulation...")  # Debug log
    
    bess_max_mwh = 2.0
    bess_min_charge_pct = 0.1
    bess_loss = 0.02
    bess_initial_charge = 0.0

    # Create a copy of the dataframe to avoid modifying the original
    df_bess = df.copy()
    
    # Initialize arrays for charge levels
    df_bess['bess_charge_start'] = 0.0
    df_bess['bess_charge_end'] = 0.0
    
    # Clean input data
    df_bess['P_MWh'] = df_bess['P_MWh'].fillna(0).clip(lower=0)
    df_bess['C_MWh'] = df_bess['C_MWh'].fillna(0).clip(lower=0)
    
    # Process each location separately to maintain independence
    for location in df_bess['location'].unique():
        location_mask = df_bess['location'] == location
        location_data = df_bess[location_mask].copy()
        
        # Sort by datetime to ensure proper sequence
        location_data = location_data.sort_values('DateTime')
        
        # Reset charge at the start of each day
        day_starts = location_data['DateTime'].dt.hour == 0
        location_data.loc[day_starts, 'bess_charge_start'] = bess_initial_charge
        
        # Calculate charge levels
        for i in range(len(location_data)):
            if i > 0 and not day_starts.iloc[i]:
                location_data.iloc[i, location_data.columns.get_loc('bess_charge_start')] = \
                    location_data.iloc[i-1, location_data.columns.get_loc('bess_charge_end')]
            
            row = location_data.iloc[i]
            
            # Ensure charge start is within bounds
            charge_start = np.clip(row['bess_charge_start'], 0, bess_max_mwh)
            
            if row['P_MWh'] > row['C_MWh']:
                # Charging scenario
                bess_available_load = max(row['P_MWh'] - row['C_MWh'], 0)
                prod_to_bess = min(bess_available_load, bess_max_mwh - charge_start)
                charge_end = charge_start + prod_to_bess
            else:
                # Discharging scenario
                bess_available_disch = max(row['C_MWh'] - row['P_MWh'], 0)
                bess_hourly_loss = bess_loss * charge_start
                bess_to_consumption = min(
                    bess_available_disch,
                    charge_start - bess_min_charge_pct * bess_max_mwh
                )
                charge_end = charge_start - bess_to_consumption - bess_hourly_loss
            
            # Ensure final charge is within bounds
            charge_end = np.clip(charge_end, 0, bess_max_mwh)
            location_data.iloc[i, location_data.columns.get_loc('bess_charge_end')] = charge_end
        
        # Update the main dataframe with the processed location data
        df_bess.loc[location_mask] = location_data
    
    print("BESS simulation completed")  # Debug log
    return df_bess

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 