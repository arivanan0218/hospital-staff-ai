from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.staff import Staff, StaffRole, StaffStatus
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from app.services.staff_service import StaffService

router = APIRouter()

@router.post("/", response_model=StaffResponse)
async def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    return staff_service.create_staff(staff)

@router.get("/", response_model=List[StaffResponse])
async def get_all_staff(
    skip: int = 0, 
    limit: int = 100, 
    role: Optional[StaffRole] = None,
    department_id: Optional[int] = None,
    status: Optional[StaffStatus] = None,
    db: Session = Depends(get_db)
):
    staff_service = StaffService(db)
    return staff_service.get_staff_list(skip, limit, role, department_id, status)

@router.get("/{staff_id}", response_model=StaffResponse)
async def get_staff(staff_id: int, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    staff = staff_service.get_staff_by_id(staff_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff

@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff(staff_id: int, staff_update: StaffUpdate, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    staff = staff_service.update_staff(staff_id, staff_update)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff

@router.delete("/{staff_id}")
async def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    success = staff_service.delete_staff(staff_id)
    if not success:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return {"message": "Staff member deleted successfully"}

@router.get("/{staff_id}/availability")
async def get_staff_availability(staff_id: int, db: Session = Depends(get_db)):
    staff_service = StaffService(db)
    availability = staff_service.get_staff_availability(staff_id)
    return availability