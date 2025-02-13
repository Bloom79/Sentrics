import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_solar_data(start_date, location_params):
    """Generate synthetic solar production data for a location."""
    dates = pd.date_range(start=start_date, periods=8760, freq='h')  # One year of hourly data
    df = pd.DataFrame()
    
    # Format time column exactly as expected
    df['time'] = dates.strftime('%Y-%m-%dT%H:%M:%S')  # ISO format
    df.index = dates  # Keep the index for calculations but don't output it
    
    # Base production pattern
    hour_weights = np.zeros(24)
    hour_weights[6:20] = np.sin(np.linspace(0, np.pi, 14))  # Daylight hours
    
    # Generate production data
    production = []
    for dt in dates:
        hour = dt.hour
        month = dt.month
        
        # Base production using hour weights
        base_prod = hour_weights[hour] * location_params['max_power']
        
        # Seasonal variation
        season_factor = 1 + 0.3 * np.sin((month - 6) * np.pi / 6)  # Peak in summer
        
        # Random weather variation
        weather_factor = np.random.normal(1, 0.2)
        weather_factor = max(0, min(weather_factor, 1.5))  # Clip to reasonable range
        
        # Combine factors
        final_prod = base_prod * season_factor * weather_factor * location_params['efficiency']
        production.append(max(0, final_prod))  # Ensure non-negative
    
    df['P_Wh'] = production
    
    # Add metadata columns
    df['G(i)'] = df['P_Wh'] / location_params['efficiency']  # Approximate irradiance
    df['H_sun'] = (df['P_Wh'] > 0).astype(int)  # Sunshine hours
    df['T2m'] = generate_temperature(dates, location_params)  # Temperature data
    df['WS10m'] = generate_wind_speed(dates)  # Wind speed data
    
    # Ensure column order matches header
    df = df[['time', 'P_Wh', 'G(i)', 'H_sun', 'T2m', 'WS10m']]
    return df

def generate_temperature(dates, location_params):
    """Generate synthetic temperature data."""
    base_temp = location_params['avg_temp']
    temps = []
    for dt in dates:
        hour = dt.hour
        month = dt.month
        
        # Daily variation
        daily_var = 5 * np.sin((hour - 4) * 2 * np.pi / 24)
        
        # Seasonal variation
        seasonal_var = 10 * np.sin((month - 6) * 2 * np.pi / 12)
        
        # Random variation
        random_var = np.random.normal(0, 2)
        
        temp = base_temp + daily_var + seasonal_var + random_var
        temps.append(temp)
    
    return temps

def generate_wind_speed(dates):
    """Generate synthetic wind speed data."""
    return np.random.weibull(2, len(dates)) * 5  # Typical Weibull distribution for wind

# Location parameters
locations = {
    'dortmund': {
        'max_power': 2000000,  # 2MW peak
        'efficiency': 0.85,
        'avg_temp': 15,
        'lat': 51.514,
        'lon': 7.465
    },
    'castel_madama': {
        'max_power': 2000000,
        'efficiency': 0.88,
        'avg_temp': 20,
        'lat': 41.977,
        'lon': 12.869
    },
    'catania': {
        'max_power': 2000000,
        'efficiency': 0.90,
        'avg_temp': 25,
        'lat': 37.502,
        'lon': 15.087
    },
    'rome': {
        'max_power': 2000000,
        'efficiency': 0.87,
        'avg_temp': 22,
        'lat': 41.892,
        'lon': 12.511
    }
}

def main():
    start_date = '2023-01-01'
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Generate data for each location
    for location, params in locations.items():
        print(f"Generating data for {location}...")
        df = generate_solar_data(start_date, params)
        
        # Add header information
        header = [
            "# PVGIS-6 TMY data",
            f"# Location: {params['lat']:.3f}N, {params['lon']:.3f}E",
            f"# Elevation: {np.random.randint(0, 1000)}m",
            "# Source: PVGIS <https://joint-research-centre.ec.europa.eu/pvgis_en>",
            f"# Radiation database: PVGIS-SARAH2",
            f"# Nominal power of the PV system: {params['max_power']/1000:.0f}kW",
            f"# System losses: {(1-params['efficiency'])*100:.1f}%",
            "# Slope angle: 35 deg",
            "# Azimuth angle: 0 deg (optimum)",
            "#",
            "time;P_Wh;G(i);H_sun;T2m;WS10m"  # Actual CSV header
        ]
        
        # Save to file
        filename = f"data/Timeseries_{params['lat']}_{params['lon']}_SA3_2000kwp_crystSi_14_35deg.csv"
        
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            # Write metadata headers and CSV header
            f.write('\n'.join(header) + '\n')
            # Write data without header
            df.to_csv(f, sep=';', index=False, header=False, float_format='%.3f', 
                     encoding='utf-8', lineterminator='\n')
            
        print(f"Saved to {filename}")

if __name__ == "__main__":
    main() 