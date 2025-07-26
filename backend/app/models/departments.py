from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)
    min_staff_required = Column(Integer, default=1)
    max_staff_capacity = Column(Integer, default=10)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    staff = relationship("Staff", back_populates="department")
    shifts = relationship("Shift", back_populates="department")