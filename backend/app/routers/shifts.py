from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.shifts import Shift, ShiftType, ShiftStatus
from app.models.staff import Staff
from app.schemas.shifts import ShiftCreate, ShiftUpdate, ShiftResponse, ShiftAssignmentResponse
from app.services.shift_service import ShiftService

router = APIRouter()

@router.post("/", response_model=ShiftResponse)
async def create_shift(shift: ShiftCreate, db: Session = Depends(get_db)):
    shift_service = ShiftService(db)
    return shift_service.create_shift(shift)

@router.get("/", response_model=List[ShiftResponse])
async def get_shifts(
    skip: int = 0,
    limit: int = 100,
    department_id: Optional[int] = Query(None),
    shift_type: Optional[ShiftType] = Query(None),
    status: Optional[ShiftStatus] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    shift_service = ShiftService(db)
    return shift_service.get_shifts_list(
        skip=skip, 
        limit=limit, 
        department_id=department_id,
        shift_type=shift_type,
        status=status,
        start_date=start_date,
        end_date=end_date
    )

@router.get("/{shift_id}", response_model=ShiftResponse)
async def get_shift(shift_id: int, db: Session = Depends(get_db)):
    shift_service = ShiftService(db)
    shift = shift_service.get_shift_by_id(shift_id)
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    return shift

@router.post("/{shift_id}/assign")
async def assign_staff(
    shift_id: int, 
    staff_assignment: dict,
    db: Session = Depends(get_db)
):
    print(f"\n=== Assigning Staff to Shift ===")
    print(f"Shift ID: {shift_id}")
    print(f"Assignment data: {staff_assignment}")
    
    if not staff_assignment or "staff_id" not in staff_assignment:
        error_msg = "Missing required field: staff_id"
        print(f"Validation error: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    shift_service = ShiftService(db)
    
    # Verify shift exists
    shift = shift_service.get_shift_by_id(shift_id)
    if not shift:
        error_msg = f"Shift with ID {shift_id} not found"
        print(error_msg)
        raise HTTPException(status_code=404, detail=error_msg)
    
    # Verify staff exists
    staff = db.query(Staff).filter(Staff.id == staff_assignment["staff_id"]).first()
    if not staff:
        error_msg = f"Staff with ID {staff_assignment['staff_id']} not found"
        print(error_msg)
        raise HTTPException(status_code=404, detail=error_msg)
    
    try:
        # Check for conflicting shifts
        conflicts = shift_service.get_conflicting_shifts(
            staff_id=staff_assignment["staff_id"],
            start_time=shift.start_time,
            end_time=shift.end_time
        )
        
        if conflicts:
            conflict_ids = [str(c.id) for c in conflicts]
            error_msg = f"Staff is already assigned to conflicting shift(s): {', '.join(conflict_ids)}"
            print(error_msg)
            raise ValueError(error_msg)
            
        assignment = shift_service.assign_staff_to_shift(
            shift_id=shift_id,
            staff_id=staff_assignment["staff_id"],
            assigned_by=staff_assignment.get("assigned_by", "system")
        )
        
        print(f"Successfully assigned staff {staff_assignment['staff_id']} to shift {shift_id}")
        return {
            "message": "Staff assigned successfully", 
            "assignment_id": assignment.id,
            "shift_id": shift_id,
            "staff_id": staff_assignment["staff_id"]
        }
        
    except ValueError as e:
        print(f"Assignment error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during assignment")

@router.get("/{shift_id}/assignments", response_model=List[ShiftAssignmentResponse])
async def get_shift_assignments(shift_id: int, db: Session = Depends(get_db)):
    shift_service = ShiftService(db)
    return shift_service.get_shift_assignments(shift_id)