from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.database import get_db
from app.models.staff import Staff, StaffStatus
from app.models.shifts import Shift, ShiftStatus, ShiftAssignment
from app.models.attendance import Attendance
from datetime import datetime, timedelta
from typing import Dict, List, Any

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    # Calculate key metrics
    total_staff = db.query(Staff).filter(Staff.status == StaffStatus.ACTIVE).count()
    
    active_shifts = db.query(Shift).filter(
        and_(
            Shift.status == ShiftStatus.IN_PROGRESS,
            Shift.start_time <= datetime.now(),
            Shift.end_time >= datetime.now()
        )
    ).count()
    
    pending_allocations = db.query(Shift).filter(
        and_(
            Shift.status == ShiftStatus.SCHEDULED,
            Shift.start_time >= datetime.now()
        )
    ).count()
    
    # Calculate allocation efficiency (placeholder)
    allocation_efficiency = 85  # This would be calculated based on actual metrics
    
    return {
        "totalStaff": total_staff,
        "activeShifts": active_shifts,
        "pendingAllocations": pending_allocations,
        "allocationEfficiency": allocation_efficiency
    }

@router.get("/activity")
async def get_recent_activity(db: Session = Depends(get_db)):
    # Get recent activities (last 24 hours)
    recent_assignments = db.query(ShiftAssignment).filter(
        ShiftAssignment.assigned_at >= datetime.now() - timedelta(hours=24)
    ).order_by(ShiftAssignment.assigned_at.desc()).limit(10).all()
    
    activities = []
    for assignment in recent_assignments:
        activities.append({
            "type": "assignment",
            "description": f"Staff assigned to {assignment.shift.name}",
            "timestamp": assignment.assigned_at.isoformat()
        })
    
    return activities

@router.get("/alerts")
async def get_alerts(db: Session = Depends(get_db)):
    alerts = []
    
    # Check for understaffed shifts
    understaffed_shifts = db.query(Shift).filter(
        and_(
            Shift.status == ShiftStatus.SCHEDULED,
            Shift.start_time >= datetime.now(),
            Shift.start_time <= datetime.now() + timedelta(hours=24)
        )
    ).all()
    
    for shift in understaffed_shifts:
        assigned_count = len(shift.assignments)
        if assigned_count < shift.required_staff_count:
            alerts.append({
                "severity": "warning",
                "message": f"Shift '{shift.name}' is understaffed ({assigned_count}/{shift.required_staff_count})"
            })
    
    return alerts