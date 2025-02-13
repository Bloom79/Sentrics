import os
import subprocess
import sys
import time
from pathlib import Path

def run_backend():
    """Setup and run backend"""
    print("\nSetting up backend...")
    backend_dir = Path(r"C:\Users\ebonifaz\Sentrics\backend")
    venv_dir = backend_dir / "venv"
    
    os.chdir(backend_dir)
    
    # Use existing venv
    if sys.platform == "win32":
        python_path = venv_dir / "Scripts" / "python"
        pip_path = venv_dir / "Scripts" / "pip"
    else:
        python_path = venv_dir / "bin" / "python"
        pip_path = venv_dir / "bin" / "pip"
    
    # Clean and reinstall dependencies
    print("Cleaning and reinstalling dependencies...")
    #subprocess.run([str(pip_path), "uninstall", "-y", "-r", "requirements.txt"], check=False)
    subprocess.run([str(pip_path), "install", "--no-cache-dir", "-r", "requirements.txt"], check=True)
    
    print("\nStarting backend server...")
    print(f"Using Python from: {python_path}")
    backend_process = subprocess.Popen([str(python_path), "run_local.py"])
    
    # Wait a bit for backend to start
    time.sleep(2)
    return backend_process

def run_frontend():
    """Run frontend development server"""
    print("\nStarting frontend server...")
    frontend_dir = Path(r"C:\Users\ebonifaz\Sentrics\frontend")
    
    os.chdir(frontend_dir)
    
    # Try to find npm in PATH first
    try:
        # Check if npm is available
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        npm_cmd = "npm"
    except FileNotFoundError:
        # Fallback to full path if npm not in PATH
        npm_cmd = r"C:\Program Files\nodejs\npm.cmd"
    
    print("Installing frontend dependencies...")
    try:
        # Use --legacy-peer-deps to handle dependency conflicts
        subprocess.run([npm_cmd, "install", "--legacy-peer-deps"], check=True)
        print("Starting Vite dev server...")
        frontend_process = subprocess.Popen([npm_cmd, "run", "dev"])
        return frontend_process
    except subprocess.CalledProcessError as e:
        print(f"Error running npm command: {e}")
        raise

def main():
    try:
        # Store original directory
        original_dir = os.getcwd()
        
        # Start backend
        backend_process = run_backend()
        
        # Start frontend
        frontend_process = run_frontend()
        
        print("\nBoth servers are running!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:8080")  # Updated to match vite.config.ts
        print("API Documentation: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop both servers...")
        
        # Keep the script running
        backend_process.wait()
        frontend_process.wait()
        
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped.")
    except Exception as e:
        print(f"\nError: {str(e)}")
        print("\nStack trace:")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        os.chdir(original_dir)

if __name__ == "__main__":
    main() 