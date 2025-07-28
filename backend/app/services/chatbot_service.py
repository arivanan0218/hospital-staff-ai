import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Staff, Department, Shift, StaffAvailability, ShiftAssignment
from app.services.staff_service import StaffService
from app.schemas.staff import StaffCreate
import re
from app.services.shift_service import ShiftService
from app.schemas.shifts import ShiftCreate, ShiftUpdate
from app.services.email_service import send_email

load_dotenv()

class ChatbotService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        self.system_prompt = """
        You are an AI assistant for a hospital staff management system. 
        You have access to the following information:
        - Staff details (name, role, department, contact info)
        - Department information
        - Shift schedules
        - Staff availability
        
        When answering questions, be concise and provide accurate information based on the available data.
        If you don't know the answer, say you don't have that information.
        """
        self.session_states = {}  # In-memory session state for CRUD (keyed by user/session id)

    def _get_session_state(self, session_id: str = "default"):
        if session_id not in self.session_states:
            self.session_states[session_id] = {"intent": None, "entity": None, "fields": {}, "pending_field": None, "awaiting_confirmation": False}
        return self.session_states[session_id]

    def _reset_session_state(self, session_id: str = "default"):
        self.session_states[session_id] = {"intent": None, "entity": None, "fields": {}, "pending_field": None, "awaiting_confirmation": False}

    def _detect_intent(self, user_message: str):
        msg = user_message.lower()
        if any(kw in msg for kw in ["add staff", "create staff", "new staff", "register staff"]):
            return ("create", "staff")
        if any(kw in msg for kw in ["show staff", "list staff", "view staff", "get staff"]):
            return ("read", "staff")
        if any(kw in msg for kw in ["update staff", "edit staff", "modify staff"]):
            return ("update", "staff")
        if any(kw in msg for kw in ["delete staff", "remove staff"]):
            return ("delete", "staff")
        if any(kw in msg for kw in ["add shift", "create shift", "new shift"]):
            return ("create", "shift")
        if any(kw in msg for kw in ["show shift", "list shift", "view shift", "get shift"]):
            return ("read", "shift")
        if any(kw in msg for kw in ["update shift", "edit shift", "modify shift"]):
            return ("update", "shift")
        if any(kw in msg for kw in ["delete shift", "remove shift"]):
            return ("delete", "shift")
        if any(kw in msg for kw in ["assign staff", "assign to shift", "assign shift", "assign employee"]):
            return ("assign", "staff_shift")
        return (None, None)

    def _get_staff_fields(self):
        # (field_name, prompt, required)
        return [
            ("employee_id", "What is the employee ID?", True),
            ("first_name", "What is the staff member's first name?", True),
            ("last_name", "What is the staff member's last name?", True),
            ("email", "What is the staff member's email address?", True),
            ("role", "What is the staff member's role? (doctor, nurse, technician, administrator, support)", True),
            ("phone", "What is the staff member's phone number? (optional, type 'skip' to skip)", False),
            ("department_id", "What is the department ID? (optional, type 'skip' to skip)", False),
            ("hourly_rate", "What is the hourly rate? (optional, type 'skip' to skip)", False),
            ("max_hours_per_week", "What is the max hours per week? (optional, type 'skip' to skip)", False),
            ("skills", "List any skills (comma-separated, optional, type 'skip' to skip)", False),
            ("certifications", "List any certifications (comma-separated, optional, type 'skip' to skip)", False),
        ]

    def _get_shift_fields(self):
        # (field_name, prompt, required)
        return [
            ("name", "What is the shift name?", True),
            ("shift_type", "What is the shift type? (morning, evening, night)", True),
            ("department_id", "What is the department ID?", True),
            ("start_time", "What is the shift start time? (YYYY-MM-DD HH:MM)", True),
            ("end_time", "What is the shift end time? (YYYY-MM-DD HH:MM)", True),
            ("status", "What is the shift status? (optional, type 'skip' to skip)", False),
        ]

    async def handle_create_staff(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        staff_fields = self._get_staff_fields()

        # If awaiting confirmation
        if state["awaiting_confirmation"]:
            if user_message.strip().lower() in ["yes", "y"]:
                # Create staff in DB
                try:
                    staff_data = StaffCreate(**fields)
                    staff_service = StaffService(db)
                    staff = staff_service.create_staff(staff_data)
                    self._reset_session_state(session_id)
                    return f"Staff member {staff.first_name} {staff.last_name} added successfully!"
                except Exception as e:
                    self._reset_session_state(session_id)
                    return f"Failed to add staff: {str(e)}"
            elif user_message.strip().lower() in ["no", "n"]:
                self._reset_session_state(session_id)
                return "Staff creation cancelled."
            else:
                return "Please reply 'yes' to confirm or 'no' to cancel."

        # Slot filling: find next missing field
        for field, prompt, required in staff_fields:
            if field not in fields:
                # If we just asked for this field, store the user's answer
                if state["pending_field"] == field:
                    value = user_message.strip()
                    if not value and not required:
                        fields[field] = None
                    elif value.lower() == "skip" and not required:
                        fields[field] = None
                    else:
                        if field == "role":
                            value = value.lower()
                        # Convert department_id, hourly_rate, max_hours_per_week to correct types if not skipped
                        if field == "department_id" and value:
                            try:
                                value = int(value)
                            except Exception:
                                return "Please enter a valid department ID (number) or type 'skip'."
                        if field == "hourly_rate" and value:
                            try:
                                value = float(value)
                            except Exception:
                                return "Please enter a valid hourly rate (number) or type 'skip'."
                        if field == "max_hours_per_week" and value:
                            try:
                                value = int(value)
                            except Exception:
                                return "Please enter a valid number for max hours per week or type 'skip'."
                        fields[field] = value if value != "" else None
                    state["pending_field"] = None
                else:
                    state["pending_field"] = field
                    return prompt

        # All fields collected, ask for confirmation
        summary = "Here is the information you provided:\n" + "\n".join([f"- {k.replace('_', ' ').title()}: {v}" for k, v in fields.items()])
        state["awaiting_confirmation"] = True
        return summary + "\nShould I add this staff member? (yes/no)"

    async def handle_read_staff(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        staff_service = StaffService(db)
        # If no identifier yet, ask for it
        if "identifier" not in fields:
            # Try to extract ID or name from user_message
            id_match = re.search(r"staff (\d+)", user_message.lower())
            if id_match:
                fields["identifier"] = int(id_match.group(1))
            else:
                # Try to extract name
                name_match = re.search(r"staff ([a-zA-Z]+) ?([a-zA-Z]*)", user_message.lower())
                if name_match:
                    fields["identifier"] = (name_match.group(1), name_match.group(2))
            if "identifier" not in fields:
                return "Please provide the staff ID or name to view, or type 'list' to see all staff."
        # Handle 'list' case
        if fields["identifier"] == "list":
            staff_list = staff_service.get_staff_list(limit=10)
            if not staff_list:
                self._reset_session_state(session_id)
                return "No staff found."
            msg = "Here are some staff members:\n" + "\n".join([f"- {s.id}: {s.first_name} {s.last_name} ({s.role.value})" for s in staff_list])
            self._reset_session_state(session_id)
            return msg
        # If identifier is int, treat as ID
        if isinstance(fields["identifier"], int):
            staff = staff_service.get_staff_by_id(fields["identifier"])
            if not staff:
                self._reset_session_state(session_id)
                return f"No staff found with ID {fields['identifier']}."
            msg = f"Staff ID {staff.id}: {staff.first_name} {staff.last_name}\nRole: {staff.role.value}\nEmail: {staff.email}\nPhone: {staff.phone or 'N/A'}\nDepartment ID: {staff.department_id or 'N/A'}\nStatus: {staff.status.value}\nHourly Rate: {staff.hourly_rate or 'N/A'}\nMax Hours/Week: {staff.max_hours_per_week}\nSkills: {staff.skills or 'N/A'}\nCertifications: {staff.certifications or 'N/A'}"
            self._reset_session_state(session_id)
            return msg
        # If identifier is tuple, treat as name
        if isinstance(fields["identifier"], tuple):
            fname, lname = fields["identifier"]
            staff_list = staff_service.get_staff_list()
            matches = [s for s in staff_list if s.first_name.lower() == fname.lower() and (not lname or s.last_name.lower() == lname.lower())]
            if not matches:
                self._reset_session_state(session_id)
                return f"No staff found with name {fname} {lname}."
            staff = matches[0]
            msg = f"Staff ID {staff.id}: {staff.first_name} {staff.last_name}\nRole: {staff.role.value}\nEmail: {staff.email}\nPhone: {staff.phone or 'N/A'}\nDepartment ID: {staff.department_id or 'N/A'}\nStatus: {staff.status.value}\nHourly Rate: {staff.hourly_rate or 'N/A'}\nMax Hours/Week: {staff.max_hours_per_week}\nSkills: {staff.skills or 'N/A'}\nCertifications: {staff.certifications or 'N/A'}"
            self._reset_session_state(session_id)
            return msg
        self._reset_session_state(session_id)
        return "Could not find the staff member."

    async def handle_update_staff(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        staff_service = StaffService(db)
        staff_fields = self._get_staff_fields()
        # Step 1: Ask for staff ID if not provided
        if "staff_id" not in fields:
            id_match = re.search(r"staff (\d+)", user_message.lower())
            if id_match:
                fields["staff_id"] = int(id_match.group(1))
            else:
                # If the user just enters a number, treat it as staff ID
                if user_message.strip().isdigit():
                    fields["staff_id"] = int(user_message.strip())
                else:
                    # Try to match by employee_id or name
                    input_val = user_message.strip()
                    # Try employee_id
                    staff_list = staff_service.get_staff_list()
                    match_by_empid = [s for s in staff_list if s.employee_id.lower() == input_val.lower()]
                    if len(match_by_empid) == 1:
                        fields["staff_id"] = match_by_empid[0].id
                    else:
                        # Try name (first, last, or both)
                        name_parts = input_val.split()
                        matches = []
                        if len(name_parts) == 2:
                            matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() and s.last_name.lower() == name_parts[1].lower()]
                        elif len(name_parts) == 1:
                            matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() or s.last_name.lower() == name_parts[0].lower()]
                        if len(matches) == 1:
                            fields["staff_id"] = matches[0].id
                        elif len(matches) > 1:
                            return "Multiple staff members found with that name. Please specify employee ID or full name."
                        else:
                            return "Please provide a valid staff ID, employee ID, or name to update."
        # Step 2: Fetch staff and ask which fields to update
        if "staff_obj" not in fields:
            staff = staff_service.get_staff_by_id(fields["staff_id"])
            if not staff:
                self._reset_session_state(session_id)
                return f"No staff found with ID {fields['staff_id']}."
            fields["staff_obj"] = staff
            state["update_fields"] = {}
            state["pending_update_field"] = None
            return "Which field would you like to update? (employee_id, first_name, last_name, email, role, phone, department_id, hourly_rate, max_hours_per_week, skills, certifications, status)"
        # Step 3: If waiting for a value for a field
        if state.get("awaiting_update_field"):
            field = state["awaiting_update_field"]
            value = user_message.strip()
            if value.lower() == "done":
                # Ask for confirmation
                summary = "You want to update the following fields:\n" + "\n".join([f"- {k}: {v}" for k, v in state["update_fields"].items()])
                state["awaiting_confirmation"] = True
                state.pop("awaiting_update_field")
                return summary + "\nShould I apply these updates? (yes/no)"
            if field == "role":
                value = value.lower()
            if field == "department_id" and value:
                try:
                    value = int(value)
                except Exception:
                    return "Please enter a valid department ID (number) or type 'done' if finished."
            if field == "hourly_rate" and value:
                try:
                    value = float(value)
                except Exception:
                    return "Please enter a valid hourly rate (number) or type 'done' if finished."
            if field == "max_hours_per_week" and value:
                try:
                    value = int(value)
                except Exception:
                    return "Please enter a valid number for max hours per week or type 'done' if finished."
            state["update_fields"][field] = value
            state["awaiting_update_field"] = None
            return "Enter the field name you want to update next, or type 'done' if finished."
        # Step 4: If not waiting for a value, expect a field name
        if state.get("awaiting_confirmation"):
            if user_message.strip().lower() in ["yes", "y"]:
                # Apply update
                from app.schemas.staff import StaffUpdate
                update_data = StaffUpdate(**state["update_fields"])
                staff = staff_service.update_staff(fields["staff_id"], update_data)
                self._reset_session_state(session_id)
                if staff:
                    return f"Staff member {staff.first_name} {staff.last_name} updated successfully!"
                else:
                    return "Failed to update staff."
            elif user_message.strip().lower() in ["no", "n"]:
                self._reset_session_state(session_id)
                return "Update cancelled."
            else:
                return "Please reply 'yes' to confirm or 'no' to cancel."
        # If not waiting for a value, expect a field name
        field_name = user_message.strip()
        if field_name.lower() == "done":
            if not state["update_fields"]:
                return "No fields selected for update. Enter a field name to update, or type 'done' to finish."
            summary = "You want to update the following fields:\n" + "\n".join([f"- {k}: {v}" for k, v in state["update_fields"].items()])
            state["awaiting_confirmation"] = True
            return summary + "\nShould I apply these updates? (yes/no)"
        valid_fields = [f[0] for f in staff_fields] + ["status"]
        if field_name in valid_fields:
            state["awaiting_update_field"] = field_name
            return f"What is the new value for {field_name}? (or type 'done' if finished)"
        return "Enter the field name you want to update, or type 'done' if finished."

    async def handle_delete_staff(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        staff_service = StaffService(db)
        # Step 1: Ask for staff ID if not provided
        if "staff_id" not in fields:
            id_match = re.search(r"staff (\d+)", user_message.lower())
            if id_match:
                fields["staff_id"] = int(id_match.group(1))
            else:
                # If the user just enters a number, treat it as staff ID
                if user_message.strip().isdigit():
                    fields["staff_id"] = int(user_message.strip())
                else:
                    # Try to match by employee_id or name
                    input_val = user_message.strip()
                    staff_list = staff_service.get_staff_list()
                    match_by_empid = [s for s in staff_list if s.employee_id.lower() == input_val.lower()]
                    if len(match_by_empid) == 1:
                        fields["staff_id"] = match_by_empid[0].id
                    else:
                        # Try name (first, last, or both)
                        name_parts = input_val.split()
                        matches = []
                        if len(name_parts) == 2:
                            matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() and s.last_name.lower() == name_parts[1].lower()]
                        elif len(name_parts) == 1:
                            matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() or s.last_name.lower() == name_parts[0].lower()]
                        if len(matches) == 1:
                            fields["staff_id"] = matches[0].id
                        elif len(matches) > 1:
                            return "Multiple staff members found with that name. Please specify employee ID or full name."
                        else:
                            return "Please provide a valid staff ID, employee ID, or name to delete."
        # Step 2: Confirm deletion
        if not state.get("awaiting_confirmation"):
            staff = staff_service.get_staff_by_id(fields["staff_id"])
            if not staff:
                self._reset_session_state(session_id)
                return f"No staff found with ID {fields['staff_id']}."
            state["awaiting_confirmation"] = True
            return f"Are you sure you want to delete staff member {staff.first_name} {staff.last_name} (ID {staff.id})? (yes/no)"
        # Step 3: Perform deletion
        if user_message.strip().lower() in ["yes", "y"]:
            success = staff_service.delete_staff(fields["staff_id"])
            self._reset_session_state(session_id)
            if success:
                return "Staff member deleted successfully."
            else:
                return "Failed to delete staff member."
        elif user_message.strip().lower() in ["no", "n"]:
            self._reset_session_state(session_id)
            return "Deletion cancelled."
        else:
            return "Please reply 'yes' to confirm or 'no' to cancel."

    async def handle_create_shift(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        shift_fields = self._get_shift_fields()
        # If awaiting confirmation
        if state["awaiting_confirmation"]:
            if user_message.strip().lower() in ["yes", "y"]:
                try:
                    # Convert start_time and end_time to datetime
                    from datetime import datetime
                    fields["start_time"] = datetime.strptime(fields["start_time"], "%Y-%m-%d %H:%M")
                    fields["end_time"] = datetime.strptime(fields["end_time"], "%Y-%m-%d %H:%M")
                    shift_data = ShiftCreate(**fields)
                    shift_service = ShiftService(db)
                    shift = shift_service.create_shift(shift_data)
                    self._reset_session_state(session_id)
                    return f"Shift '{shift.name}' added successfully!"
                except Exception as e:
                    self._reset_session_state(session_id)
                    return f"Failed to add shift: {str(e)}"
            elif user_message.strip().lower() in ["no", "n"]:
                self._reset_session_state(session_id)
                return "Shift creation cancelled."
            else:
                return "Please reply 'yes' to confirm or 'no' to cancel."
        # Slot filling: find next missing field
        for field, prompt, required in shift_fields:
            if field not in fields:
                if state.get("pending_field") == field:
                    value = user_message.strip()
                    if not value and not required:
                        fields[field] = None
                    elif value.lower() == "skip" and not required:
                        fields[field] = None
                    else:
                        if field in ["department_id"] and value:
                            try:
                                value = int(value)
                            except Exception:
                                return "Please enter a valid department ID (number) or type 'skip'."
                        fields[field] = value
                    state["pending_field"] = None
                else:
                    state["pending_field"] = field
                    return prompt
        # All fields collected, ask for confirmation
        summary = "Here is the information you provided:\n" + "\n".join([f"- {k.replace('_', ' ').title()}: {v}" for k, v in fields.items()])
        state["awaiting_confirmation"] = True
        return summary + "\nShould I add this shift? (yes/no)"

    async def handle_read_shift(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        shift_service = ShiftService(db)
        # If no identifier yet, ask for it
        if "identifier" not in fields:
            id_match = re.search(r"shift (\d+)", user_message.lower())
            if id_match:
                fields["identifier"] = int(id_match.group(1))
            else:
                # Try to extract name
                name_match = re.search(r"shift ([a-zA-Z0-9_\- ]+)", user_message.lower())
                if name_match:
                    fields["identifier"] = name_match.group(1).strip()
            if "identifier" not in fields:
                return "Please provide the shift ID or name to view, or type 'list' to see all shifts."
        # Handle 'list' case
        if fields["identifier"] == "list":
            shift_list = shift_service.get_shift_list(limit=10)
            if not shift_list:
                self._reset_session_state(session_id)
                return "No shifts found."
            msg = "Here are some shifts:\n" + "\n".join([f"- {s.id}: {s.name} ({s.shift_type}) {s.start_time} - {s.end_time}" for s in shift_list])
            self._reset_session_state(session_id)
            return msg
        # If identifier is int, treat as ID
        if isinstance(fields["identifier"], int):
            shift = shift_service.get_shift_by_id(fields["identifier"])
            if not shift:
                self._reset_session_state(session_id)
                return f"No shift found with ID {fields['identifier']}."
            msg = f"Shift ID {shift.id}: {shift.name}\nType: {shift.shift_type}\nDepartment ID: {shift.department_id}\nStart: {shift.start_time}\nEnd: {shift.end_time}\nStatus: {shift.status or 'N/A'}"
            self._reset_session_state(session_id)
            return msg
        # If identifier is str, treat as name
        if isinstance(fields["identifier"], str):
            shift_list = shift_service.get_shift_list()
            matches = [s for s in shift_list if s.name.lower() == fields["identifier"].lower()]
            if not matches:
                self._reset_session_state(session_id)
                return f"No shift found with name {fields['identifier']}."
            shift = matches[0]
            msg = f"Shift ID {shift.id}: {shift.name}\nType: {shift.shift_type}\nDepartment ID: {shift.department_id}\nStart: {shift.start_time}\nEnd: {shift.end_time}\nStatus: {shift.status or 'N/A'}"
            self._reset_session_state(session_id)
            return msg
        self._reset_session_state(session_id)
        return "Could not find the shift."

    async def handle_update_shift(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        shift_service = ShiftService(db)
        shift_fields = self._get_shift_fields()
        # Step 1: Ask for shift ID if not provided
        if "shift_id" not in fields:
            id_match = re.search(r"shift (\d+)", user_message.lower())
            if id_match:
                fields["shift_id"] = int(id_match.group(1))
            else:
                # If the user just enters a number, treat it as shift ID
                if user_message.strip().isdigit():
                    fields["shift_id"] = int(user_message.strip())
                else:
                    # Try to match by name
                    input_val = user_message.strip()
                    shift_list = shift_service.get_shift_list()
                    matches = [s for s in shift_list if s.name.lower() == input_val.lower()]
                    if len(matches) == 1:
                        fields["shift_id"] = matches[0].id
                    elif len(matches) > 1:
                        return "Multiple shifts found with that name. Please specify shift ID."
                    else:
                        return "Please provide a valid shift ID or name to update."
        # Step 2: Fetch shift and ask which fields to update
        if "shift_obj" not in fields:
            shift = shift_service.get_shift_by_id(fields["shift_id"])
            if not shift:
                self._reset_session_state(session_id)
                return f"No shift found with ID {fields['shift_id']}."
            fields["shift_obj"] = shift
            state["update_fields"] = {}
            state["awaiting_update_field"] = None
            return "Which field would you like to update? (name, shift_type, department_id, start_time, end_time, status)"
        # Step 3: If waiting for a value for a field
        if state.get("awaiting_update_field"):
            field = state["awaiting_update_field"]
            value = user_message.strip()
            if value.lower() == "done":
                if not state["update_fields"]:
                    return "No fields selected for update. Enter a field name to update, or type 'done' to finish."
                summary = "You want to update the following fields:\n" + "\n".join([f"- {k}: {v}" for k, v in state["update_fields"].items()])
                state["awaiting_confirmation"] = True
                state["awaiting_update_field"] = None
                return summary + "\nShould I apply these updates? (yes/no)"
            if field in ["department_id"] and value:
                try:
                    value = int(value)
                except Exception:
                    return "Please enter a valid department ID (number) or type 'done' if finished."
            if field in ["start_time", "end_time"] and value:
                from datetime import datetime
                try:
                    value = datetime.strptime(value, "%Y-%m-%d %H:%M")
                except Exception:
                    return f"Please enter a valid datetime for {field} (YYYY-MM-DD HH:MM) or type 'done' if finished."
            state["update_fields"][field] = value
            state["awaiting_update_field"] = None
            return "Enter the field name you want to update next, or type 'done' if finished."
        # Step 4: If not waiting for a value, expect a field name
        if state.get("awaiting_confirmation"):
            if user_message.strip().lower() in ["yes", "y"]:
                update_data = ShiftUpdate(**state["update_fields"])
                shift = shift_service.update_shift(fields["shift_id"], update_data)
                self._reset_session_state(session_id)
                if shift:
                    return f"Shift '{shift.name}' updated successfully!"
                else:
                    return "Failed to update shift."
            elif user_message.strip().lower() in ["no", "n"]:
                self._reset_session_state(session_id)
                return "Update cancelled."
            else:
                return "Please reply 'yes' to confirm or 'no' to cancel."
        field_name = user_message.strip()
        valid_fields = [f[0] for f in shift_fields] + ["status"]
        if field_name.lower() == "done":
            if not state["update_fields"]:
                return "No fields selected for update. Enter a field name to update, or type 'done' to finish."
            summary = "You want to update the following fields:\n" + "\n".join([f"- {k}: {v}" for k, v in state["update_fields"].items()])
            state["awaiting_confirmation"] = True
            return summary + "\nShould I apply these updates? (yes/no)"
        if field_name in valid_fields:
            state["awaiting_update_field"] = field_name
            return f"What is the new value for {field_name}? (or type 'done' if finished)"
        return "Enter the field name you want to update, or type 'done' if finished."

    async def handle_delete_shift(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        shift_service = ShiftService(db)
        # Step 1: Ask for shift ID if not provided
        if "shift_id" not in fields:
            id_match = re.search(r"shift (\d+)", user_message.lower())
            if id_match:
                fields["shift_id"] = int(id_match.group(1))
            else:
                # If the user just enters a number, treat it as shift ID
                if user_message.strip().isdigit():
                    fields["shift_id"] = int(user_message.strip())
                else:
                    # Try to match by name
                    input_val = user_message.strip()
                    shift_list = shift_service.get_shift_list()
                    matches = [s for s in shift_list if s.name.lower() == input_val.lower()]
                    if len(matches) == 1:
                        fields["shift_id"] = matches[0].id
                    elif len(matches) > 1:
                        return "Multiple shifts found with that name. Please specify shift ID."
                    else:
                        return "Please provide a valid shift ID or name to delete."
        # Step 2: Confirm deletion
        if not state.get("awaiting_confirmation"):
            shift = shift_service.get_shift_by_id(fields["shift_id"])
            if not shift:
                self._reset_session_state(session_id)
                return f"No shift found with ID {fields['shift_id']}."
            state["awaiting_confirmation"] = True
            return f"Are you sure you want to delete shift '{shift.name}' (ID {shift.id})? (yes/no)"
        # Step 3: Perform deletion
        if user_message.strip().lower() in ["yes", "y"]:
            success = shift_service.delete_shift(fields["shift_id"])
            self._reset_session_state(session_id)
            if success:
                return "Shift deleted successfully."
            else:
                return "Failed to delete shift."
        elif user_message.strip().lower() in ["no", "n"]:
            self._reset_session_state(session_id)
            return "Deletion cancelled."
        else:
            return "Please reply 'yes' to confirm or 'no' to cancel."

    async def handle_assign_staff_to_shift(self, user_message: str, db: Session, session_id: str = "default") -> str:
        state = self._get_session_state(session_id)
        fields = state["fields"]
        staff_service = StaffService(db)
        shift_service = ShiftService(db)
        # Step 1: Ask for staff
        if "staff_id" not in fields:
            # Try to extract staff by ID, employee_id, or name
            input_val = user_message.strip()
            if input_val.isdigit():
                staff = staff_service.get_staff_by_id(int(input_val))
                if staff:
                    fields["staff_id"] = staff.id
                else:
                    return "No staff found with that ID. Please provide a valid staff ID, employee ID, or name."
            else:
                staff_list = staff_service.get_staff_list()
                match_by_empid = [s for s in staff_list if s.employee_id.lower() == input_val.lower()]
                if len(match_by_empid) == 1:
                    fields["staff_id"] = match_by_empid[0].id
                else:
                    name_parts = input_val.split()
                    matches = []
                    if len(name_parts) == 2:
                        matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() and s.last_name.lower() == name_parts[1].lower()]
                    elif len(name_parts) == 1:
                        matches = [s for s in staff_list if s.first_name.lower() == name_parts[0].lower() or s.last_name.lower() == name_parts[0].lower()]
                    if len(matches) == 1:
                        fields["staff_id"] = matches[0].id
                    elif len(matches) > 1:
                        return "Multiple staff members found with that name. Please specify employee ID or full name."
                    else:
                        return "Please provide a valid staff ID, employee ID, or name to assign."
            if "staff_id" not in fields:
                return "Please provide the staff member to assign (ID, employee ID, or name)."
        # Step 2: Ask for shift
        if "shift_id" not in fields:
            input_val = user_message.strip() if "asked_shift" in fields else None
            if not input_val:
                fields["asked_shift"] = True
                return "Please provide the shift to assign to (ID or name)."
            # Try to extract shift by ID or name
            if input_val.isdigit():
                shift = shift_service.get_shift_by_id(int(input_val))
                if shift:
                    fields["shift_id"] = shift.id
                else:
                    return "No shift found with that ID. Please provide a valid shift ID or name."
            else:
                shift_list = shift_service.get_shift_list()
                matches = [s for s in shift_list if s.name.lower() == input_val.lower()]
                if len(matches) == 1:
                    fields["shift_id"] = matches[0].id
                elif len(matches) > 1:
                    return "Multiple shifts found with that name. Please specify shift ID."
                else:
                    return "Please provide a valid shift ID or name."
            if "shift_id" not in fields:
                return "Please provide the shift to assign to (ID or name)."
        # Step 3: Confirm assignment
        if not state.get("awaiting_confirmation"):
            staff = staff_service.get_staff_by_id(fields["staff_id"])
            shift = shift_service.get_shift_by_id(fields["shift_id"])
            state["awaiting_confirmation"] = True
            return f"Assign staff {staff.first_name} {staff.last_name} (ID {staff.id}) to shift '{shift.name}' (ID {shift.id})? (yes/no)"
        # Step 4: Perform assignment
        if user_message.strip().lower() in ["yes", "y"]:
            try:
                assignment = shift_service.assign_staff_to_shift(fields["shift_id"], fields["staff_id"], assigned_by="chatbot")
                staff = staff_service.get_staff_by_id(fields["staff_id"])
                shift = shift_service.get_shift_by_id(fields["shift_id"])
                # Send email notification
                subject = "Shift Assignment Notification"
                body = f"Dear {staff.first_name} {staff.last_name},\n\nYou have been assigned to the shift '{shift.name}' (Type: {shift.shift_type}, Start: {shift.start_time}, End: {shift.end_time}).\n\nPlease check your schedule for more details.\n\nBest regards,\nHospital Staff Management System"
                send_email(staff.email, subject, body)
                self._reset_session_state(session_id)
                return "Staff assigned to shift successfully."
            except Exception as e:
                self._reset_session_state(session_id)
                return f"Failed to assign staff to shift: {str(e)}"
        elif user_message.strip().lower() in ["no", "n"]:
            self._reset_session_state(session_id)
            return "Assignment cancelled."
        else:
            return "Please reply 'yes' to confirm or 'no' to cancel."

    async def _get_database_context(self, db: Session, query: str) -> str:
        """Extract relevant context from the database based on user query"""
        context = []
        query_lower = query.lower()
        
        # Check for specific staff member by name
        staff_name_search = False
        for term in ['staff', 'employee', 'doctor', 'nurse', 'worker', 'who is', 'show me']:
            if term in query_lower:
                staff_name_search = True
                break
                
        if staff_name_search:
            # Try to find specific staff member by name
            search_terms = [term for term in query_lower.split() if term not in ['the', 'a', 'an', 'is', 'are', 'who', 'what', 'when', 'where', 'show', 'me', 'list', 'all']]
            
            if search_terms:
                # Search for staff members matching any part of the name
                for term in search_terms:
                    if len(term) > 2:  # Only search for terms longer than 2 characters
                        staff_members = db.query(Staff).filter(
                            (Staff.first_name.ilike(f'%{term}%')) | 
                            (Staff.last_name.ilike(f'%{term}%')) |
                            ((Staff.first_name + ' ' + Staff.last_name).ilike(f'%{term}%'))
                        ).limit(5).all()
                        
                        if staff_members:
                            context.append("\nStaff Information:")
                            for staff in staff_members:
                                dept_name = staff.department.name if staff.department and hasattr(staff.department, 'name') else 'N/A'
                                role = staff.role.value if hasattr(staff.role, 'value') else staff.role
                                context.append(f"- {staff.first_name} {staff.last_name} (Employee ID: {staff.employee_id}), "
                                            f"Role: {role}, Department: {dept_name}, "
                                            f"Status: {staff.status.value if hasattr(staff.status, 'value') else staff.status}")
                            break  # Stop after first successful search
        
        # If no specific staff member was found, show general staff information
        if not context and any(term in query_lower for term in ['staff', 'employees', 'doctors', 'nurses']):
            staff_members = db.query(Staff).limit(5).all()
            if staff_members:
                context.append("\nStaff Information (showing up to 5 records):")
                for staff in staff_members:
                    dept_name = staff.department.name if staff.department and hasattr(staff.department, 'name') else 'N/A'
                    role = staff.role.value if hasattr(staff.role, 'value') else staff.role
                    context.append(f"- {staff.first_name} {staff.last_name} (ID: {staff.employee_id}), "
                                 f"Role: {role}, Department: {dept_name}")
        
        # Check for department-related queries
        if any(term in query_lower for term in ['department', 'dept', 'team']):
            departments = db.query(Department).all()
            if departments:
                context.append("\nDepartments:")
                for dept in departments:
                    context.append(f"- {dept.name}: {dept.description or 'No description'}")
        
        # Check for shift-related queries
        shift_related_terms = ['shift', 'schedule', 'roster', 'when is', 'who is working', 'who is scheduled']
        if any(term in query_lower for term in shift_related_terms):
            # Check for specific shift queries
            if 'today' in query_lower or 'tonight' in query_lower or 'tomorrow' in query_lower:
                from datetime import datetime, timedelta
                now = datetime.now()
                
                if 'today' in query_lower:
                    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
                    end_of_day = start_of_day + timedelta(days=1)
                    time_filter = "today"
                elif 'tonight' in query_lower:
                    start_of_day = now.replace(hour=18, minute=0, second=0, microsecond=0)  # Evening
                    end_of_day = start_of_day + timedelta(hours=12)  # Until early morning
                    time_filter = "tonight"
                else:  # tomorrow
                    start_of_day = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
                    end_of_day = start_of_day + timedelta(days=1)
                    time_filter = "tomorrow"
                
                shifts = db.query(Shift).filter(
                    Shift.start_time >= start_of_day,
                    Shift.start_time < end_of_day
                ).all()
                
                if shifts:
                    context.append(f"\nShifts scheduled for {time_filter} (Total: {len(shifts)}):")
                    for shift in shifts:
                        assigned_staff = [f"{a.staff.first_name} {a.staff.last_name}" for a in shift.assignments]
                        context.append(
                            f"- {shift.name} ({shift.shift_type.value.title()}): "
                            f"{shift.start_time.strftime('%I:%M %p')} to {shift.end_time.strftime('%I:%M %p')}, "
                            f"Department: {shift.department.name if shift.department else 'N/A'}, "
                            f"Assigned: {', '.join(assigned_staff) if assigned_staff else 'No one assigned'}"
                        )
                else:
                    context.append(f"\nNo shifts found for {time_filter}.")
            
            # General shift information
            elif any(term in query_lower for term in ['shift', 'shifts', 'schedule', 'roster']):
                # Check for department-specific shifts
                department_shift = None
                for dept in db.query(Department).all():
                    if dept.name.lower() in query_lower:
                        department_shift = dept
                        break
                
                if department_shift:
                    shifts = db.query(Shift).filter(
                        Shift.department_id == department_shift.id
                    ).order_by(Shift.start_time.desc()).limit(5).all()
                    
                    if shifts:
                        context.append(f"\nRecent shifts for {department_shift.name} department (showing up to 5):")
                        for shift in shifts:
                            context.append(
                                f"- {shift.name} ({shift.shift_type.value.title()}): "
                                f"{shift.start_time.strftime('%Y-%m-%d %I:%M %p')} to {shift.end_time.strftime('%I:%M %p')}, "
                                f"Status: {shift.status.value}"
                            )
                    else:
                        context.append(f"\nNo shifts found for the {department_shift.name} department.")
                else:
                    # Show upcoming shifts
                    upcoming_shifts = db.query(Shift).filter(
                        Shift.start_time >= datetime.now()
                    ).order_by(Shift.start_time).limit(5).all()
                    
                    if upcoming_shifts:
                        context.append("\nUpcoming shifts (next 5):")
                        for shift in upcoming_shifts:
                            dept_name = shift.department.name if shift.department else 'No department'
                            context.append(
                                f"- {shift.name} ({shift.shift_type.value.title()}): "
                                f"{shift.start_time.strftime('%a, %b %d, %I:%M %p')} to {shift.end_time.strftime('%I:%M %p')}, "
                                f"Dept: {dept_name}"
                            )
                    else:
                        context.append("\nNo upcoming shifts found.")
            
            # Check for staff-specific shift assignments
            elif 'my shift' in query_lower or 'my schedule' in query_lower:
                # This would need authentication to know which staff member is asking
                context.append("\nTo view your personal schedule, please log in to the staff portal.")
                
                # As an example, we'll show how to get shifts for a specific staff member
                example_staff = db.query(Staff).first()
                if example_staff:
                    staff_shifts = db.query(Shift).join(Shift.assignments).filter(
                        ShiftAssignment.staff_id == example_staff.id,
                        Shift.start_time >= datetime.now()
                    ).order_by(Shift.start_time).limit(3).all()
                    
                    if staff_shifts:
                        context.append(f"\nExample (showing next 3 shifts for {example_staff.first_name} {example_staff.last_name}):")
                        for shift in staff_shifts:
                            context.append(
                                f"- {shift.name} on {shift.start_time.strftime('%A, %b %d')}: "
                                f"{shift.start_time.strftime('%I:%M %p')} to {shift.end_time.strftime('%I:%M %p')}, "
                                f"Dept: {shift.department.name if shift.department else 'N/A'}"
                            )
        
        return "\n".join(context) if context else "No relevant database information found for this query."

    async def get_chat_response(self, messages: list[Dict[str, str]], db: Optional[Session] = None) -> str:
        """
        Get response from GROQ API with database context
        
        Args:
            messages: List of message dictionaries with 'role' and 'content' keys
            db: Optional database session for fetching context
            
        Returns:
            str: Generated response from the chatbot
        """
        if not self.api_key:
            raise HTTPException(
                status_code=500,
                detail="GROQ API key not configured"
            )

        # Use 'default' as session_id for now
        session_id = "default"
        user_message = next((msg for msg in reversed(messages) if msg['role'] == 'user'), None)
        if not user_message:
            return "How can I help you today?"
        user_text = user_message['content']
        state = self._get_session_state(session_id)

        # If in the middle of a CRUD flow
        if state["intent"] == "create" and state["entity"] == "staff":
            return await self.handle_create_staff(user_text, db, session_id)
        if state["intent"] == "read" and state["entity"] == "staff":
            return await self.handle_read_staff(user_text, db, session_id)
        if state["intent"] == "update" and state["entity"] == "staff":
            return await self.handle_update_staff(user_text, db, session_id)
        if state["intent"] == "delete" and state["entity"] == "staff":
            return await self.handle_delete_staff(user_text, db, session_id)
        if state["intent"] == "create" and state["entity"] == "shift":
            return await self.handle_create_shift(user_text, db, session_id)
        if state["intent"] == "read" and state["entity"] == "shift":
            return await self.handle_read_shift(user_text, db, session_id)
        if state["intent"] == "update" and state["entity"] == "shift":
            return await self.handle_update_shift(user_text, db, session_id)
        if state["intent"] == "delete" and state["entity"] == "shift":
            return await self.handle_delete_shift(user_text, db, session_id)
        if state["intent"] == "assign" and state["entity"] == "staff_shift":
            return await self.handle_assign_staff_to_shift(user_text, db, session_id)

        # Detect new intent
        intent, entity = self._detect_intent(user_text)
        if intent == "create" and entity == "staff":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            state["pending_field"] = None
            state["awaiting_confirmation"] = False
            return await self.handle_create_staff("", db, session_id)
        if intent == "read" and entity == "staff":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_read_staff(user_text, db, session_id)
        if intent == "update" and entity == "staff":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_update_staff(user_text, db, session_id)
        if intent == "delete" and entity == "staff":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_delete_staff(user_text, db, session_id)
        if intent == "create" and entity == "shift":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            state["pending_field"] = None
            state["awaiting_confirmation"] = False
            return await self.handle_create_shift("", db, session_id)
        if intent == "read" and entity == "shift":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_read_shift(user_text, db, session_id)
        if intent == "update" and entity == "shift":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_update_shift(user_text, db, session_id)
        if intent == "delete" and entity == "shift":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_delete_shift(user_text, db, session_id)
        if intent == "assign" and entity == "staff_shift":
            state["intent"] = intent
            state["entity"] = entity
            state["fields"] = {}
            return await self.handle_assign_staff_to_shift("", db, session_id)

        # Initialize context
        db_context = ""
        
        # If we have a database and a user message, get relevant context
        if db and user_message:
            db_context = await self._get_database_context(db, user_message['content'])
        
        # Prepare the messages with system prompt and context
        enhanced_messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        if db_context:
            enhanced_messages.append({
                "role": "system",
                "content": f"Here is some relevant information from the database:\n{db_context}"
            })
        
        # Add the conversation history
        enhanced_messages.extend(messages)

        payload = {
            "model": "llama3-8b-8192",
            "messages": enhanced_messages,
            "temperature": 0.7,
            "max_tokens": 1024
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Error from GROQ API: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing request: {str(e)}"
            )

# Create a singleton instance
chatbot_service = ChatbotService()
