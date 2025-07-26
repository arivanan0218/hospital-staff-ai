# from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, Enum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.database import Base
# import enum

# class StaffRole(enum.Enum):
#     DOCTOR = "doctor"
#     NURSE = "nurse"
#     TECHNICIAN = "technician"
#     ADMINISTRATOR = "administrator"
#     SUPPORT = "support"

# class StaffStatus(enum.Enum):
#     ACTIVE = "active"
#     INACTIVE = "inactive"
#     ON_LEAVE = "on_leave"

# class Staff(Base):
#     __tablename__ = "staff"
    
#     id = Column(Integer, primary_key=True, index=True)
#     employee_id = Column(String, unique=True, index=True, nullable=False)
#     first_name = Column(String, nullable=False)
#     last_name = Column(String, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     phone = Column(String)
#     role = Column(Enum(StaffRole), nullable=False)
#     department_id = Column(Integer, ForeignKey("departments.id"))
#     status = Column(Enum(StaffStatus), default=StaffStatus.ACTIVE)
#     hire_date = Column(DateTime, default=func.now())
#     hourly_rate = Column(Float)
#     max_hours_per_week = Column(Integer, default=40)
#     skills = Column(Text)  # JSON string of skills
#     certifications = Column(Text)  # JSON string of certifications
#     created_at = Column(DateTime, default=func.now())
#     updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
#     # Relationships
#     department = relationship("Department", back_populates="staff")
#     shift_assignments = relationship("ShiftAssignment", back_populates="staff")
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.staff_availability import StaffAvailability
from app.database import Base
import enum

class StaffRole(enum.Enum):
    DOCTOR = "doctor"
    NURSE = "nurse"
    TECHNICIAN = "technician"
    ADMINISTRATOR = "administrator"
    SUPPORT = "support"

class StaffStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ON_LEAVE = "on_leave"

class Staff(Base):
    __tablename__ = "staff"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    role = Column(Enum(StaffRole), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    status = Column(Enum(StaffStatus), default=StaffStatus.ACTIVE)
    hire_date = Column(DateTime, default=func.now())
    hourly_rate = Column(Float)
    max_hours_per_week = Column(Integer, default=40)
    skills = Column(Text)  # JSON string of skills
    certifications = Column(Text)  # JSON string of certifications
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships - use string references to avoid circular imports
    department = relationship("Department", back_populates="staff")
    shift_assignments = relationship("ShiftAssignment", back_populates="staff")
    availability_records = relationship("StaffAvailability", back_populates="staff")
    # Remove problematic relationships for now - we'll add them later if needed
    # attendance_records = relationship("Attendance", back_populates="staff")