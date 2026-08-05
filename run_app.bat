@echo off
echo ========================================================
echo Starting CareerPilot AI Full-Stack Application...
echo ========================================================

echo 1. Starting Backend Server on http://localhost:5000 ...
start "CareerPilot AI Backend Server" cmd /k "cd /d "%~dp0server" && npm install && npm run dev"

echo 2. Starting Frontend App on http://localhost:5173 ...
start "CareerPilot AI Frontend App" cmd /k "cd /d "%~dp0client" && npm install && npm run dev"

echo ========================================================
echo Launching browser window...
echo ========================================================
timeout /t 5
start http://localhost:5173
