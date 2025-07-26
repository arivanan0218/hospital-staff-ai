from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class StaffAvailability(Base):
    __tablename__ = "staff_availability"
    
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    is_available = Column(Boolean, default=True)
    preferred_start_time = Column(DateTime)
    preferred_end_time = Column(DateTime)
    max_hours = Column(Integer)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    staff = relationship("Staff", back_populates="availability_records")
