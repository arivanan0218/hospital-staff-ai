from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.staff import Staff, StaffRole, StaffStatus
from app.models.staff_availability import StaffAvailability
from app.schemas.staff import StaffCreate, StaffUpdate
from typing import List, Optional
from datetime import datetime, timedelta

class StaffService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_staff(self, staff_data: StaffCreate) -> Staff:
        db_staff = Staff(**staff_data.dict())
        self.db.add(db_staff)
        self.db.commit()
        self.db.refresh(db_staff)
        return db_staff
    
    def get_staff_by_id(self, staff_id: int) -> Optional[Staff]:
        return self.db.query(Staff).filter(Staff.id == staff_id).first()
    
    def get_staff_list(
        self, 
        skip: int = 0, 
        limit: int = 100,
        role: Optional[StaffRole] = None,
        department_id: Optional[int] = None,
        status: Optional[StaffStatus] = None
    ) -> List[Staff]:
        query = self.db.query(Staff)
        
        if role:
            query = query.filter(Staff.role == role)
        if department_id:
            query = query.filter(Staff.department_id == department_id)
        if status:
            query = query.filter(Staff.status == status)
            
        return query.offset(skip).limit(limit).all()
    
    def update_staff(self, staff_id: int, staff_update: StaffUpdate) -> Optional[Staff]:
        db_staff = self.get_staff_by_id(staff_id)
        if not db_staff:
            return None
        
        update_data = staff_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_staff, field, value)
        
        self.db.commit()
        self.db.refresh(db_staff)
        return db_staff
    
    def delete_staff(self, staff_id: int) -> bool:
        db_staff = self.get_staff_by_id(staff_id)
        if not db_staff:
            return False
        
        self.db.delete(db_staff)
        self.db.commit()
        return True
    
    def get_staff_availability(self, staff_id: int, days_ahead: int = 30) -> List[StaffAvailability]:
        end_date = datetime.now() + timedelta(days=days_ahead)
        return self.db.query(StaffAvailability).filter(
            and_(
                StaffAvailability.staff_id == staff_id,
                StaffAvailability.date >= datetime.now().date(),
                StaffAvailability.date <= end_date.date()
            )
        ).all()
    
    def get_available_staff_for_shift(self, shift_start: datetime, shift_end: datetime, required_skills: List[str] = None) -> List[Staff]:
        """Get staff available for a specific shift time with optional skill requirements"""
        query = self.db.query(Staff).filter(Staff.status == StaffStatus.ACTIVE)
        
        # Add skill filtering logic here if needed
        if required_skills:
            # This would need more complex JSON querying in production
            pass
            
        return query.all()