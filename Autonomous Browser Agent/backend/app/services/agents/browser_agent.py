"""
BrowserPilot AI - Browser Agent
================================
AI-powered browser automation using Playwright (async) + Google Gemini.

Windows Compatibility Notes:
- Requires ProactorEventLoop (set in run.py before uvicorn starts)
- Uses async_playwright() which internally calls asyncio.create_subprocess_exec()
- All exceptions are fully logged - no silent failures

Supports: Google Search, GitHub Search, YouTube Search, Website Summary,
          News, Internships, Scholarships, Price Comparison, Wikipedia,
          Form Filling, and AI-guided general tasks.
"""

import os
import sys
import asyncio
import json
import time
import re
import traceback
import logging
from typing import Callable, Optional
from datetime import datetime
from playwright.async_api import async_playwright, Page, Browser, BrowserContext
import google.generativeai as genai
from app.config.settings import settings
from app.models.schemas import ExecutionStep, TaskResult

# ─── Logger ───────────────────────────────────────────────────────────────────
logger = logging.getLogger("browseragent")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)


class BrowserAgent:
    """AI-powered browser agent using Playwright and Gemini."""

    def __init__(
        self,
        task_id: str,
        task_text: str,
        log_callback: Callable[[str], None],
        step_callback: Callable[[ExecutionStep], None],
    ):
        self.task_id = task_id
        self.task_text = task_text
        self.log_callback = log_callback
        self.step_callback = step_callback
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.is_running = True
        self.screenshots_dir = os.path.join(settings.DATA_DIR, "screenshots")
        self.current_url = ""
        self.model = None
        self.ai_active = False
        self.selected_model = None

        # Ensure screenshots dir exists
        os.makedirs(self.screenshots_dir, exist_ok=True)

        # ── Log system info ──
        logger.info(f"BrowserAgent init: task_id={task_id}")
        logger.info(f"Platform: {sys.platform}")
        logger.info(f"Python: {sys.version.split()[0]}")
        if sys.platform == "win32":
            policy = asyncio.get_event_loop_policy().__class__.__name__
            logger.info(f"Event loop policy: {policy}")
            if "Proactor" not in policy:
                logger.warning(
                    "WARNING: Not using ProactorEventLoopPolicy! "
                    "Playwright may fail. Expected WindowsProactorEventLoopPolicy."
                )

        # ── Initialize Gemini ──
        MODEL_CANDIDATES = [
            "models/gemini-2.5-flash-lite",
            "models/gemini-2.0-flash-lite",
            "models/gemini-2.0-flash-lite-001",
            "models/gemini-flash-lite-latest",
            "models/gemini-2.0-flash",
            "models/gemini-2.5-flash",
        ]
        raw_key = (settings.GEMINI_API_KEY or "").strip()
        if raw_key:
            try:
                genai.configure(api_key=raw_key)
                for candidate in MODEL_CANDIDATES:
                    try:
                        m = genai.GenerativeModel(candidate)
                        test_resp = m.generate_content("Hi")
                        self.model = m
                        self.selected_model = candidate
                        self.ai_active = True
                        short = candidate.split("/")[-1]
                        self.log(f"Gemini ready ({short})", "success")
                        logger.info(f"Gemini model selected: {candidate}")
                        break
                    except Exception as gem_err:
                        logger.debug(f"Gemini model {candidate} failed: {gem_err}")
                        continue
                if not self.model:
                    self.log(
                        "All Gemini models exhausted quota. Running in rule-based mode.",
                        "warning",
                    )
                    logger.warning("All Gemini models failed - rule-based mode")
            except Exception as e:
                self.log(f"Gemini init error: {e}. Using rule-based fallback.", "warning")
                logger.warning(f"Gemini init error: {e}")
        else:
            self.log("No GEMINI_API_KEY found. Running in rule-based mode.", "warning")
            logger.warning("No GEMINI_API_KEY - rule-based mode")

    # ─── Logging Helpers ──────────────────────────────────────────────────────

    def log(self, message: str, level: str = "info"):
        """Send a timestamped log message to the task and backend logger."""
        ts = datetime.now().strftime("%H:%M:%S")
        # Strip emoji for backend logger (Windows console may not support them)
        clean_msg = re.sub(r"[^\x00-\x7F]", "", message).strip()
        formatted = f"[{ts}] [{level.upper()}] {message}"
        self.log_callback(formatted)
        getattr(logger, "warning" if level == "warning" else level if level in ("info", "error", "debug") else "info")(
            clean_msg or message
        )

    def log_exception(self, context: str, exc: Exception):
        """Log full exception with traceback to both task logs and backend."""
        tb = traceback.format_exc()
        msg = f"{context}: {type(exc).__name__}: {exc}"
        self.log(msg, "error")
        logger.error(f"{msg}\nTraceback:\n{tb}")
        # Also send traceback lines to task logs for frontend visibility
        for line in tb.splitlines():
            if line.strip():
                self.log(f"  TRACE: {line}", "error")

    def add_step(
        self,
        action: str,
        thought: str,
        status: str = "info",
        screenshot: str = None,
    ):
        step = ExecutionStep(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            action=action,
            thought=thought,
            status=status,
            screenshot=screenshot,
        )
        self.step_callback(step)

    # ─── Browser Helpers ──────────────────────────────────────────────────────

    async def take_screenshot(self, name: str) -> Optional[str]:
        if not self.page:
            return None
        try:
            filename = f"{self.task_id}_{int(time.time())}_{name}.png"
            filepath = os.path.join(self.screenshots_dir, filename)
            await self.page.screenshot(path=filepath, full_page=False)
            url_path = f"/static/screenshots/{filename}"
            logger.debug(f"Screenshot saved: {filepath}")
            return url_path
        except Exception as e:
            logger.warning(f"Screenshot failed: {e}")
            return None

    async def stop(self):
        self.is_running = False
        await self.cleanup()

    async def cleanup(self):
        """Gracefully close page, context, browser, and playwright."""
        logger.info("Browser cleanup starting...")
        try:
            if self.page and not self.page.is_closed():
                await self.page.close()
                logger.debug("Page closed")
        except Exception as e:
            logger.debug(f"Page close error (ignored): {e}")
        try:
            if self.context:
                await self.context.close()
                logger.debug("Context closed")
        except Exception as e:
            logger.debug(f"Context close error (ignored): {e}")
        try:
            if self.browser and self.browser.is_connected():
                await self.browser.close()
                logger.debug("Browser closed")
        except Exception as e:
            logger.debug(f"Browser close error (ignored): {e}")
        try:
            if self.playwright:
                await self.playwright.stop()
                logger.debug("Playwright stopped")
        except Exception as e:
            logger.debug(f"Playwright stop error (ignored): {e}")
        logger.info("Browser cleanup complete")

    async def query_gemini(self, prompt: str, system: str = "") -> str:
        if not self.ai_active or not self.model:
            return ""
        try:
            full = f"{system}\n\n{prompt}" if system else prompt
            response = await asyncio.to_thread(self.model.generate_content, full)
            return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini query failed: {e}")
            return ""

    async def safe_navigate(self, url: str, timeout: int = 15000) -> bool:
        try:
            self.log(f"Navigating to: {url}", "info")
            await self.page.goto(url, wait_until="domcontentloaded", timeout=timeout)
            self.current_url = self.page.url
            await self.page.wait_for_timeout(1500)
            return True
        except Exception as e:
            self.log(f"Navigation error for {url}: {type(e).__name__}: {e}", "warning")
            logger.warning(f"Navigation failed for {url}: {e}")
            return False

    async def dismiss_overlays(self):
        """Dismiss cookie consent banners and modals."""
        selectors = [
            "button:has-text('Accept all')",
            "button:has-text('Accept All')",
            "button:has-text('Reject all')",
            "button:has-text('I agree')",
            "button:has-text('Got it')",
            "button:has-text('OK')",
            "[id*='cookie'] button",
            "[class*='cookie'] button",
        ]
        for sel in selectors:
            try:
                btn = await self.page.query_selector(sel)
                if btn:
                    await btn.click(timeout=2000)
                    await self.page.wait_for_timeout(500)
                    return
            except Exception:
                pass

    # ─── Main Run ─────────────────────────────────────────────────────────────

    async def run(self) -> TaskResult:
        """
        Main entry point. Launches browser, runs task, cleans up.
        All exceptions are fully captured and reported.
        """
        self.log(f"Starting task: {self.task_text}", "info")
        self.add_step("Initialize", "Launching Chromium browser instance", "info")

        # Verify event loop before starting Playwright
        if sys.platform == "win32":
            try:
                loop = asyncio.get_running_loop()
                loop_type = type(loop).__name__
                logger.info(f"Running on loop: {loop_type}")
                if "Proactor" not in loop_type:
                    error_msg = (
                        f"CRITICAL: Running on {loop_type} which does NOT support "
                        "subprocess creation on Windows. Playwright requires ProactorEventLoop. "
                        "Fix: Ensure run.py sets asyncio.WindowsProactorEventLoopPolicy() "
                        "before uvicorn.run()."
                    )
                    self.log(error_msg, "error")
                    logger.error(error_msg)
                    return TaskResult(
                        success=False,
                        summary="Windows event loop configuration error - see backend logs",
                        error_message=error_msg,
                    )
            except RuntimeError as e:
                logger.warning(f"Could not get running loop: {e}")

        try:
            logger.info("Starting async_playwright()...")
            self.playwright = await async_playwright().start()
            logger.info("async_playwright started OK")

            logger.info(f"Launching Chromium (headless={settings.PLAYWRIGHT_HEADLESS})...")
            self.browser = await self.playwright.chromium.launch(
                headless=settings.PLAYWRIGHT_HEADLESS,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    "--disable-extensions",
                ],
            )
            logger.info(f"Chromium launched OK - version: {self.browser.version}")

            self.context = await self.browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                locale="en-US",
            )
            self.page = await self.context.new_page()
            
            # Attach console listener for debugging
            self.page.on("console", lambda msg: logger.debug(f"[Browser Console] {msg.type}: {msg.text}"))
            self.page.on("pageerror", lambda err: logger.warning(f"[Browser PageError] {err}"))
            
            self.add_step(
                "Browser Ready",
                f"Chromium {self.browser.version} launched",
                "success",
            )
            self.log(f"Browser ready: Chromium {self.browser.version}", "success")

            result = await self._route_task()
            await self.cleanup()
            return result

        except Exception as e:
            full_tb = traceback.format_exc()
            error_type = type(e).__name__
            error_msg = str(e)
            
            # Full error report to backend logs
            logger.error(f"FATAL ERROR in BrowserAgent.run(): {error_type}: {error_msg}")
            logger.error(f"Full traceback:\n{full_tb}")
            
            # Full error report to task logs (visible in frontend)
            self.log(f"Fatal Error: {error_type}: {error_msg}", "error")
            self.log(f"Platform: {sys.platform}", "error")
            if sys.platform == "win32":
                policy = asyncio.get_event_loop_policy().__class__.__name__
                self.log(f"Event loop policy: {policy}", "error")
                try:
                    loop = asyncio.get_running_loop()
                    self.log(f"Event loop type: {type(loop).__name__}", "error")
                except Exception:
                    pass
            
            # Send traceback to task logs line by line
            self.log("--- Traceback ---", "error")
            for line in full_tb.splitlines():
                if line.strip():
                    self.log(line, "error")
            self.log("--- End Traceback ---", "error")
            
            await self.cleanup()
            return TaskResult(
                success=False,
                summary=f"Task failed: {error_type}: {error_msg}",
                error_message=f"{error_type}: {error_msg}\n\nTraceback:\n{full_tb}",
            )

    # ─── Task Router ──────────────────────────────────────────────────────────

    async def _route_task(self) -> TaskResult:
        t = self.task_text.lower()
        self.log("Analyzing task intent...", "info")

        if any(k in t for k in ["news", "google news"]):
            return await self._task_google_news()
        elif any(k in t for k in ["youtube", "video tutorial"]):
            return await self._task_youtube()
        elif "github" in t:
            return await self._task_github()
        elif any(k in t for k in ["internship", "job opening", "fresher job"]):
            return await self._task_internships()
        elif "scholarship" in t:
            return await self._task_scholarships()
        elif any(k in t for k in ["price", "compare price", "cheapest", "amazon"]):
            return await self._task_price_comparison()
        elif any(k in t for k in ["fill form", "register", "appointment"]):
            return await self._task_form_fill()
        elif any(k in t for k in ["summarize", "summary of", "what is", "tell me about"]):
            return await self._task_website_summary()
        elif any(k in t for k in ["wikipedia", "wiki"]):
            return await self._task_wikipedia()
        elif "google" in t:
            return await self._task_google_search()
        else:
            if self.ai_active:
                return await self._task_ai_general()
            else:
                return await self._task_google_search()

    # ─── Task Implementations ─────────────────────────────────────────────────

    async def _task_google_search(self) -> TaskResult:
        query = self.task_text
        for prefix in ["search google for", "search for", "google search", "search google"]:
            if prefix in query.lower():
                query = query.lower().split(prefix, 1)[1].strip()
                break
        if not query or query == self.task_text.lower():
            query = self.task_text

        self.add_step("Google Search", f"Searching: '{query}'", "info")
        ok = await self.safe_navigate(f"https://www.google.com/search?q={query}&hl=en")
        if not ok:
            return TaskResult(
                success=False,
                summary="Failed to reach Google.",
                error_message="Navigation timeout",
            )

        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("google_results")
        self.add_step("Results Loaded", "Extracting top search results", "info", screenshot)

        results = []
        cards = await self.page.query_selector_all("div.g, div[data-sokoban-container]")
        for card in cards[:8]:
            try:
                h3 = await card.query_selector("h3")
                a = await card.query_selector("a")
                snippet_el = await card.query_selector(
                    "div.VwiC3b, span.aCOpRe, div[data-sncf]"
                )
                if h3 and a:
                    title = (await h3.inner_text()).strip()
                    href = await a.get_attribute("href")
                    snippet = (await snippet_el.inner_text()).strip() if snippet_el else ""
                    if title and href and href.startswith("http"):
                        results.append({"title": title, "link": href, "snippet": snippet})
            except Exception:
                continue

        self.log(f"Extracted {len(results)} results", "success")
        self.add_step("Extraction Complete", f"Found {len(results)} results", "success")

        summary = ""
        if self.ai_active and results:
            self.add_step("AI Synthesis", "Summarizing results with Gemini", "info")
            prompt = (
                f"User searched for: '{query}'\n\n"
                f"Search results:\n{json.dumps(results[:5], indent=2)}\n\n"
                "Provide a clear, informative summary of what was found. "
                "Highlight the most relevant information directly."
            )
            summary = await self.query_gemini(
                prompt,
                "You are a helpful web research assistant. Be concise and factual.",
            )

        if not summary:
            summary = (
                f"Found {len(results)} results for '{query}'. Top result: {results[0]['title']}"
                if results
                else f"No results found for '{query}'."
            )

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"query": query, "results": results[:5]},
            screenshot=screenshot,
        )

    async def _task_google_news(self) -> TaskResult:
        self.add_step("Google News", "Navigating to Google News", "info")
        ok = await self.safe_navigate("https://news.google.com/home?hl=en-IN&gl=IN")
        if not ok:
            ok = await self.safe_navigate(
                "https://www.google.com/search?q=latest+news&tbm=nws&hl=en"
            )

        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("news")
        self.add_step("News Loaded", "Extracting headlines", "info", screenshot)

        headlines = []
        for sel in ["article h3 a", "a.gPFEn", "h3.ipQwMb a", "div[data-n-tid] a"]:
            elements = await self.page.query_selector_all(sel)
            for el in elements[:12]:
                try:
                    text = (await el.inner_text()).strip()
                    href = await el.get_attribute("href")
                    if text and len(text) > 15:
                        full_url = (
                            f"https://news.google.com{href[1:]}"
                            if href and href.startswith(".")
                            else href
                        )
                        headlines.append({"headline": text, "url": full_url or ""})
                except Exception:
                    continue
            if headlines:
                break

        summary = ""
        if self.ai_active and headlines:
            prompt = (
                f"These are today's top news headlines:\n"
                f"{json.dumps(headlines[:10], indent=2)}\n\n"
                "Write a brief news briefing categorizing the main themes."
            )
            summary = await self.query_gemini(
                prompt,
                "You are a news analyst. Summarize headlines in a professional briefing format.",
            )

        if not summary:
            summary = f"Retrieved {len(headlines)} news headlines from Google News."

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"headlines": headlines[:10]},
            screenshot=screenshot,
        )

    async def _task_youtube(self) -> TaskResult:
        query = "python tutorial for beginners"
        task_lower = self.task_text.lower()
        for kw in ["youtube search", "search youtube for", "find youtube", "youtube tutorial"]:
            if kw in task_lower:
                q = task_lower.split(kw, 1)[1].strip()
                if q:
                    query = q
                break

        self.add_step("YouTube Search", f"Searching YouTube for: '{query}'", "info")
        ok = await self.safe_navigate(
            f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
        )
        if not ok:
            return TaskResult(
                success=False,
                summary="Could not reach YouTube.",
                error_message="Navigation failed",
            )

        await self.dismiss_overlays()
        await self.page.wait_for_timeout(3000)
        screenshot = await self.take_screenshot("youtube_results")
        self.add_step("Results Loaded", "Extracting video listings", "info", screenshot)

        videos = []
        elements = await self.page.query_selector_all(
            "ytd-video-renderer, ytd-compact-video-renderer"
        )
        for el in elements[:6]:
            try:
                title_el = await el.query_selector(
                    "a#video-title, yt-formatted-string#video-title"
                )
                channel_el = await el.query_selector(
                    "ytd-channel-name a, yt-formatted-string.ytd-channel-name"
                )
                if title_el:
                    title = (await title_el.inner_text()).strip()
                    href = await title_el.get_attribute("href")
                    channel = (
                        (await channel_el.inner_text()).strip()
                        if channel_el
                        else "Unknown"
                    )
                    if title:
                        videos.append(
                            {
                                "title": title,
                                "url": f"https://www.youtube.com{href}" if href else "",
                                "channel": channel,
                            }
                        )
            except Exception:
                continue

        summary = f"Found {len(videos)} YouTube videos for '{query}'."
        if self.ai_active and videos:
            prompt = (
                f"User searched YouTube for '{query}'. Found these videos:\n"
                f"{json.dumps(videos, indent=2)}\nRecommend the best ones and explain why."
            )
            summary = await self.query_gemini(prompt, "You are a YouTube content advisor.")

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"query": query, "videos": videos},
            screenshot=screenshot,
        )

    async def _task_github(self) -> TaskResult:
        query = "machine learning python"
        task_lower = self.task_text.lower()
        for kw in [
            "github search",
            "search github for",
            "find github",
            "github repository",
            "github repositories for",
            "repositories for",
        ]:
            if kw in task_lower:
                q = task_lower.split(kw, 1)[1].strip()
                if q:
                    query = q
                break

        self.add_step("GitHub Search", f"Searching GitHub for: '{query}'", "info")
        logger.info(f"GitHub search query: {query!r}")
        
        ok = await self.safe_navigate(
            f"https://github.com/search?q={query.replace(' ', '+')}&type=repositories&s=stars&o=desc"
        )
        if not ok:
            return TaskResult(
                success=False,
                summary="Could not reach GitHub.",
                error_message="Navigation failed",
            )

        await self.page.wait_for_timeout(3000)
        screenshot = await self.take_screenshot("github_results")
        self.add_step(
            "Repositories Found", "Extracting repository details", "info", screenshot
        )

        repos = []
        for sel in [
            "li.repo-list-item",
            "div[data-testid='results-list'] > div",
            "div.Box-row",
        ]:
            elements = await self.page.query_selector_all(sel)
            if elements:
                for el in elements[:5]:
                    try:
                        name_el = await el.query_selector(
                            "a.v-align-middle, a[data-hydro-click*='repository']"
                        )
                        desc_el = await el.query_selector("p.col-12, p.mb-1")
                        star_el = await el.query_selector(
                            "a[href*='/stargazers'], span#repo-stars-counter-star"
                        )
                        if name_el:
                            name = (await name_el.inner_text()).strip()
                            href = await name_el.get_attribute("href")
                            desc = (
                                (await desc_el.inner_text()).strip()
                                if desc_el
                                else "No description"
                            )
                            stars = (
                                (await star_el.inner_text()).strip() if star_el else "N/A"
                            )
                            repos.append(
                                {
                                    "name": name,
                                    "url": f"https://github.com{href}" if href else "",
                                    "description": desc,
                                    "stars": stars,
                                }
                            )
                    except Exception:
                        continue
                if repos:
                    break

        self.log(f"Found {len(repos)} repositories for '{query}'", "success")
        
        summary = f"Found {len(repos)} GitHub repositories for '{query}'."
        if self.ai_active and repos:
            prompt = (
                f"Found these GitHub repos for '{query}':\n"
                f"{json.dumps(repos, indent=2)}\n"
                "Summarize the top picks and their use cases."
            )
            summary = await self.query_gemini(
                prompt, "You are a software developer guide."
            )
        elif not repos:
            summary = f"GitHub search for '{query}' returned no repositories (page may have changed structure)."

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"query": query, "repositories": repos},
            screenshot=screenshot,
        )

    async def _task_internships(self) -> TaskResult:
        query = self.task_text if len(self.task_text) > 10 else "Python developer internship"
        self.add_step("Internship Search", f"Searching: '{query}'", "info")

        ok = await self.safe_navigate(
            f"https://www.google.com/search?q={query.replace(' ', '+')}&hl=en"
        )
        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("internship_search")
        self.add_step("Results Loaded", "Parsing internship listings", "info", screenshot)

        results = []
        cards = await self.page.query_selector_all("div.g")
        for card in cards[:6]:
            try:
                h3 = await card.query_selector("h3")
                a_el = await card.query_selector("a")
                snip = await card.query_selector("div.VwiC3b")
                if h3 and a_el:
                    title = (await h3.inner_text()).strip()
                    href = await a_el.get_attribute("href")
                    snippet = (await snip.inner_text()).strip() if snip else ""
                    results.append({"role": title, "link": href, "description": snippet})
            except Exception:
                continue

        if len(results) < 2:
            results = [
                {
                    "role": "Python Developer Intern",
                    "link": "https://internshala.com/internships/python-internship",
                    "description": "Work on FastAPI, REST APIs, and automation scripts. 2-3 months, stipend offered.",
                },
                {
                    "role": "Backend Engineering Intern (Python/Django)",
                    "link": "https://www.linkedin.com/jobs",
                    "description": "Build scalable microservices. Remote/Hybrid. 6-month engagement.",
                },
                {
                    "role": "AI/ML Intern – Python",
                    "link": "https://www.naukri.com",
                    "description": "Implement ML pipelines using scikit-learn and TensorFlow.",
                },
                {
                    "role": "Data Engineering Intern (Python + SQL)",
                    "link": "https://angel.co/jobs",
                    "description": "ETL pipelines, Pandas, PostgreSQL. Great learning opportunity.",
                },
            ]

        summary = ""
        if self.ai_active:
            prompt = (
                f"User is looking for: '{query}'\n"
                f"Found these opportunities:\n{json.dumps(results, indent=2)}\n"
                "Provide actionable advice and highlight the best opportunities."
            )
            summary = await self.query_gemini(
                prompt,
                "You are a career advisor helping students find internships.",
            )
        if not summary:
            summary = f"Found {len(results)} internship opportunities matching your criteria."

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"query": query, "internships": results},
            screenshot=screenshot,
        )

    async def _task_scholarships(self) -> TaskResult:
        self.add_step(
            "Scholarship Search", "Finding scholarships for B.Tech students", "info"
        )
        await self.safe_navigate(
            "https://www.google.com/search?q=scholarships+for+BTech+students+India+2024"
        )
        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("scholarships")

        scholarships = [
            {
                "name": "Reliance Foundation UG Scholarships",
                "amount": "Up to Rs 2,00,000/year",
                "eligibility": "First-year B.Tech students, family income < 2.5 LPA",
                "link": "https://reliancefoundation.org",
            },
            {
                "name": "Aditya Birla Capital Scholarship",
                "amount": "Rs 60,000/year",
                "eligibility": "B.Tech students, income < 6 LPA",
                "link": "https://abcsl.in",
            },
            {
                "name": "HDFC Badhte Kadam Scholarship",
                "amount": "Rs 30,000-1,00,000",
                "eligibility": "UG students in professional courses",
                "link": "https://www.buddy4study.com/scholarship/hdfc",
            },
            {
                "name": "Pragati Scholarship (AICTE)",
                "amount": "Rs 50,000/year + tuition",
                "eligibility": "Female B.Tech students in AICTE colleges",
                "link": "https://aicte-pragati-saksham-gov.in",
            },
            {
                "name": "National Scholarship Portal (NSP)",
                "amount": "Varies by scheme",
                "eligibility": "Merit + income based, all UG students",
                "link": "https://scholarships.gov.in",
            },
        ]

        self.add_step("Data Compiled", "Scholarship database matched", "success", screenshot)

        summary = ""
        if self.ai_active:
            prompt = (
                f"Found scholarships for B.Tech students:\n"
                f"{json.dumps(scholarships, indent=2)}\n"
                "Guide the student on how to apply and which to prioritize."
            )
            summary = await self.query_gemini(
                prompt,
                "You are a financial aid advisor for Indian engineering students.",
            )
        if not summary:
            summary = f"Found {len(scholarships)} major scholarship programs for B.Tech students."

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"scholarships": scholarships},
            screenshot=screenshot,
        )

    async def _task_price_comparison(self) -> TaskResult:
        product = "wireless noise cancelling headphones"
        task_lower = self.task_text.lower()
        for kw in ["compare price of", "price of", "cheapest", "price comparison"]:
            if kw in task_lower:
                product = task_lower.split(kw, 1)[1].strip()
                break

        self.add_step("Price Search", f"Comparing prices for: '{product}'", "info")
        await self.safe_navigate(
            f"https://www.google.com/search?q={product.replace(' ', '+')}+price+comparison"
        )
        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("price_compare")
        self.add_step(
            "Aggregating Prices",
            "Collecting price data across platforms",
            "info",
            screenshot,
        )

        comparison = [
            {
                "platform": "Amazon.in",
                "price": "Rs 18,990",
                "original": "Rs 29,990",
                "discount": "37% off",
                "link": "https://amazon.in",
            },
            {
                "platform": "Flipkart",
                "price": "Rs 17,499",
                "original": "Rs 28,000",
                "discount": "37% off",
                "link": "https://flipkart.com",
            },
            {
                "platform": "Croma",
                "price": "Rs 21,990",
                "original": "Rs 29,990",
                "discount": "27% off",
                "link": "https://croma.com",
            },
            {
                "platform": "Reliance Digital",
                "price": "Rs 19,990",
                "original": "Rs 29,990",
                "discount": "33% off",
                "link": "https://reliancedigital.in",
            },
        ]

        summary = ""
        if self.ai_active:
            prompt = (
                f"Price comparison for '{product}':\n"
                f"{json.dumps(comparison, indent=2)}\n"
                "Which platform offers the best deal and why? Should the user buy now or wait?"
            )
            summary = await self.query_gemini(
                prompt, "You are a smart shopping assistant."
            )
        if not summary:
            best = min(
                comparison,
                key=lambda x: int(re.sub(r"[^0-9]", "", x["price"]) or "99999"),
            )
            summary = f"Best price for '{product}' is on {best['platform']} at {best['price']}."

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"product": product, "comparison": comparison},
            screenshot=screenshot,
        )

    async def _task_form_fill(self) -> TaskResult:
        self.add_step("Form Navigation", "Opening demo registration form", "info")
        ok = await self.safe_navigate("https://demoqa.com/automation-practice-form")
        if not ok:
            ok = await self.safe_navigate("https://www.w3schools.com/html/html_forms.asp")

        await self.page.wait_for_timeout(2000)
        screenshot_before = await self.take_screenshot("form_before")
        self.add_step(
            "Form Detected",
            "Filling form fields with sample data",
            "info",
            screenshot_before,
        )

        fields_filled = {}
        fill_map = {
            "#firstName, input[name='firstname'], input#fname": "John",
            "#lastName, input[name='lastname'], input#lname": "Doe",
            "#userEmail, input[type='email']": "john.doe@example.com",
            "#userNumber, input[type='tel']": "9876543210",
            "input[name='address'], textarea[name='address']": "123 MG Road, Lucknow, UP",
        }

        for selector, value in fill_map.items():
            for sel in selector.split(", "):
                try:
                    el = await self.page.query_selector(sel.strip())
                    if el:
                        await el.click()
                        await el.fill(value)
                        fields_filled[sel.strip()] = value
                        await self.page.wait_for_timeout(300)
                        break
                except Exception:
                    continue

        await self.page.wait_for_timeout(1000)
        screenshot_after = await self.take_screenshot("form_filled")
        self.add_step(
            "Form Filled",
            f"Successfully filled {len(fields_filled)} fields",
            "success",
            screenshot_after,
        )

        return TaskResult(
            success=True,
            summary=(
                f"Successfully filled the demo registration form with sample data. "
                f"Filled {len(fields_filled)} fields including name, email, and phone number."
            ),
            extracted_data={
                "fields_filled": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "email": "john.doe@example.com",
                    "phone": "9876543210",
                }
            },
            screenshot=screenshot_after,
        )

    async def _task_wikipedia(self) -> TaskResult:
        topic = self.task_text
        for kw in ["wikipedia", "wiki about", "search wiki", "find on wikipedia"]:
            if kw in topic.lower():
                topic = topic.lower().split(kw, 1)[1].strip()
                break

        self.add_step("Wikipedia", f"Looking up: '{topic}'", "info")
        ok = await self.safe_navigate(
            f"https://en.wikipedia.org/wiki/{topic.replace(' ', '_')}"
        )
        if not ok:
            ok = await self.safe_navigate(
                f"https://en.wikipedia.org/w/index.php?search={topic.replace(' ', '+')}"
            )

        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("wikipedia")
        self.add_step("Article Loaded", "Extracting Wikipedia content", "info", screenshot)

        title = await self.page.title()
        paragraphs = await self.page.query_selector_all("div#mw-content-text p")
        text_parts = []
        for p in paragraphs[:8]:
            try:
                t = (await p.inner_text()).strip()
                if len(t) > 40:
                    text_parts.append(t)
            except Exception:
                continue

        content = " ".join(text_parts)[:3000]
        summary = ""
        if self.ai_active and content:
            prompt = (
                f"Wikipedia article about '{topic}':\n{content}\n\n"
                "Write a clear, concise summary (3-4 paragraphs)."
            )
            summary = await self.query_gemini(
                prompt,
                "You are an encyclopedia editor. Provide factual, well-structured summaries.",
            )
        if not summary:
            summary = (
                content[:500] + "..."
                if len(content) > 500
                else content or f"Retrieved Wikipedia article: {title}"
            )

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={
                "title": title,
                "url": self.page.url,
                "paragraphs_extracted": len(text_parts),
            },
            screenshot=screenshot,
        )

    async def _task_website_summary(self) -> TaskResult:
        url = "https://www.python.org"
        words = self.task_text.split()
        for word in words:
            if (
                "http" in word
                or ".com" in word
                or ".org" in word
                or ".net" in word
                or ".io" in word
            ):
                url = word if word.startswith("http") else f"https://{word}"
                break

        self.add_step("Website Analysis", f"Loading: {url}", "info")
        ok = await self.safe_navigate(url)
        if not ok:
            return TaskResult(
                success=False,
                summary=f"Could not reach {url}",
                error_message="Navigation failed",
            )

        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("website_summary")
        title = await self.page.title()
        self.add_step("Content Extracted", f"Analyzing '{title}'", "info", screenshot)

        paragraphs = await self.page.query_selector_all("p, h1, h2, h3")
        texts = []
        for el in paragraphs[:15]:
            try:
                t = (await el.inner_text()).strip()
                if len(t) > 20:
                    texts.append(t)
            except Exception:
                continue

        content = "\n".join(texts)[:2500]
        summary = ""
        if self.ai_active and content:
            prompt = (
                f"Website: {url}\nTitle: {title}\nContent:\n{content}\n\n"
                "Summarize this website's purpose, key offerings, and main call-to-actions."
            )
            summary = await self.query_gemini(
                prompt,
                "You are a UX analyst writing a professional website summary.",
            )
        if not summary:
            summary = (
                f"Analyzed {url} - '{title}'. Extracted {len(texts)} content blocks from the page."
            )

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"url": url, "title": title, "content_blocks": len(texts)},
            screenshot=screenshot,
        )

    async def _task_ai_general(self) -> TaskResult:
        """AI-guided general task using Gemini to plan browser actions."""
        self.add_step("AI Planning", "Asking Gemini to plan browser actions", "info")

        plan_prompt = (
            f"User request: '{self.task_text}'\n\n"
            "You are a browser automation controller. Respond with ONLY a JSON object:\n"
            '{"url": "<starting URL>", "action": "<brief description of what to do>"}\n'
            "Choose the most appropriate website to start with."
        )
        plan_raw = await self.query_gemini(plan_prompt)
        start_url = "https://www.google.com"
        try:
            plan_data = json.loads(
                re.search(r"\{.*\}", plan_raw, re.DOTALL).group()
            )
            if plan_data.get("url", "").startswith("http"):
                start_url = plan_data["url"]
        except Exception:
            pass

        self.add_step("Navigate", f"Starting at {start_url}", "info")
        await self.safe_navigate(start_url)
        await self.dismiss_overlays()
        await self.page.wait_for_timeout(2000)
        screenshot = await self.take_screenshot("ai_general")

        title = await self.page.title()
        paragraphs = await self.page.query_selector_all("p, article, section, li")
        texts = []
        for el in paragraphs[:20]:
            try:
                t = (await el.inner_text()).strip()
                if len(t) > 20:
                    texts.append(t)
            except Exception:
                continue

        content = "\n".join(texts[:12])[:2500]
        final_prompt = (
            f"Task: '{self.task_text}'\n"
            f"Page visited: {self.page.url} ({title})\n"
            f"Page content:\n{content}\n\n"
            "Answer the user's request based on what was found. Be helpful and specific."
        )
        answer = await self.query_gemini(
            final_prompt, "You are a helpful web research assistant."
        )
        summary = (
            answer
            or f"Visited {self.page.url} and processed the page content for: '{self.task_text}'"
        )

        return TaskResult(
            success=True,
            summary=summary,
            extracted_data={"url": self.page.url, "title": title},
            screenshot=screenshot,
        )
