"""
Diagnostic test: Run Playwright inside the same async context that uvicorn creates.
This simulates exactly what happens when a FastAPI route calls the BrowserAgent.
"""
import asyncio
import sys
import os
import traceback

# Set UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

async def test_in_uvicorn_context():
    print("=== Uvicorn-Context Playwright Test ===")
    print(f"Python: {sys.version}")
    print(f"Platform: {sys.platform}")
    print(f"Event loop: {type(asyncio.get_event_loop()).__name__}")
    print(f"Event loop policy: {asyncio.get_event_loop_policy().__class__.__name__}")
    
    from playwright.async_api import async_playwright
    
    try:
        print("\n[1] Starting async_playwright()...")
        pw = await async_playwright().start()
        print("[1] async_playwright started OK")
        
        print("\n[2] Launching Chromium headless...")
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        print("[2] Chromium launched OK")
        
        print("\n[3] Creating browser context...")
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()
        print("[3] Page created OK")
        
        print("\n[4] Navigating to https://example.com...")
        await page.goto("https://example.com", wait_until="domcontentloaded", timeout=15000)
        title = await page.title()
        print(f"[4] Navigation OK: title='{title}'")
        
        print("\n[5] Cleanup...")
        await page.close()
        await context.close()
        await browser.close()
        await pw.stop()
        print("[5] All cleaned up OK")
        
        print("\n>>> ALL TESTS PASSED <<<")
        return True
        
    except Exception as e:
        print(f"\n>>> ERROR: {type(e).__name__}: {e}")
        traceback.print_exc()
        return False


async def simulate_uvicorn_task():
    """Simulate how uvicorn runs tasks - creates a background task on the event loop"""
    print("\n=== Simulating uvicorn create_task() pattern ===")
    loop = asyncio.get_running_loop()
    
    # This is exactly what task_manager.py does:
    # background_task = loop.create_task(self._execute_agent(task_id, agent))
    task = loop.create_task(test_in_uvicorn_context())
    result = await task
    return result


if __name__ == "__main__":
    # Simulate what uvicorn does: use asyncio.run() which creates a new event loop
    print("Testing direct asyncio.run() call...")
    result = asyncio.run(simulate_uvicorn_task())
    if result:
        print("\nSUCCESS: Playwright works inside create_task() context")
    else:
        print("\nFAILED: Check errors above")
