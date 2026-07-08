@echo off
echo.
echo ========================================
echo   BrowserPilot AI - Startup Script
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting FastAPI Backend on port 8000...
start "BrowserPilot Backend" cmd /k "cd /d %~dp0backend && python run.py"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Vite Frontend on port 3000...
start "BrowserPilot Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo  BrowserPilot AI is starting up!
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:3000
echo  API Docs: http://localhost:8000/docs
echo ========================================
echo.
pause
