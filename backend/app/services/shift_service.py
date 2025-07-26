from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.shifts import Shift, ShiftAssignment, ShiftType, ShiftStatus
from app.models.staff import Staff
from app.schemas.shifts import ShiftCreate, ShiftUpdate
from typing import List, Optional
from datetime import datetime, timedelta

class ShiftService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_shift(self, shift_data: ShiftCreate) -> Shift:
        db_shift = Shift(**shift_data.dict())
        self.db.add(db_shift)
        self.db.commit()
        self.db.refresh(db_shift)
        return db_shift
    
    def get_shift_by_id(self, shift_id: int) -> Optional[Shift]:
        return self.db.query(Shift).filter(Shift.id == shift_id).first()
    
    def get_shifts_list(
        self, 
        skip: int = 0, 
        limit: int = 100,
        department_id: Optional[int] = None,
        shift_type: Optional[ShiftType] = None,
        status: Optional[ShiftStatus] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Shift]:
        query = self.db.query(Shift)
        
        if department_id:
            query = query.filter(Shift.department_id == department_id)
        if shift_type:
            query = query.filter(Shift.shift_type == shift_type)
        if status:
            query = query.filter(Shift.status == status)
        if start_date:
            query = query.filter(Shift.start_time >= start_date)
        if end_date:
            query = query.filter(Shift.end_time <= end_date)
            
        return query.offset(skip).limit(limit).all()
    
    def assign_staff_to_shift(self, shift_id: int, staff_id: int, assigned_by: str = "system") -> ShiftAssignment:
        # Check if assignment already exists
        existing = self.db.query(ShiftAssignment).filter(
            and_(ShiftAssignment.shift_id == shift_id, ShiftAssignment.staff_id == staff_id)
        ).first()
        
        if existing:
            raise ValueError("Staff member already assigned to this shift")
        
        assignment = ShiftAssignment(
            shift_id=shift_id,
            staff_id=staff_id,
            assigned_by=assigned_by
        )
        
        self.db.add(assignment)
        self.db.commit()
        self.db.refresh(assignment)
        return assignment
    
    def get_shift_assignments(self, shift_id: int) -> List[ShiftAssignment]:
        return self.db.query(ShiftAssignment).filter(ShiftAssignment.shift_id == shift_id).all()
    
    def get_conflicting_shifts(self, staff_id: int, start_time: datetime, end_time: datetime) -> List[Shift]:
        """Find shifts that conflict with the given time range for a staff member"""
        assigned_shifts = self.db.query(Shift).join(ShiftAssignment).filter(
            and_(
                ShiftAssignment.staff_id == staff_id,
                or_(
                    and_(Shift.start_time <= start_time, Shift.end_time > start_time),
                    and_(Shift.start_time < end_time, Shift.end_time >= end_time),
                    and_(Shift.start_time >= start_time, Shift.end_time <= end_time)
                )
            )
        ).all()
        
        return assigned_shifts