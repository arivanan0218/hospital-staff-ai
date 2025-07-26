from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class ShiftType(enum.Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    NIGHT = "night"
    EMERGENCY = "emergency"

class ShiftStatus(enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Shift(Base):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    shift_type = Column(Enum(ShiftType), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    required_staff_count = Column(Integer, default=1)
    required_skills = Column(Text)  # JSON string
    status = Column(Enum(ShiftStatus), default=ShiftStatus.SCHEDULED)
    priority_level = Column(Integer, default=1)  # 1-5, 5 being highest
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    department = relationship("Department", back_populates="shifts")
    assignments = relationship("ShiftAssignment", back_populates="shift")

class ShiftAssignment(Base):
    __tablename__ = "shift_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    staff_id = Column(Integer, ForeignKey("staff.id"))
    assigned_at = Column(DateTime, default=func.now())
    assigned_by = Column(String)  # User who made the assignment
    is_confirmed = Column(Boolean, default=False)
    notes = Column(Text)
    
    # Relationships
    shift = relationship("Shift", back_populates="assignments")
    staff = relationship("Staff", back_populates="shift_assignments")