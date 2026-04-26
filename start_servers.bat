@echo off
cd /d %~dp0backend
start "" python -m uvicorn main:app --port 8000
cd /d %~dp0frontend
start "" npm run dev -- --port 5173
echo Servers started in separate windows.
