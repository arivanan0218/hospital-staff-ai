# Fix 1: Create backend/app/models/__init__.py
# This file ensures proper import order

from app.database import Base

# Import models in correct order to avoid circular imports
from .departments import Department
from .staff import Staff
from .shifts import Shift, ShiftAssignment
from .attendance import Attendance
from .staff_availability import StaffAvailability

# Ensure all models are available
__all__ = [
    "Base",
    "Department", 
    "Staff",
    "Shift",
    "ShiftAssignment", 
    "Attendance",
    "StaffAvailability"
]