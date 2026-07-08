import os
import json
import uuid
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
from app.config.settings import settings
from app.models.schemas import TaskState, ExecutionStep, TaskResult, DashboardStats
from app.services.agents.browser_agent import BrowserAgent

class TaskManager:
    def __init__(self):
        self.db_path = os.path.join(settings.DATA_DIR, "tasks.json")
        self.active_agents: Dict[str, BrowserAgent] = {}
        self.active_tasks: Dict[str, asyncio.Task] = {}
        self._load_tasks()

    def _load_tasks(self):
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.tasks: Dict[str, Dict] = data
            except Exception:
                self.tasks = {}
        else:
            self.tasks = {}
            self._save_tasks()

    def _save_tasks(self):
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(self.tasks, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving database: {str(e)}")

    def get_task(self, task_id: str) -> Optional[TaskState]:
        task_data = self.tasks.get(task_id)
        if task_data:
            return TaskState(**task_data)
        return None

    def get_all_tasks(self) -> List[TaskState]:
        # Return sorted by created_at desc
        sorted_tasks = sorted(
            self.tasks.values(),
            key=lambda x: x.get("created_at", ""),
            reverse=True
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
            logs=[]
        )
        self.tasks[task_id] = new_task.model_dump()
        self._save_tasks()
        return new_task

    def log_to_task(self, task_id: str, message: str):
        if task_id in self.tasks:
            self.tasks[task_id]["logs"].append(message)
            # Update progress dynamically based on certain keywords
            if "navigating" in message.lower():
                self.tasks[task_id]["progress"] = min(self.tasks[task_id]["progress"] + 15, 80)
            elif "searching" in message.lower():
                self.tasks[task_id]["progress"] = min(self.tasks[task_id]["progress"] + 10, 85)
            elif "extracting" in message.lower() or "summarizing" in message.lower():
                self.tasks[task_id]["progress"] = 90
            self._save_tasks()

    def add_step_to_task(self, task_id: str, step: ExecutionStep):
        if task_id in self.tasks:
            self.tasks[task_id]["timeline"].append(step.model_dump())
            self._save_tasks()

    async def start_task(self, task_id: str):
        if task_id not in self.tasks:
            return
        
        self.tasks[task_id]["status"] = "running"
        self.tasks[task_id]["progress"] = 10
        self._save_tasks()

        agent = BrowserAgent(
            task_id=task_id,
            task_text=self.tasks[task_id]["task"],
            log_callback=lambda msg: self.log_to_task(task_id, msg),
            step_callback=lambda step: self.add_step_to_task(task_id, step)
        )
        
        self.active_agents[task_id] = agent
        
        # Spawn execution in background
        loop = asyncio.get_running_loop()
        background_task = loop.create_task(self._execute_agent(task_id, agent))
        self.active_tasks[task_id] = background_task

    async def _execute_agent(self, task_id: str, agent: BrowserAgent):
        try:
            result = await agent.run()
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "completed" if result.success else "failed"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.tasks[task_id]["result"] = result.model_dump()
                self._save_tasks()
        except asyncio.CancelledError:
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "stopped"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.tasks[task_id]["result"] = TaskResult(
                    success=False,
                    summary="Task was aborted by user request.",
                    error_message="Execution cancelled."
                ).model_dump()
                self._save_tasks()
        except Exception as e:
            if task_id in self.tasks:
                self.tasks[task_id]["status"] = "failed"
                self.tasks[task_id]["progress"] = 100
                self.tasks[task_id]["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.tasks[task_id]["result"] = TaskResult(
                    success=False,
                    summary="Execution failed due to unexpected error.",
                    error_message=str(e)
                ).model_dump()
                self._save_tasks()
        finally:
            self.active_agents.pop(task_id, None)
            self.active_tasks.pop(task_id, None)

    async def stop_task(self, task_id: str):
        if task_id in self.active_agents:
            await self.active_agents[task_id].stop()
        if task_id in self.active_tasks:
            self.active_tasks[task_id].cancel()

    def clear_history(self):
        self.tasks = {}
        self._save_tasks()
        # Clean screenshots/downloads
        for f in os.listdir(os.path.join(settings.DATA_DIR, "screenshots")):
            if f.endswith(".png"):
                try:
                    os.remove(os.path.join(settings.DATA_DIR, "screenshots", f))
                except:
                    pass

    def get_stats(self) -> DashboardStats:
        all_tasks = self.get_all_tasks()
        completed = sum(1 for t in all_tasks if t.status == "completed")
        failed = sum(1 for t in all_tasks if t.status == "failed")
        running = len(self.active_tasks)
        total = len(all_tasks)

        # Average time calculation
        times = []
        for t in all_tasks:
            if t.completed_at and t.created_at:
                try:
                    start = datetime.strptime(t.created_at, "%Y-%m-%d %H:%M:%S")
                    end = datetime.strptime(t.completed_at, "%Y-%m-%d %H:%M:%S")
                    times.append((end - start).total_seconds())
                except:
                    pass
        avg_time = sum(times) / len(times) if times else 0.0
        success_rate = (completed / (completed + failed) * 100) if (completed + failed) > 0 else 100.0

        # Determine browser/AI status
        browser_status = "active" if running > 0 else "idle"
        ai_active = settings.GEMINI_API_KEY != ""
        
        current_site = None
        if running > 0:
            first_active_id = list(self.active_agents.keys())[0]
            agent = self.active_agents[first_active_id]
            if agent.page:
                current_site = agent.page.url

        return DashboardStats(
            completed_tasks=completed,
            running_tasks=running,
            failed_tasks=failed,
            average_time_seconds=round(avg_time, 1),
            success_rate=round(success_rate, 1),
            browser_status=browser_status,
            ai_status="active" if ai_active else "disabled",
            current_website=current_site
        )

# Singleton task manager instance
task_manager = TaskManager()
