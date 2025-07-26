from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.staff import StaffRole, StaffStatus

class StaffBase(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: StaffRole
    department_id: Optional[int] = None
    hourly_rate: Optional[float] = None
    max_hours_per_week: int = 40
    skills: Optional[str] = None
    certifications: Optional[str] = None

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[StaffRole] = None
    department_id: Optional[int] = None
    status: Optional[StaffStatus] = None
    hourly_rate: Optional[float] = None
    max_hours_per_week: Optional[int] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None

class StaffResponse(StaffBase):
    id: int
    status: StaffStatus
    hire_date: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True