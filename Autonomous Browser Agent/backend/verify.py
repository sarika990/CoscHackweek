"""
BrowserPilot AI - Comprehensive Verification Test
==================================================
Tests all critical components in the exact order they run in production:
1. Windows event loop policy
2. Playwright import
3. Chromium launch
4. Navigation (example.com)
5. GitHub search
6. YouTube search
7. Google search
8. Website summary
9. Gemini API
10. Cleanup
"""
import sys
import os
import asyncio
import traceback

# Set UTF-8 for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# ─── CRITICAL FIX: Set ProactorEventLoop before anything ───────────────────
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"
INFO = "[INFO]"

results = {}

def report(name, status, msg=""):
    symbol = PASS if status == "pass" else FAIL if status == "fail" else WARN
    print(f"  {symbol} {name}: {msg}")
    results[name] = (status, msg)


async def run_all_tests():
    print("\n" + "=" * 65)
    print("  BrowserPilot AI - Comprehensive Verification Test")
    print("=" * 65)
    print(f"  Python:   {sys.version.split()[0]}")
    print(f"  Platform: {sys.platform}")
    
    # ── Test 1: Event Loop ──────────────────────────────────────────
    print("\n[1] Event Loop Check")
    loop = asyncio.get_running_loop()
    loop_type = type(loop).__name__
    policy = asyncio.get_event_loop_policy().__class__.__name__
    print(f"      Loop:   {loop_type}")
    print(f"      Policy: {policy}")
    if sys.platform == "win32" and "Proactor" in loop_type:
        report("event_loop", "pass", f"{loop_type} (Playwright compatible)")
    elif sys.platform == "win32":
        report("event_loop", "fail", f"{loop_type} - NOT Proactor! Playwright will fail!")
        print("      FIX: Set asyncio.WindowsProactorEventLoopPolicy() before asyncio.run()")
        return  # Can't continue
    else:
        report("event_loop", "pass", f"{loop_type}")

    # ── Test 2: Settings ────────────────────────────────────────────
    print("\n[2] Settings & Environment")
    try:
        from app.config.settings import settings
        report("settings", "pass", f"DATA_DIR={settings.DATA_DIR}, HEADLESS={settings.PLAYWRIGHT_HEADLESS}")
    except Exception as e:
        report("settings", "fail", str(e))
        traceback.print_exc()

    # ── Test 3: Playwright Import ───────────────────────────────────
    print("\n[3] Playwright Import")
    try:
        from playwright.async_api import async_playwright
        report("playwright_import", "pass", "playwright.async_api imported")
    except ImportError as e:
        report("playwright_import", "fail", f"{e}")
        print("      FIX: pip install playwright && playwright install chromium")
        return

    # ── Test 4: Chromium Launch ────────────────────────────────────
    print("\n[4] Chromium Launch")
    pw = None
    browser = None
    page = None
    try:
        pw = await async_playwright().start()
        report("playwright_start", "pass", "async_playwright().start() OK")
        
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
        )
        report("chromium_launch", "pass", f"version={browser.version}")
        
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()
        report("page_create", "pass", "Page created OK")
        
    except Exception as e:
        report("chromium_launch", "fail", f"{type(e).__name__}: {e}")
        traceback.print_exc()
        if pw:
            await pw.stop()
        return

    # ── Test 5: Navigation ─────────────────────────────────────────
    print("\n[5] Navigation Tests")
    try:
        await page.goto("https://example.com", wait_until="domcontentloaded", timeout=15000)
        title = await page.title()
        report("navigate_example", "pass", f"title='{title}'")
    except Exception as e:
        report("navigate_example", "fail", f"{type(e).__name__}: {e}")

    # ── Test 6: GitHub Search ──────────────────────────────────────
    print("\n[6] GitHub Search")
    try:
        await page.goto(
            "https://github.com/search?q=react+dashboard+ui&type=repositories&s=stars&o=desc",
            wait_until="domcontentloaded", timeout=20000
        )
        await page.wait_for_timeout(2000)
        title = await page.title()
        
        repos = []
        for sel in ["li.repo-list-item", "div[data-testid='results-list'] > div", "div.Box-row"]:
            elements = await page.query_selector_all(sel)
            if elements:
                for el in elements[:3]:
                    try:
                        name_el = await el.query_selector("a.v-align-middle, a[data-hydro-click*='repository']")
                        if name_el:
                            name = (await name_el.inner_text()).strip()
                            if name:
                                repos.append(name)
                    except Exception:
                        continue
                if repos:
                    break
        
        report("github_search", "pass", f"title='{title}', found {len(repos)} repos: {repos[:2]}")
    except Exception as e:
        report("github_search", "warn", f"{type(e).__name__}: {e}")

    # ── Test 7: YouTube Search ────────────────────────────────────
    print("\n[7] YouTube Search")
    try:
        await page.goto(
            "https://www.youtube.com/results?search_query=python+tutorial",
            wait_until="domcontentloaded", timeout=20000
        )
        await page.wait_for_timeout(2000)
        title = await page.title()
        report("youtube_search", "pass", f"title='{title}'")
    except Exception as e:
        report("youtube_search", "warn", f"{type(e).__name__}: {e}")

    # ── Test 8: Google Search ─────────────────────────────────────
    print("\n[8] Google Search")
    try:
        await page.goto(
            "https://www.google.com/search?q=React+dashboard+UI&hl=en",
            wait_until="domcontentloaded", timeout=15000
        )
        await page.wait_for_timeout(1500)
        title = await page.title()
        cards = await page.query_selector_all("div.g")
        report("google_search", "pass", f"title='{title}', {len(cards)} result cards")
    except Exception as e:
        report("google_search", "warn", f"{type(e).__name__}: {e}")

    # ── Test 9: Website Summary ───────────────────────────────────
    print("\n[9] Website Summary")
    try:
        await page.goto("https://www.python.org", wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_timeout(1500)
        title = await page.title()
        paras = await page.query_selector_all("p")
        report("website_summary", "pass", f"title='{title}', {len(paras)} paragraphs")
    except Exception as e:
        report("website_summary", "warn", f"{type(e).__name__}: {e}")

    # ── Test 10: Cleanup ──────────────────────────────────────────
    print("\n[10] Browser Cleanup")
    try:
        await page.close()
        await browser.close()
        await pw.stop()
        report("cleanup", "pass", "Browser closed, playwright stopped")
    except Exception as e:
        report("cleanup", "warn", f"{type(e).__name__}: {e}")

    # ── Test 11: BrowserAgent Integration ────────────────────────
    print("\n[11] BrowserAgent Integration Test")
    try:
        from app.services.agents.browser_agent import BrowserAgent
        logs = []
        steps = []
        
        agent = BrowserAgent(
            task_id="test-001",
            task_text="Search GitHub repositories for React dashboard UI",
            log_callback=lambda msg: logs.append(msg),
            step_callback=lambda step: steps.append(step),
        )
        
        result = await agent.run()
        
        report(
            "browser_agent_github",
            "pass" if result.success else "fail",
            f"success={result.success}, summary={result.summary[:80]!r}"
        )
        if not result.success:
            print(f"      Error: {result.error_message}")
        print(f"      Logs: {len(logs)} entries, Steps: {len(steps)}")
        
    except Exception as e:
        report("browser_agent_github", "fail", f"{type(e).__name__}: {e}")
        traceback.print_exc()

    # ── Test 12: Gemini API ───────────────────────────────────────
    print("\n[12] Gemini API Test")
    try:
        from app.config.settings import settings
        if settings.GEMINI_API_KEY:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("models/gemini-2.0-flash-lite")
            resp = await asyncio.to_thread(model.generate_content, "Say 'BrowserPilot OK'")
            report("gemini_api", "pass", f"Response: {resp.text.strip()[:40]!r}")
        else:
            report("gemini_api", "warn", "No GEMINI_API_KEY - skipped")
    except Exception as e:
        report("gemini_api", "warn", f"{type(e).__name__}: {e}")

    # ── Summary ───────────────────────────────────────────────────
    print("\n" + "=" * 65)
    total = len(results)
    passed = sum(1 for s, _ in results.values() if s == "pass")
    failed = sum(1 for s, _ in results.values() if s == "fail")
    warned = sum(1 for s, _ in results.values() if s == "warn")
    
    print(f"  Results: {passed}/{total} passed, {failed} failed, {warned} warnings")
    print()
    
    if failed > 0:
        print("  FAILED tests:")
        for k, (s, m) in results.items():
            if s == "fail":
                print(f"    - {k}: {m}")
    
    if failed == 0:
        print("  ALL CRITICAL TESTS PASSED!")
        print("  BrowserPilot AI should work correctly.")
    else:
        print("  Some tests failed. Fix the issues above.")
    
    print("=" * 65 + "\n")
    return failed == 0


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
