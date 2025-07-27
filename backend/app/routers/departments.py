from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.departments import Department
from app.schemas.departments import DepartmentCreate, DepartmentUpdate, DepartmentResponse

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
async def get_all_departments(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all departments with pagination"""
    departments = db.query(Department).offset(skip).limit(limit).all()
    return departments

@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(department_id: int, db: Session = Depends(get_db)):
    """Get a specific department by ID"""
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return department

@router.post("/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    """Create a new department"""
    # Check if department with this name already exists
    db_department = db.query(Department).filter(Department.name == department.name).first()
    if db_department:
        raise HTTPException(status_code=400, detail="Department with this name already exists")
    
    # Create new department
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int, 
    department: DepartmentUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing department"""
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if not db_department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Update department fields
    update_data = department.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_department, field, value)
    
    db.commit()
    db.refresh(db_department)
    return db_department

@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(department_id: int, db: Session = Depends(get_db)):
    """Delete a department"""
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if not db_department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Check if department has staff assigned
    if db_department.staff:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete department with assigned staff. Reassign or remove staff first."
        )
    
    db.delete(db_department)
    db.commit()
    return None

@router.get("/{department_id}/staff", response_model=List[dict])
async def get_department_staff(department_id: int, db: Session = Depends(get_db)):
    """Get all staff members in a specific department"""
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Return basic staff information
    return [
        {
            "id": staff.id,
            "employee_id": staff.employee_id,
            "first_name": staff.first_name,
            "last_name": staff.last_name,
            "email": staff.email,
            "role": staff.role,
            "status": staff.status
        }
        for staff in department.staff
    ]
