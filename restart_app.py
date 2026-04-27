import subprocess
import os
import time

def restart():
    # Paths
    root = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root, "backend")
    frontend_dir = os.path.join(root, "frontend")
    
    # Kill existing (just in case)
    print("Ensuring ports are free...")
    for port in [8000, 5173]:
        try:
            output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True).decode()
            for line in output.strip().split('\n'):
                if 'LISTENING' in line:
                    pid = line.strip().split()[-1]
                    if pid != '0':
                        print(f"Killing process {pid} on port {port}")
                        subprocess.run(f'taskkill /F /PID {pid}', shell=True)
        except:
            pass

    # Start Backend
    print("Starting Backend in new window...")
    backend_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    if not os.path.exists(backend_python):
        backend_python = "python" # fallback
        
    subprocess.Popen(
        [backend_python, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
        cwd=backend_dir,
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

    # Start Frontend
    print("Starting Frontend in new window...")
    subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", "5173"],
        cwd=frontend_dir,
        creationflags=subprocess.CREATE_NEW_CONSOLE,
        shell=True
    )

    print("\nShadowVault restarted!")
    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:5173")

if __name__ == "__main__":
    restart()
