import subprocess
import os
import time

def run_project():
    print("Stopping current processes on ports 8000 and 5173...")
    # Port 8000
    try:
        output8000 = subprocess.check_output('netstat -ano | findstr :8000', shell=True).decode()
        for line in output8000.strip().split('\n'):
            if 'LISTENING' in line:
                pid = line.strip().split()[-1]
                if pid != '0':
                    subprocess.run(f'taskkill /F /PID {pid}', shell=True)
                    print(f"Killed process {pid} on port 8000")
    except:
        print("Port 8000 is already free")
        
    # Port 5173
    try:
        output5173 = subprocess.check_output('netstat -ano | findstr :5173', shell=True).decode()
        for line in output5173.strip().split('\n'):
            if 'LISTENING' in line:
                pid = line.strip().split()[-1]
                if pid != '0':
                    subprocess.run(f'taskkill /F /PID {pid}', shell=True)
                    print(f"Killed process {pid} on port 5173")
    except:
        print("Port 5173 is already free")

    # Start Backend
    backend_path = os.path.join(os.getcwd(), "backend")
    print(f"Starting backend from {backend_path}...")
    backend_process = subprocess.Popen(
        [r"venv\Scripts\python.exe", "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
        cwd=backend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )
    
    # Start Frontend
    frontend_path = os.path.join(os.getcwd(), "frontend")
    print(f"Starting frontend from {frontend_path}...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", "5173"],
        cwd=frontend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )

    print("Project started. Use browser to verify.")
    time.sleep(5)
    print("Backend state:", backend_process.poll() or "Running")
    print("Frontend state:", frontend_process.poll() or "Running")

if __name__ == "__main__":
    run_project()
