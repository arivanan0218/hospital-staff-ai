from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.shifts import ShiftType, ShiftStatus

class ShiftBase(BaseModel):
    name: str
    department_id: int
    shift_type: ShiftType
    start_time: datetime
    end_time: datetime
    required_staff_count: int = 1
    required_skills: Optional[str] = None
    priority_level: int = 1
    notes: Optional[str] = None

class ShiftCreate(ShiftBase):
    pass

class ShiftUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[int] = None
    shift_type: Optional[ShiftType] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    required_staff_count: Optional[int] = None
    required_skills: Optional[str] = None
    status: Optional[ShiftStatus] = None
    priority_level: Optional[int] = None
    notes: Optional[str] = None

class ShiftResponse(ShiftBase):
    id: int
    status: ShiftStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class ShiftAssignmentResponse(BaseModel):
    id: int
    shift_id: int
    staff_id: int
    assigned_at: datetime
    assigned_by: str
    is_confirmed: bool
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True