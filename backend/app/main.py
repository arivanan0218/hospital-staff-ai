from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import json
from typing import List, Dict
from app.routers import staff, shifts, dashboard, allocation
# Uncomment these when the routers are implemented
# from app.routers import attendance
from app.database import engine, Base
from app.websocket_manager import ConnectionManager

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hospital Staff Allocation AI",
    description="AI-powered hospital staff allocation and management system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
manager = ConnectionManager()

# Include available routers
app.include_router(staff.router, prefix="/api/staff", tags=["staff"])
app.include_router(shifts.router, prefix="/api/shifts", tags=["shifts"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

# Uncomment these when the routers are implemented
# app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])
app.include_router(allocation.router, prefix="/api/allocation", tags=["allocation"])

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            # Handle different message types
            if message["type"] == "allocation_update":
                await manager.broadcast(message)
            elif message["type"] == "shift_update":
                await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@app.get("/")
async def root():
    return {"message": "Hospital Staff Allocation AI API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)