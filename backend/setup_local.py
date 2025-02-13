import os
import subprocess
import sys
import venv
from pathlib import Path

def setup_venv():
    """Create and setup virtual environment"""
    venv_path = Path("venv")
    if not venv_path.exists():
        print("Creating virtual environment...")
        venv.create("venv", with_pip=True)
    
    # Determine the pip path based on the operating system
    if sys.platform == "win32":
        pip_path = venv_path / "Scripts" / "pip"
    else:
        pip_path = venv_path / "bin" / "pip"
    
    # Install requirements
    print("Installing requirements...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"])

def setup_env():
    """Setup environment file if it doesn't exist"""
    if not os.path.exists(".env"):
        print("Creating .env file...")
        with open(".env.example", "r") as example, open(".env", "w") as env:
            env.write(example.read())

def main():
    try:
        # Create virtual environment and install dependencies
        setup_venv()
        
        # Setup environment file
        setup_env()
        
        print("\nSetup completed successfully!")
        print("\nTo run the backend locally:")
        if sys.platform == "win32":
            print("1. .\\venv\\Scripts\\activate")
        else:
            print("1. source venv/bin/activate")
        print("2. python run_local.py")
        
    except Exception as e:
        print(f"Error during setup: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 