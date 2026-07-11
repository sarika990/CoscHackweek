import asyncio
import sys
import traceback

async def test_browser():
    print(f"Python: {sys.version}")
    print(f"Platform: {sys.platform}")
    print(f"Event loop policy: {asyncio.get_event_loop_policy().__class__.__name__}")
    
    try:
        from playwright.async_api import async_playwright
        print("Playwright import: OK")
        
        pw = await async_playwright().start()
        print("Playwright started: OK")
        
        browser = await pw.chromium.launch(headless=True)
        print("Browser launched: OK")
        
        page = await browser.new_page()
        print("Page created: OK")
        
        await page.goto("https://example.com")
        title = await page.title()
        print(f"Navigation OK: title='{title}'")
        
        await page.close()
        await browser.close()
        await pw.stop()
        print("Browser closed: OK")
        print("\n✅ ALL TESTS PASSED")
        
    except Exception as e:
        print(f"\n❌ ERROR: {type(e).__name__}: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_browser())
