from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    """Base schema for Department"""
    name: str = Field(..., description="Name of the department")
    description: Optional[str] = Field(None, description="Description of the department")
    min_staff_required: int = Field(1, ge=1, description="Minimum staff required for the department")
    max_staff_capacity: int = Field(10, ge=1, description="Maximum staff capacity for the department")

class DepartmentCreate(DepartmentBase):
    """Schema for creating a new department"""
    pass

class DepartmentUpdate(DepartmentBase):
    """Schema for updating an existing department"""
    name: Optional[str] = Field(None, description="Name of the department")
    min_staff_required: Optional[int] = Field(None, ge=1, description="Minimum staff required for the department")
    max_staff_capacity: Optional[int] = Field(None, ge=1, description="Maximum staff capacity for the department")

class DepartmentResponse(DepartmentBase):
    """Schema for department response"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
