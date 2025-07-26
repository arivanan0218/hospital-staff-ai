# from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, Text, Float
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.database import Base

# class Attendance(Base):
#     __tablename__ = "attendance"
    
#     id = Column(Integer, primary_key=True, index=True)
#     staff_id = Column(Integer, ForeignKey("staff.id"))
#     shift_assignment_id = Column(Integer, ForeignKey("shift_assignments.id"))
#     clock_in = Column(DateTime)
#     clock_out = Column(DateTime)
#     break_start = Column(DateTime)
#     break_end = Column(DateTime)
#     total_hours = Column(Float)
#     overtime_hours = Column(Float, default=0)
#     is_absent = Column(Boolean, default=False)
#     absence_reason = Column(Text)
#     notes = Column(Text)
#     created_at = Column(DateTime, default=func.now())
    
#     # Relationships
#     staff = relationship("Staff", back_populates="attendance_records")

# class StaffAvailability(Base):
#     __tablename__ = "staff_availability"
    
#     id = Column(Integer, primary_key=True, index=True)
#     staff_id = Column(Integer, ForeignKey("staff.id"))
#     date = Column(DateTime, nullable=False)
#     is_available = Column(Boolean, default=True)
#     preferred_start_time = Column(DateTime)
#     preferred_end_time = Column(DateTime)
#     max_hours = Column(Integer)
#     notes = Column(Text)
#     created_at = Column(DateTime, default=func.now())
    
# Fix 3: Update backend/app/models/attendance.py
# Simplify relationships to avoid circular imports

from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    shift_assignment_id = Column(Integer, ForeignKey("shift_assignments.id"))
    clock_in = Column(DateTime)
    clock_out = Column(DateTime)
    break_start = Column(DateTime)
    break_end = Column(DateTime)
    total_hours = Column(Float)
    overtime_hours = Column(Float, default=0)
    is_absent = Column(Boolean, default=False)
    absence_reason = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    staff = relationship("Staff")