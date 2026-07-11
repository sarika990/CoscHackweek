"""
BrowserPilot AI - FastAPI Application
=======================================
Startup diagnostics, CORS, static files, and route registration.
"""
import sys
import os
import asyncio
import logging
import traceback
from contextlib import asynccontextmanager

# ─── CRITICAL: Ensure correct Windows event loop policy ───────────────────────
# This guard runs when the module is imported (e.g. by uvicorn worker).
# Must happen BEFORE any async code runs.
if sys.platform == "win32":
    policy = asyncio.get_event_loop_policy()
    if not isinstance(policy, asyncio.WindowsProactorEventLoopPolicy):
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        logging.getLogger("browseragent").info(
            "Switched event loop policy to WindowsProactorEventLoopPolicy"
        )

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.routes.tasks import router as tasks_router

logger = logging.getLogger("browseragent")

# ─── Startup Diagnostics ──────────────────────────────────────────────────────

async def run_startup_diagnostics():
    """Run comprehensive startup checks and log results."""
    results = {}
    
    print("\n" + "=" * 60)
    print("  BrowserPilot AI - Startup Diagnostics")
    print("=" * 60)
    
    # 1. Environment variables
    try:
        gemini_key = settings.GEMINI_API_KEY
        if gemini_key:
            results["env_vars"] = ("OK", f"GEMINI_API_KEY set ({len(gemini_key)} chars)")
        else:
            results["env_vars"] = ("WARN", "GEMINI_API_KEY not set - AI features disabled")
        print(f"  [ENV]       {results['env_vars'][1]}")
    except Exception as e:
        results["env_vars"] = ("FAIL", f"Env config error: {e}")
        print(f"  [ENV]       FAIL: {e}")
    
    # 2. Data directory
    try:
        os.makedirs(settings.DATA_DIR, exist_ok=True)
        os.makedirs(os.path.join(settings.DATA_DIR, "screenshots"), exist_ok=True)
        os.makedirs(os.path.join(settings.DATA_DIR, "downloads"), exist_ok=True)
        results["data_dir"] = ("OK", f"Data dir ready: {settings.DATA_DIR}")
        print(f"  [DATA DIR]  {results['data_dir'][1]}")
    except Exception as e:
        results["data_dir"] = ("FAIL", f"Data dir error: {e}")
        print(f"  [DATA DIR]  FAIL: {e}")
    
    # 3. Event loop
    try:
        loop = asyncio.get_running_loop()
        loop_type = type(loop).__name__
        policy_type = asyncio.get_event_loop_policy().__class__.__name__
        if sys.platform == "win32" and "Proactor" not in loop_type:
            results["event_loop"] = ("WARN", f"Loop={loop_type} (SelectorEventLoop may break Playwright on Windows!)")
        else:
            results["event_loop"] = ("OK", f"Loop={loop_type}, Policy={policy_type}")
        print(f"  [LOOP]      {results['event_loop'][1]}")
    except Exception as e:
        results["event_loop"] = ("FAIL", str(e))
        print(f"  [LOOP]      FAIL: {e}")
    
    # 4. Playwright import
    try:
        from playwright.async_api import async_playwright
        results["playwright_import"] = ("OK", "playwright module imported")
        print(f"  [PLAYWRIGHT] OK - module imported")
    except ImportError as e:
        results["playwright_import"] = ("FAIL", f"playwright not installed: {e}")
        print(f"  [PLAYWRIGHT] FAIL - not installed: {e}")
        print("    -> Run: pip install playwright && playwright install chromium")
        return results  # Can't test further
    
    # 5. Chromium executable
    try:
        import subprocess
        result = subprocess.run(
            [sys.executable, "-c", 
             "from playwright.sync_api import sync_playwright; "
             "p = sync_playwright().start(); "
             "path = p.chromium.executable_path; "
             "p.stop(); print(path)"],
            capture_output=True, text=True, timeout=10
        )
        chromium_path = result.stdout.strip()
        if chromium_path and os.path.exists(chromium_path):
            results["chromium"] = ("OK", f"Chromium at: {chromium_path}")
            print(f"  [CHROMIUM]  OK - {chromium_path}")
        else:
            results["chromium"] = ("FAIL", f"Chromium not found. stdout={result.stdout!r} stderr={result.stderr!r}")
            print(f"  [CHROMIUM]  FAIL - not found")
            print(f"    -> Run: playwright install chromium")
    except Exception as e:
        results["chromium"] = ("FAIL", f"Chromium check error: {e}")
        print(f"  [CHROMIUM]  FAIL: {e}")
    
    # 6. Browser launch test
    try:
        from playwright.async_api import async_playwright
        pw = await async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        version = browser.version
        page = await browser.new_page()
        await page.goto("about:blank")
        await page.close()
        await browser.close()
        await pw.stop()
        results["browser_launch"] = ("OK", f"Chromium {version} launched and closed successfully")
        print(f"  [BROWSER]   OK - Chromium {version} launched")
    except Exception as e:
        results["browser_launch"] = ("FAIL", f"Browser launch failed: {type(e).__name__}: {e}")
        print(f"  [BROWSER]   FAIL: {type(e).__name__}: {e}")
        traceback.print_exc()
    
    # 7. Gemini API
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
            resp = await asyncio.to_thread(model.generate_content, "Say 'OK'")
            results["gemini"] = ("OK", f"Gemini API working - response: {resp.text.strip()[:30]!r}")
            print(f"  [GEMINI]    OK - API connected")
        except Exception as e:
            results["gemini"] = ("WARN", f"Gemini API error: {type(e).__name__}: {e}")
            print(f"  [GEMINI]    WARN: {type(e).__name__}: {e}")
    else:
        results["gemini"] = ("SKIP", "No API key - skipped")
        print(f"  [GEMINI]    SKIP - no API key")
    
    # Summary
    print("=" * 60)
    failures = [k for k, (s, _) in results.items() if s == "FAIL"]
    if failures:
        print(f"  DIAGNOSTICS COMPLETE - {len(failures)} issue(s) found: {failures}")
    else:
        print("  DIAGNOSTICS COMPLETE - All checks passed!")
    print("=" * 60 + "\n")
    
    return results


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup diagnostics, then yield for app lifetime, then cleanup."""
    await run_startup_diagnostics()
    yield
    # Cleanup on shutdown
    logger.info("BrowserPilot AI shutting down...")


# ─── FastAPI App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="BrowserPilot AI API",
    description="Backend API for managing AI-driven browser automation tasks",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task runner routes
app.include_router(tasks_router)

# Mount static files to serve task outputs/screenshots
screenshots_path = os.path.join(settings.DATA_DIR, "screenshots")
downloads_path = os.path.join(settings.DATA_DIR, "downloads")

os.makedirs(screenshots_path, exist_ok=True)
os.makedirs(downloads_path, exist_ok=True)

app.mount("/static/screenshots", StaticFiles(directory=screenshots_path), name="screenshots")
app.mount("/static/downloads", StaticFiles(directory=downloads_path), name="downloads")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BrowserPilot AI Engine",
        "version": "1.0.0",
        "ai_enabled": settings.GEMINI_API_KEY != "",
        "platform": sys.platform,
    }


@app.get("/api/diagnostics")
async def get_diagnostics():
    """Run and return full diagnostic check results."""
    results = await run_startup_diagnostics()
    return {
        "diagnostics": {k: {"status": s, "message": m} for k, (s, m) in results.items()},
        "platform": sys.platform,
        "python_version": sys.version,
        "event_loop_policy": asyncio.get_event_loop_policy().__class__.__name__,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=False)
