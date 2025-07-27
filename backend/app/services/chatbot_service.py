import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Staff, Department, Shift, StaffAvailability, ShiftAssignment

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

        # Get the last user message
        user_message = next((msg for msg in reversed(messages) if msg['role'] == 'user'), None)
        
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
