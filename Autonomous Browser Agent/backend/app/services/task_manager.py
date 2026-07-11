"""
BrowserPilot AI - Task Manager
================================
Manages task lifecycle: creation, background execution, state persistence,
agent registry, and graceful stopping.

All exceptions are fully logged with tracebacks - no silent failures.
"""
import os
import sys
import json
import uuid
import asyncio
import logging
import traceback
from typing import Dict, List, Optional
from datetime import datetime
from app.config.settings import settings
from app.models.schemas import TaskState, ExecutionStep, TaskResult, DashboardStats
from app.services.agents.browser_agent import BrowserAgent

logger = logging.getLogger("browseragent")


class TaskManager:
    def __init__(self):
        self.db_path = os.path.join(settings.DATA_DIR, "tasks.json")
        self.active_agents: Dict[str, BrowserAgent] = {}
        self.active_tasks: Dict[str, asyncio.Task] = {}
        self._load_tasks()
        logger.info(f"TaskManager initialized - db: {self.db_path}")

    def _load_tasks(self):
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.tasks: Dict[str, Dict] = data
                logger.info(f"Loaded {len(self.tasks)} existing tasks from db")
            except Exception as e:
                logger.warning(f"Could not load tasks db: {e} - starting fresh")
                self.tasks = {}
        else:
            self.tasks = {}
            self._save_tasks()

    def _save_tasks(self):
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(self.tasks, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error saving tasks db: {e}")

    def get_task(self, task_id: str) -> Optional[TaskState]:
        task_data = self.tasks.get(task_id)
        if task_data:
            return TaskState(**task_data)
        return None

    def get_all_tasks(self) -> List[TaskState]:
        sorted_tasks = sorted(
            self.tasks.values(),
            key=lambda x: x.get("created_at", ""),
            reverse=True,
        )
        return [TaskState(**t) for t in sorted_tasks]

    def create_task(self, task_text: str) -> TaskState:
        task_id = str(uuid.uuid4())
        new_task = TaskState(
            id=task_id,
            task=task_text,
            status="pending",
            progress=0,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            timeline=[],
            result=None,
            logs=[],
        )
        self.tasks[task_id] = new_task.model_dump()
        self._save_tasks()
        logger.info(f"Created task {task_id}: {task_text!r}")
        return new_task

    def log_to_task(self, task_id: str, message: str):
        if task_id in self.tasks:
            self.tasks[task_id]["logs"].append(message)
            # Update progress dynamically
            msg_lower = message.lower()
            if "navigating" in msg_lower:
                self.tasks[task_id]["progress"] = min(
                    self.tasks[task_id]["progress"] + 15, 80
                )
            elif "searching" in msg_lower:
                self.tasks[task_id]["progress"] = min(
                    self.tasks[task_id]["progress"] + 10, 85
                )
            elif "extracting" in msg_lower or "summarizing" in msg_lower:
                self.tasks[task_id]["progress"] = 90
            self._save_tasks()
            # Echo to backend log for full visibility
            logger.debug(f"[Task {task_id[:8]}] {message}")

    def add_step_to_task(self, task_id: str, step: ExecutionStep):
        if task_id in self.tasks:
            self.tasks[task_id]["timeline"].append(step.model_dump())
            self._save_tasks()

    async def start_task(self, task_id: str):
        if task_id not in self.tasks:
            logger.error(f"start_task: task {task_id} not found")
            return

        # Verify Windows event loop before starting
        if sys.platform == "win32":
            try:
                loop = asyncio.get_running_loop()
                loop_type = type(loop).__name__
                policy = asyncio.get_event_loop_policy().__class__.__name__
                logger.info(f"Starting task on loop={loop_type}, policy={policy}")
                if "Proactor" not in loop_type:
                    error_msg = (
                        f"CRITICAL: Event loop is {loop_type} - Playwright will fail! "
                        f"Policy: {policy}. "
                        "Run.py must set WindowsProactorEventLoopPolicy before uvicorn.run()."
                    )
                    logger.error(error_msg)
                    self.tasks[task_id]["status"] = "failed"
                    self.tasks[task_id]["progress"] = 100
                    self.tasks[task_id]["completed_at"] = datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                    self.tasks[task_id]["result"] = TaskResult(
                        success=False,
                        summary="Windows event loop configuration error",
                        error_message=error_msg,
                    ).model_dump()
                    self.tasks[task_id]["logs"].append(
                        f"[ERROR] {error_msg}"
                    )
                    self._save_tasks()
                    return
            except RuntimeError as e:
                logger.warning(f"Could not verify event loop: {e}")

        self.tasks[task_id]["status"] = "running"
        self.tasks[task_id]["progress"] = 10
        self._save_tasks()

        agent = BrowserAgent(
            task_id=task_id,
            task_text=self.tasks[task_id]["task"],
            log_callback=lambda msg: self.log_to_task(task_id, msg),
            step_callback=lambda step: self.add_step_to_task(task_id, step),
        )

        self.active_agents[task_id] = agent

        # Spawn execution in background
        loop = asyncio.get_running_loop()
        background_task = loop.create_task(self._execute_agent(task_id, agent))
        background_task.add_done_callback(
            lambda t: self._task_done_callback(task_id, t)
        )
        self.active_tasks[task_id] = background_task
        logger.info(f"Task {task_id} started as background task")

    def _task_done_callback(self, task_id: str, future: asyncio.Future):
        """Called when background task completes - catches 'Task exception was never retrieved'."""
        if future.cancelled():
            logger.info(f"Task {task_id} was cancelled")
            return
        exc = future.exception()
        if exc is not None:
            full_tb = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
            logger.error(
                f"Task {task_id} raised unhandled exception: "
                f"{type(exc).__name__}: {exc}\n{full_tb}"
            )
            # Update task state
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "failed"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                self.tasks[task_id]["result"] = TaskResult(
                    success=False,
                    summary=f"Unhandled error: {type(exc).__name__}: {exc}",
                    error_message=f"{type(exc).__name__}: {exc}\n\nTraceback:\n{full_tb}",
                ).model_dump()
                self.tasks[task_id]["logs"].append(
                    f"[ERROR] Unhandled: {type(exc).__name__}: {exc}"
                )
                for line in full_tb.splitlines():
                    if line.strip():
                        self.tasks[task_id]["logs"].append(f"  TRACE: {line}")
                self._save_tasks()
        else:
            logger.info(f"Task {task_id} background task completed normally")

    async def _execute_agent(self, task_id: str, agent: BrowserAgent):
        try:
            logger.info(f"Executing agent for task {task_id}")
            result = await agent.run()
            if task_id in self.tasks:
                status = "completed" if result.success else "failed"
                self.tasks[task_id]["status"] = status
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                self.tasks[task_id]["result"] = result.model_dump()
                self._save_tasks()
                logger.info(f"Task {task_id} finished with status={status}")
                if not result.success and result.error_message:
                    logger.error(f"Task {task_id} error: {result.error_message}")

        except asyncio.CancelledError:
            logger.info(f"Task {task_id} was cancelled")
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "stopped"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                self.tasks[task_id]["result"] = TaskResult(
                    success=False,
                    summary="Task was aborted by user request.",
                    error_message="Execution cancelled by user.",
                ).model_dump()
                self._save_tasks()
            raise  # Re-raise so done callback sees cancellation

        except Exception as e:
            full_tb = traceback.format_exc()
            logger.error(
                f"_execute_agent exception for task {task_id}: "
                f"{type(e).__name__}: {e}\n{full_tb}"
            )
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "failed"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                )
                self.tasks[task_id]["result"] = TaskResult(
                    success=False,
                    summary=f"Execution error: {type(e).__name__}: {e}",
                    error_message=f"{type(e).__name__}: {e}\n\nTraceback:\n{full_tb}",
                ).model_dump()
                # Put full traceback in logs for frontend
                self.tasks[task_id]["logs"].append(
                    f"[ERROR] {type(e).__name__}: {e}"
                )
                for line in full_tb.splitlines():
                    if line.strip():
                        self.tasks[task_id]["logs"].append(f"  TRACE: {line}")
                self._save_tasks()

        finally:
            self.active_agents.pop(task_id, None)
            self.active_tasks.pop(task_id, None)
            logger.info(f"Task {task_id} removed from active registry")

    async def stop_task(self, task_id: str):
        logger.info(f"Stopping task {task_id}")
        if task_id in self.active_agents:
            await self.active_agents[task_id].stop()
        if task_id in self.active_tasks:
            self.active_tasks[task_id].cancel()

    def clear_history(self):
        self.tasks = {}
        self._save_tasks()
        screenshots_dir = os.path.join(settings.DATA_DIR, "screenshots")
        for f in os.listdir(screenshots_dir):
            if f.endswith(".png"):
                try:
                    os.remove(os.path.join(screenshots_dir, f))
                except Exception as e:
                    logger.warning(f"Could not remove screenshot {f}: {e}")
        logger.info("Task history cleared")

    def get_stats(self) -> DashboardStats:
        all_tasks = self.get_all_tasks()
        completed = sum(1 for t in all_tasks if t.status == "completed")
        failed = sum(1 for t in all_tasks if t.status == "failed")
        running = len(self.active_tasks)
        total = len(all_tasks)

        times = []
        for t in all_tasks:
            if t.completed_at and t.created_at:
                try:
                    start = datetime.strptime(t.created_at, "%Y-%m-%d %H:%M:%S")
                    end = datetime.strptime(t.completed_at, "%Y-%m-%d %H:%M:%S")
                    times.append((end - start).total_seconds())
                except Exception:
                    pass
        avg_time = sum(times) / len(times) if times else 0.0
        success_rate = (
            (completed / (completed + failed) * 100)
            if (completed + failed) > 0
            else 100.0
        )

        browser_status = "active" if running > 0 else "idle"
        ai_active = settings.GEMINI_API_KEY != ""

        current_site = None
        if running > 0:
            first_active_id = list(self.active_agents.keys())[0]
            agent = self.active_agents[first_active_id]
            if agent.page:
                try:
                    current_site = agent.page.url
                except Exception:
                    pass

        return DashboardStats(
            completed_tasks=completed,
            running_tasks=running,
            failed_tasks=failed,
            average_time_seconds=round(avg_time, 1),
            success_rate=round(success_rate, 1),
            browser_status=browser_status,
            ai_status="active" if ai_active else "disabled",
            current_website=current_site,
        )


# Singleton task manager instance
task_manager = TaskManager()
