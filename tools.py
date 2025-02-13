import json
import os
import subprocess
from typing import Optional, Dict, Any, List
import psycopg2
import shutil
from datetime import datetime

# Hardcoded credentials for testing
SUPABASE_URL = "https://zcudjmlgfwhecjseybrl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWRqbWxnZndoZWNqc2V5YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTcwMjUsImV4cCI6MjA1MTc3MzAyNX0.y6h_tUWvXfoeCMG36tdL20DfBqKhsKPqq8aaw10rie4"

def query_supabase(table: str, select: str = '*', options: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Query the Supabase database
    """
    try:
        import httpx

        url = f"{SUPABASE_URL}/rest/v1/{table}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        params = {"select": select}
        if options:
            params.update(options)

        print(f"\nQuerying table: {table}")
        response = httpx.get(url, headers=headers, params=params)
        response.raise_for_status()
        results = response.json()
        print(f"Results: {json.dumps(results, indent=2)}\n")
        return results

    except Exception as e:
        print(f"Error querying Supabase: {str(e)}")
        return []

def dump_schema():
    """
    Dump the database schema using pg_dump
    """
    try:
        # Get database URL from Supabase settings
        response = subprocess.run(
            [
                "pg_dump",
                "--host", "db.zcudjmlgfwhecjseybrl.supabase.co",
                "--port", "5432",
                "--username", "postgres",
                "--dbname", "postgres",
                "--schema-only",
                "--no-owner",
                "--no-privileges"
            ],
            capture_output=True,
            text=True,
            env={
                **os.environ,
                "PGPASSWORD": SUPABASE_KEY
            }
        )
        
        if response.returncode == 0:
            print("Schema dump successful!")
            print("\nDatabase Schema:")
            print("================")
            print(response.stdout)
            
            # Save to file
            with open('database_schema.sql', 'w') as f:
                f.write(response.stdout)
            print("\nSchema has been saved to database_schema.sql")
            
            return {
                'success': True,
                'schema': response.stdout
            }
        else:
            print(f"Error dumping schema: {response.stderr}")
            return {
                'success': False,
                'error': response.stderr
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

def check_database_connection() -> Dict[str, Any]:
    """Check if the database connection is working."""
    try:
        conn = psycopg2.connect(
            dbname="sentrics",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5433"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return {"status": "success", "version": version}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def check_communities_table() -> Dict[str, Any]:
    """Check if the communities table exists and its structure."""
    try:
        conn = psycopg2.connect(
            dbname="sentrics",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5433"
        )
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'energy_communities'
            );
        """)
        table_exists = cursor.fetchone()[0]
        
        if table_exists:
            # Get table structure
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'energy_communities';
            """)
            columns = cursor.fetchall()
            
            # Get row count
            cursor.execute("SELECT COUNT(*) FROM energy_communities;")
            row_count = cursor.fetchone()[0]
            
            return {
                "status": "success",
                "exists": True,
                "columns": columns,
                "row_count": row_count
            }
        else:
            return {
                "status": "success",
                "exists": False
            }
            
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def list_communities() -> Dict[str, Any]:
    """List all communities in the database."""
    try:
        conn = psycopg2.connect(
            dbname="sentrics",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5433"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM energy_communities;")
        communities = cursor.fetchall()
        
        if cursor.description:
            columns = [desc[0] for desc in cursor.description]
            communities_list = [dict(zip(columns, row)) for row in communities]
            return {
                "status": "success",
                "communities": communities_list
            }
        return {
            "status": "success",
            "communities": []
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        cursor.close()
        conn.close()

def apply_migrations() -> Dict[str, Any]:
    """Apply database migrations."""
    try:
        conn = psycopg2.connect(
            dbname="sentrics",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5433"
        )
        cursor = conn.cursor()
        
        try:
            # Create PostGIS extension if it doesn't exist
            cursor.execute("""
                CREATE EXTENSION IF NOT EXISTS postgis;
                CREATE EXTENSION IF NOT EXISTS postgis_topology;
            """)
            
            # Create energy_communities table if it doesn't exist
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS energy_communities (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    legal_type VARCHAR(50) NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending',
                    gse_compliance_status VARCHAR(50),
                    primary_substation_id VARCHAR(255) NOT NULL,
                    boundary GEOMETRY(POLYGON, 4326),
                    total_capacity DECIMAL NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
                );
                
                -- Create indexes if they don't exist
                CREATE INDEX IF NOT EXISTS idx_energy_communities_boundary 
                ON energy_communities USING gist (boundary);
                
                -- Create community_members table if it doesn't exist
                CREATE TABLE IF NOT EXISTS community_members (
                    id SERIAL PRIMARY KEY,
                    community_id INTEGER NOT NULL REFERENCES energy_communities(id) ON DELETE CASCADE,
                    member_type VARCHAR(50) NOT NULL,
                    pod_id VARCHAR(255) NOT NULL,
                    smart_meter_id VARCHAR(255),
                    location GEOMETRY(POINT, 4326),
                    sharing_preferences JSONB,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
                );
                
                -- Create indexes if they don't exist
                CREATE INDEX IF NOT EXISTS idx_community_members_community_id 
                ON community_members(community_id);
                CREATE INDEX IF NOT EXISTS idx_community_members_location 
                ON community_members USING gist (location);
            """)
            
            conn.commit()
            return {
                "status": "success",
                "message": "Migrations applied successfully"
            }
        except Exception as e:
            conn.rollback()
            raise e
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    finally:
        cursor.close()
        conn.close()

def insert_sample_communities() -> Dict[str, Any]:
    """Insert sample communities into the database."""
    try:
        conn = psycopg2.connect(
            dbname="sentrics",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5433"
        )
        cursor = conn.cursor()
        
        try:
            # Create PostGIS extension if it doesn't exist
            cursor.execute("""
                CREATE EXTENSION IF NOT EXISTS postgis;
                CREATE EXTENSION IF NOT EXISTS postgis_topology;
            """)
            
            # Sample communities data
            communities = [
                {
                    "name": "Dortmund Solar Community",
                    "legal_type": "cooperative",
                    "status": "active",
                    "primary_substation_id": "DOR001",
                    "total_capacity": 150.0,
                    "boundary": "POLYGON((7.45 51.51, 7.47 51.51, 7.47 51.52, 7.45 51.52, 7.45 51.51))"
                },
                {
                    "name": "Rome Energy Cooperative",
                    "legal_type": "cooperative",
                    "status": "active",
                    "primary_substation_id": "ROM001",
                    "total_capacity": 180.0,
                    "boundary": "POLYGON((12.48 41.89, 12.50 41.89, 12.50 41.90, 12.48 41.90, 12.48 41.89))"
                },
                {
                    "name": "Catania Green Energy",
                    "legal_type": "association",
                    "status": "pending",
                    "primary_substation_id": "CAT001",
                    "total_capacity": 120.0,
                    "boundary": "POLYGON((15.07 37.50, 15.09 37.50, 15.09 37.51, 15.07 37.51, 15.07 37.50))"
                }
            ]
            
            # Insert communities
            for community in communities:
                print(f"Inserting community: {community['name']}")
                cursor.execute("""
                    INSERT INTO energy_communities 
                    (name, legal_type, status, primary_substation_id, total_capacity, boundary)
                    VALUES (%s, %s, %s, %s, %s, ST_GeomFromText(%s, 4326))
                """, (
                    community["name"],
                    community["legal_type"],
                    community["status"],
                    community["primary_substation_id"],
                    community["total_capacity"],
                    community["boundary"]
                ))
            
            conn.commit()
            return {
                "status": "success",
                "message": "Sample communities inserted successfully"
            }
        except Exception as e:
            conn.rollback()
            print(f"Error during insert: {str(e)}")
            raise e
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
    finally:
        cursor.close()
        conn.close()

def rename_mycer_screenshots():
    # Dictionary mapping old filenames to new descriptive names
    filename_mapping = {
        "@2025-02-06 15_29_36-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_landing_page_simulation_options.png",
        "@2025-02-06 15_30_26-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_new_configuration_form.png",
        "@2025-02-06 15_30_45-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_configuration_list_view.png",
        "@2025-02-06 15_30_57-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_configuration_dashboard_overview.png",
        "@2025-02-06 15_32_09-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_configuration_members_list.png",
        "@2025-02-06 15_32_25-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_new_participant_form.png",
        "@2025-02-06 15_32_53-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_participant_user_selection.png",
        "@2025-02-06 15_33_13-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_configuration_settings_incentives.png",
        "@2025-02-06 15_33_29-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_gse_data_alignment.png",
        "@2025-02-06 15_33_51-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_energy_flow_diagram.png",
        "@2025-02-06 15_34_03-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_energy_metrics_dashboard.png",
        "@2025-02-06 15_34_15-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_energy_production_consumption_chart.png",
        "@2025-02-06 15_34_29-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_energy_savings_trend.png",
        "@2025-02-06 15_34_41-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_weather_forecast_integration.png",
        "@2025-02-06 15_35_10-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_consumption_heatmap.png",
        "@2025-02-06 15_35_23-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_billing_details.png",
        "@2025-02-06 15_39_42-(8) Piattaforma MyCER per la gestione di configurazioni energetiche - YouTube.png": "mycer_configurations_grid_view.png"
    }
    
    # Get the current directory
    current_dir = os.getcwd()
    
    # Create a backup directory with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = os.path.join(current_dir, f"screenshots_backup_{timestamp}")
    os.makedirs(backup_dir, exist_ok=True)
    
    renamed_files = []
    errors = []
    
    print(f"Starting file renaming process...")
    print(f"Created backup directory: {backup_dir}")
    
    for old_name, new_name in filename_mapping.items():
        try:
            old_path = os.path.join(current_dir, old_name)
            new_path = os.path.join(current_dir, new_name)
            backup_path = os.path.join(backup_dir, old_name)
            
            if os.path.exists(old_path):
                # Create backup
                shutil.copy2(old_path, backup_path)
                print(f"Created backup: {old_name}")
                
                # Rename file
                os.rename(old_path, new_path)
                renamed_files.append((old_name, new_name))
                print(f"Renamed: {old_name} -> {new_name}")
            else:
                errors.append(f"File not found: {old_name}")
        except Exception as e:
            errors.append(f"Error processing {old_name}: {str(e)}")
    
    # Print summary
    print("\nRenaming Summary:")
    print(f"Total files processed: {len(filename_mapping)}")
    print(f"Successfully renamed: {len(renamed_files)}")
    print(f"Errors encountered: {len(errors)}")
    
    if errors:
        print("\nErrors:")
        for error in errors:
            print(f"- {error}")
    
    print(f"\nBackup directory: {backup_dir}")
    return renamed_files, errors

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Please specify a function to run")
        sys.exit(1)
        
    function_name = sys.argv[1]
    functions = {
        "check_connection": check_database_connection,
        "check_table": check_communities_table,
        "list_communities": list_communities,
        "apply_migrations": apply_migrations,
        "insert_samples": insert_sample_communities,
        "rename_screenshots": rename_mycer_screenshots
    }
    
    if function_name not in functions:
        print(f"Unknown function: {function_name}")
        sys.exit(1)
        
    result = functions[function_name]()
    print(json.dumps(result, indent=2, default=str)) 