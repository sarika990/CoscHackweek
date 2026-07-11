"""
BrowserPilot AI - Backend Entry Point
======================================
Windows asyncio fix: Must set ProactorEventLoop policy BEFORE uvicorn/FastAPI starts.
The WindowsSelectorEventLoopPolicy (set by uvicorn reload mode) breaks Playwright
subprocess creation. We force ProactorEventLoop which is required for Playwright on Windows.
"""
import sys
import os

# ─── CRITICAL: Fix Windows asyncio event loop BEFORE any other imports ────────
# Playwright uses asyncio.create_subprocess_exec() internally.
# On Windows, this requires ProactorEventLoop (not SelectorEventLoop).
# uvicorn with reload=True sets WindowsSelectorEventLoopPolicy which breaks Playwright.
if sys.platform == "win32":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Set UTF-8 output encoding for Windows console
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import uvicorn
from app.config.settings import settings

if __name__ == "__main__":
    print("=" * 60)
    print("  BrowserPilot AI - Backend Server")
    print("=" * 60)
    print(f"  Host:    {settings.HOST}")
    print(f"  Port:    {settings.PORT}")
    print(f"  Headless: {settings.PLAYWRIGHT_HEADLESS}")
    print(f"  Python:  {sys.version.split()[0]}")
    if sys.platform == "win32":
        import asyncio
        print(f"  Loop:    {asyncio.get_event_loop_policy().__class__.__name__}")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        # NOTE: reload=True is DISABLED on Windows because it triggers
        # WindowsSelectorEventLoopPolicy which breaks Playwright subprocess creation.
        # Use reload=False for production-style stability with Playwright.
        reload=False,
        loop="none",           # Tell uvicorn NOT to change the event loop policy
        log_level="info",
        access_log=True,
    )
