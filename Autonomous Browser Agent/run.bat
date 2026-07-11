@echo off
chcp 65001 >nul 2>&1
echo.
echo ========================================
echo   BrowserPilot AI - Startup Script
echo ========================================
echo.

REM Set PYTHONIOENCODING to UTF-8 for Windows console compatibility
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1

REM Start Backend
echo [1/2] Starting FastAPI Backend on port 8000...
echo       Note: reload=False is required for Playwright on Windows
start "BrowserPilot Backend" cmd /k "chcp 65001 >nul && set PYTHONIOENCODING=utf-8 && set PYTHONUTF8=1 && cd /d %~dp0backend && venv\Scripts\python.exe run.py"
timeout /t 4 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Vite Frontend on port 3000...
start "BrowserPilot Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo  BrowserPilot AI is starting up!
echo  Backend:      http://localhost:8000
echo  Frontend:     http://localhost:3000
echo  API Docs:     http://localhost:8000/docs
echo  Diagnostics:  http://localhost:8000/api/diagnostics
echo ========================================
echo.
echo  Windows Note: reload=False is required for Playwright.
echo  The ProactorEventLoop is set automatically in run.py.
echo.
pause
