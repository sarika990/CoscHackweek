from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
import asyncio
from app.models.schemas import TaskCreate, TaskState, DashboardStats
from app.services.task_manager import task_manager

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.post("", response_model=TaskState)
async def create_and_start_task(payload: TaskCreate):
    task = task_manager.create_task(payload.task)
    await task_manager.start_task(task.id)
    return task

@router.get("/history", response_model=List[TaskState])
def get_task_history():
    return task_manager.get_all_tasks()

@router.get("/stats", response_model=DashboardStats)
def get_stats():
    return task_manager.get_stats()

@router.get("/{task_id}", response_model=TaskState)
def get_task_details(task_id: str):
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/{task_id}/stop")
async def stop_task(task_id: str):
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await task_manager.stop_task(task_id)
    return {"message": "Stop signal sent."}

@router.delete("/clear")
def clear_all_history():
    task_manager.clear_history()
    return {"message": "History cleared successfully."}

@router.websocket("/{task_id}/ws")
async def task_websocket_endpoint(websocket: WebSocket, task_id: str):
    await websocket.accept()
    last_log_idx = 0
    last_step_idx = 0
    try:
        while True:
            task = task_manager.get_task(task_id)
            if not task:
                await websocket.send_json({"error": "Task not found"})
                break

            # Send updates if new logs or state changes
            current_logs = task.logs
            current_steps = task.timeline
            
            updates = {}
            if len(current_logs) > last_log_idx:
                updates["new_logs"] = current_logs[last_log_idx:]
                last_log_idx = len(current_logs)
                
            if len(current_steps) > last_step_idx:
                updates["new_steps"] = [step.model_dump() if hasattr(step, 'model_dump') else step for step in current_steps[last_step_idx:]]
                last_step_idx = len(current_steps)

            # Send complete status/progress changes
            updates["status"] = task.status
            updates["progress"] = task.progress
            if task.result:
                updates["result"] = task.result.model_dump() if hasattr(task.result, 'model_dump') else task.result
            
            await websocket.send_json(updates)

            # End subscription if task completed/failed/stopped
            if task.status in ["completed", "failed", "stopped"]:
                # Send final state once and break
                await asyncio.sleep(1)
                break

            await asyncio.sleep(0.5)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"error": str(e)})
        except:
            pass
