# import asyncio
# import sys
# import os
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# from sqlalchemy.orm import Session
# from app.database import SessionLocal, engine
# from app.models.staff import Staff, StaffRole, StaffStatus
# from app.models.departments import Department
# from app.models.shifts import Shift, ShiftType, ShiftStatus
# from datetime import datetime, timedelta
# import json

# def create_sample_data():
#     db = SessionLocal()
    
#     try:
#         # Create departments
#         departments = [
#             Department(name="Emergency Department", description="24/7 emergency care", min_staff_required=3, max_staff_capacity=8),
#             Department(name="ICU", description="Intensive Care Unit", min_staff_required=4, max_staff_capacity=10),
#             Department(name="General Surgery", description="General surgical procedures", min_staff_required=2, max_staff_capacity=6),
#             Department(name="Pediatrics", description="Children's healthcare", min_staff_required=2, max_staff_capacity=5),
#             Department(name="Cardiology", description="Heart and cardiovascular care", min_staff_required=2, max_staff_capacity=4),
#         ]
        
#         for dept in departments:
#             db.add(dept)
#         db.commit()
        
#         # Get department IDs
#         dept_ids = {dept.name: dept.id for dept in db.query(Department).all()}
        
#         # Create sample staff
#         staff_members = [
#             # Doctors
#             Staff(employee_id="DOC001", first_name="Sarah", last_name="Johnson", email="sarah.johnson@hospital.com", role=StaffRole.DOCTOR, department_id=dept_ids["Emergency Department"], hourly_rate=85.0, skills='["Emergency Medicine", "Trauma Care"]'),
#             Staff(employee_id="DOC002", first_name="Michael", last_name="Chen", email="michael.chen@hospital.com", role=StaffRole.DOCTOR, department_id=dept_ids["ICU"], hourly_rate=90.0, skills='["Critical Care", "Intensive Care"]'),
#             Staff(employee_id="DOC003", first_name="Emily", last_name="Rodriguez", email="emily.rodriguez@hospital.com", role=StaffRole.DOCTOR, department_id=dept_ids["General Surgery"], hourly_rate=95.0, skills='["General Surgery", "Laparoscopy"]'),
            
#             # Nurses
#             Staff(employee_id="NUR001", first_name="Jennifer", last_name="Smith", email="jennifer.smith@hospital.com", role=StaffRole.NURSE, department_id=dept_ids["Emergency Department"], hourly_rate=35.0, skills='["Emergency Nursing", "Triage"]'),
#             Staff(employee_id="NUR002", first_name="David", last_name="Wilson", email="david.wilson@hospital.com", role=StaffRole.NURSE, department_id=dept_ids["ICU"], hourly_rate=38.0, skills='["Critical Care Nursing", "Ventilator Management"]'),
#             Staff(employee_id="NUR003", first_name="Lisa", last_name="Brown", email="lisa.brown@hospital.com", role=StaffRole.NURSE, department_id=dept_ids["Pediatrics"], hourly_rate=36.0, skills='["Pediatric Nursing", "Family Care"]'),
#             Staff(employee_id="NUR004", first_name="Robert", last_name="Davis", email="robert.davis@hospital.com", role=StaffRole.NURSE, department_id=dept_ids["General Surgery"], hourly_rate=37.0, skills='["Surgical Nursing", "Recovery Care"]'),
            
#             # Technicians
#             Staff(employee_id="TEC001", first_name="Amanda", last_name="Lee", email="amanda.lee@hospital.com", role=StaffRole.TECHNICIAN, department_id=dept_ids["Cardiology"], hourly_rate=28.0, skills='["EKG", "Cardiac Monitoring"]'),
#             Staff(employee_id="TEC002", first_name="James", last_name="Miller", email="james.miller@hospital.com", role=StaffRole.TECHNICIAN, department_id=dept_ids["Emergency Department"], hourly_rate=25.0, skills='["X-Ray", "Lab Work"]'),
#         ]
        
#         for staff in staff_members:
#             db.add(staff)
#         db.commit()
        
#         # Create sample shifts for the next 7 days
#         base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
#         for day in range(7):
#             current_date = base_date + timedelta(days=day)
            
#             # Morning shifts (7 AM - 3 PM)
#             morning_shift = Shift(
#                 name=f"Morning Shift - Day {day + 1}",
#                 department_id=dept_ids["Emergency Department"],
#                 shift_type=ShiftType.MORNING,
#                 start_time=current_date.replace(hour=7),
#                 end_time=current_date.replace(hour=15),
#                 required_staff_count=3,
#                 required_skills='["Emergency Medicine", "Triage"]',
#                 priority_level=2
#             )
            
#             # Afternoon shifts (3 PM - 11 PM)
#             afternoon_shift = Shift(
#                 name=f"Afternoon Shift - Day {day + 1}",
#                 department_id=dept_ids["ICU"],
#                 shift_type=ShiftType.AFTERNOON,
#                 start_time=current_date.replace(hour=15),
#                 end_time=current_date.replace(hour=23),
#                 required_staff_count=4,
#                 required_skills='["Critical Care", "Intensive Care"]',
#                 priority_level=3
#             )
            
#             # Night shifts (11 PM - 7 AM)
#             night_shift = Shift(
#                 name=f"Night Shift - Day {day + 1}",
#                 department_id=dept_ids["Emergency Department"],
#                 shift_type=ShiftType.NIGHT,
#                 start_time=current_date.replace(hour=23),
#                 end_time=(current_date + timedelta(days=1)).replace(hour=7),
#                 required_staff_count=2,
#                 required_skills='["Emergency Medicine"]',
#                 priority_level=4
#             )
            
#             db.add(morning_shift)
#             db.add(afternoon_shift)
#             db.add(night_shift)
        
#         db.commit()
#         print("✅ Sample data created successfully!")
        
#     except Exception as e:
#         print(f"❌ Error creating sample data: {e}")
#         db.rollback()
#     finally:
#         db.close()

# if __name__ == "__main__":
#     create_sample_data()

# Fix 4: Create a simplified backend/scripts/populate_sample_data.py

import sys
import os

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from datetime import datetime, timedelta
import json

# Import models directly
from app.models.departments import Department
from app.models.staff import Staff, StaffRole, StaffStatus
from app.models.shifts import Shift, ShiftType, ShiftStatus

def create_sample_data():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        print("🏥 Creating sample data for Hospital Staff AI...")
        
        # Clear existing data (optional - remove if you want to keep existing data)
        db.query(Shift).delete()
        db.query(Staff).delete()
        db.query(Department).delete()
        db.commit()
        
        # Create departments
        print("📋 Creating departments...")
        departments_data = [
            {"name": "Emergency Department", "description": "24/7 emergency care", "min_staff_required": 3, "max_staff_capacity": 8},
            {"name": "ICU", "description": "Intensive Care Unit", "min_staff_required": 4, "max_staff_capacity": 10},
            {"name": "General Surgery", "description": "General surgical procedures", "min_staff_required": 2, "max_staff_capacity": 6},
            {"name": "Pediatrics", "description": "Children's healthcare", "min_staff_required": 2, "max_staff_capacity": 5},
            {"name": "Cardiology", "description": "Heart and cardiovascular care", "min_staff_required": 2, "max_staff_capacity": 4},
        ]
        
        created_departments = []
        for dept_data in departments_data:
            dept = Department(**dept_data)
            db.add(dept)
            created_departments.append(dept)
        
        db.commit()
        print(f"✅ Created {len(created_departments)} departments")
        
        # Refresh to get IDs
        for dept in created_departments:
            db.refresh(dept)
        
        # Create department lookup
        dept_lookup = {dept.name: dept.id for dept in created_departments}
        
        # Create sample staff
        print("👥 Creating staff members...")
        staff_data = [
            # Doctors
            {
                "employee_id": "DOC001", 
                "first_name": "Sarah", 
                "last_name": "Johnson", 
                "email": "sarah.johnson@hospital.com", 
                "phone": "+1-555-0101",
                "role": StaffRole.DOCTOR, 
                "department_id": dept_lookup["Emergency Department"], 
                "hourly_rate": 85.0, 
                "skills": json.dumps(["Emergency Medicine", "Trauma Care"]),
                "certifications": "MD, Emergency Medicine Board Certified"
            },
            {
                "employee_id": "DOC002", 
                "first_name": "Michael", 
                "last_name": "Chen", 
                "email": "michael.chen@hospital.com", 
                "phone": "+1-555-0102",
                "role": StaffRole.DOCTOR, 
                "department_id": dept_lookup["ICU"], 
                "hourly_rate": 90.0, 
                "skills": json.dumps(["Critical Care", "Intensive Care"]),
                "certifications": "MD, Critical Care Medicine"
            },
            {
                "employee_id": "DOC003", 
                "first_name": "Emily", 
                "last_name": "Rodriguez", 
                "email": "emily.rodriguez@hospital.com", 
                "phone": "+1-555-0103",
                "role": StaffRole.DOCTOR, 
                "department_id": dept_lookup["General Surgery"], 
                "hourly_rate": 95.0, 
                "skills": json.dumps(["General Surgery", "Laparoscopy"]),
                "certifications": "MD, General Surgery Board Certified"
            },
            
            # Nurses
            {
                "employee_id": "NUR001", 
                "first_name": "Jennifer", 
                "last_name": "Smith", 
                "email": "jennifer.smith@hospital.com", 
                "phone": "+1-555-0201",
                "role": StaffRole.NURSE, 
                "department_id": dept_lookup["Emergency Department"], 
                "hourly_rate": 35.0, 
                "skills": json.dumps(["Emergency Nursing", "Triage"]),
                "certifications": "RN, Emergency Nursing Certification"
            },
            {
                "employee_id": "NUR002", 
                "first_name": "David", 
                "last_name": "Wilson", 
                "email": "david.wilson@hospital.com", 
                "phone": "+1-555-0202",
                "role": StaffRole.NURSE, 
                "department_id": dept_lookup["ICU"], 
                "hourly_rate": 38.0, 
                "skills": json.dumps(["Critical Care Nursing", "Ventilator Management"]),
                "certifications": "RN, Critical Care Certified (CCRN)"
            },
            {
                "employee_id": "NUR003", 
                "first_name": "Lisa", 
                "last_name": "Brown", 
                "email": "lisa.brown@hospital.com", 
                "phone": "+1-555-0203",
                "role": StaffRole.NURSE, 
                "department_id": dept_lookup["Pediatrics"], 
                "hourly_rate": 36.0, 
                "skills": json.dumps(["Pediatric Nursing", "Family Care"]),
                "certifications": "RN, Pediatric Nursing Certification"
            },
            {
                "employee_id": "NUR004", 
                "first_name": "Robert", 
                "last_name": "Davis", 
                "email": "robert.davis@hospital.com", 
                "phone": "+1-555-0204",
                "role": StaffRole.NURSE, 
                "department_id": dept_lookup["General Surgery"], 
                "hourly_rate": 37.0, 
                "skills": json.dumps(["Surgical Nursing", "Recovery Care"]),
                "certifications": "RN, Perioperative Nursing Certification"
            },
            
            # Technicians
            {
                "employee_id": "TEC001", 
                "first_name": "Amanda", 
                "last_name": "Lee", 
                "email": "amanda.lee@hospital.com", 
                "phone": "+1-555-0301",
                "role": StaffRole.TECHNICIAN, 
                "department_id": dept_lookup["Cardiology"], 
                "hourly_rate": 28.0, 
                "skills": json.dumps(["EKG", "Cardiac Monitoring"]),
                "certifications": "Certified EKG Technician"
            },
            {
                "employee_id": "TEC002", 
                "first_name": "James", 
                "last_name": "Miller", 
                "email": "james.miller@hospital.com", 
                "phone": "+1-555-0302",
                "role": StaffRole.TECHNICIAN, 
                "department_id": dept_lookup["Emergency Department"], 
                "hourly_rate": 25.0, 
                "skills": json.dumps(["X-Ray", "Lab Work"]),
                "certifications": "Radiologic Technician License"
            },
        ]
        
        created_staff = []
        for staff_info in staff_data:
            staff = Staff(**staff_info)
            db.add(staff)
            created_staff.append(staff)
        
        db.commit()
        print(f"✅ Created {len(created_staff)} staff members")
        
        # Create sample shifts for the next 7 days
        print("📅 Creating shifts...")
        base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        created_shifts = []
        for day in range(7):
            current_date = base_date + timedelta(days=day)
            
            # Morning shifts (7 AM - 3 PM)
            morning_shift = Shift(
                name=f"Emergency Morning Shift - Day {day + 1}",
                department_id=dept_lookup["Emergency Department"],
                shift_type=ShiftType.MORNING,
                start_time=current_date.replace(hour=7),
                end_time=current_date.replace(hour=15),
                required_staff_count=3,
                required_skills=json.dumps(["Emergency Medicine", "Triage"]),
                priority_level=2,
                status=ShiftStatus.SCHEDULED
            )
            
            # Afternoon shifts (3 PM - 11 PM)
            afternoon_shift = Shift(
                name=f"ICU Afternoon Shift - Day {day + 1}",
                department_id=dept_lookup["ICU"],
                shift_type=ShiftType.AFTERNOON,
                start_time=current_date.replace(hour=15),
                end_time=current_date.replace(hour=23),
                required_staff_count=4,
                required_skills=json.dumps(["Critical Care", "Intensive Care"]),
                priority_level=3,
                status=ShiftStatus.SCHEDULED
            )
            
            # Night shifts (11 PM - 7 AM)
            night_shift = Shift(
                name=f"Emergency Night Shift - Day {day + 1}",
                department_id=dept_lookup["Emergency Department"],
                shift_type=ShiftType.NIGHT,
                start_time=current_date.replace(hour=23),
                end_time=(current_date + timedelta(days=1)).replace(hour=7),
                required_staff_count=2,
                required_skills=json.dumps(["Emergency Medicine"]),
                priority_level=4,
                status=ShiftStatus.SCHEDULED
            )
            
            db.add(morning_shift)
            db.add(afternoon_shift)
            db.add(night_shift)
            created_shifts.extend([morning_shift, afternoon_shift, night_shift])
        
        db.commit()
        print(f"✅ Created {len(created_shifts)} shifts")
        
        # Summary
        print("\n🎉 Sample data created successfully!")
        print(f"📊 Summary:")
        print(f"   • {len(created_departments)} Departments")
        print(f"   • {len(created_staff)} Staff Members")
        print(f"   • {len(created_shifts)} Shifts")
        print(f"\n🚀 You can now start the application and test the features!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()