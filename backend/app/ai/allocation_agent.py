from app.ai.base_agent import BaseAgent
from typing import Dict, Any, List
from langchain_core.messages import HumanMessage, SystemMessage
import json
from datetime import datetime, timedelta

class AllocationAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        
    def get_system_prompt(self) -> str:
        return """
        You are an expert hospital staff allocation AI agent. Your role is to optimize staff assignments to shifts based on:
        
        1. Staff availability and preferences
        2. Required skills and certifications
        3. Labor regulations and hospital policies
        4. Historical performance and reliability
        5. Workload balancing and fairness
        6. Emergency coverage requirements
        
        Always consider:
        - Maximum working hours per week/day
        - Minimum rest periods between shifts
        - Staff expertise matching shift requirements
        - Fair distribution of desirable/undesirable shifts
        - Cost optimization while maintaining quality care
        
        Respond with structured JSON containing allocation recommendations with reasoning.
        """
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process staff allocation request
        
        Input format:
        {
            "shifts": [list of shifts needing staff],
            "available_staff": [list of available staff],
            "constraints": {constraints and preferences},
            "current_allocations": [existing allocations to consider]
        }
        """
        
        shifts = input_data.get("shifts", [])
        staff = input_data.get("available_staff", [])
        constraints = input_data.get("constraints", {})
        current_allocations = input_data.get("current_allocations", [])
        
        # Prepare the allocation request
        allocation_request = self._prepare_allocation_request(shifts, staff, constraints, current_allocations)
        
        messages = [
            SystemMessage(content=self.get_system_prompt()),
            HumanMessage(content=f"""
            Please analyze and provide optimal staff allocation for the following scenario:
            
            {allocation_request}
            
            Provide your response in this JSON format:
            {{
                "allocations": [
                    {{
                        "shift_id": "shift_id",
                        "staff_assignments": [
                            {{
                                "staff_id": "staff_id",
                                "confidence_score": 0.95,
                                "reasoning": "explanation for assignment"
                            }}
                        ],
                        "backup_options": [alternative staff if needed]
                    }}
                ],
                "unassigned_shifts": [shifts that couldn't be filled],
                "recommendations": [suggestions for improving allocation],
                "risk_factors": [potential issues to monitor],
                "optimization_score": 0.85
            }}
            """)
        ]
        
        response = await self.call_llm(messages)
        
        def extract_json_from_markdown(text):
            """Extract JSON content from markdown code blocks"""
            import re
            # Try to find JSON in markdown code blocks
            json_match = re.search(r'```(?:json)?\s*({[\s\S]*?})\s*```', text)
            if json_match:
                return json_match.group(1)
            return text.strip()
            
        try:
            # First try to extract JSON from markdown
            json_content = extract_json_from_markdown(response)
            result = json.loads(json_content)
            return result
        except json.JSONDecodeError as e:
            # If direct parsing fails, try to clean the response
            try:
                # Remove any non-JSON content before the first {
                cleaned = response[response.find('{'):response.rfind('}')+1]
                result = json.loads(cleaned)
                return result
            except:
                return {
                    "error": "Failed to parse AI response",
                    "raw_response": response,
                    "allocations": [],
                    "optimization_score": 0.0
                }
    
    def _prepare_allocation_request(self, shifts, staff, constraints, current_allocations):
        """Prepare a structured request for the LLM"""
        request = {
            "shifts_to_fill": [],
            "available_staff": [],
            "constraints": constraints,
            "current_workload": {}
        }
        
        # Process shifts
        for shift in shifts:
            shift_info = {
                "id": shift.get("id"),
                "department": shift.get("department"),
                "start_time": shift.get("start_time"),
                "end_time": shift.get("end_time"),
                "required_staff_count": shift.get("required_staff_count", 1),
                "required_skills": shift.get("required_skills", []),
                "priority_level": shift.get("priority_level", 1),
                "shift_type": shift.get("shift_type")
            }
            request["shifts_to_fill"].append(shift_info)
        
        # Process staff
        for staff_member in staff:
            staff_info = {
                "id": staff_member.get("id"),
                "name": f"{staff_member.get('first_name')} {staff_member.get('last_name')}",
                "role": staff_member.get("role"),
                "skills": staff_member.get("skills", []),
                "certifications": staff_member.get("certifications", []),
                "max_hours_per_week": staff_member.get("max_hours_per_week", 40),
                "hourly_rate": staff_member.get("hourly_rate"),
                "availability": staff_member.get("availability", []),
                "current_hours_this_week": staff_member.get("current_hours_this_week", 0)
            }
            request["available_staff"].append(staff_info)
        
        return json.dumps(request, indent=2, default=str)

class ConstraintAgent(BaseAgent):
    """Agent responsible for validating scheduling constraints"""
    
    def get_system_prompt(self) -> str:
        return """
        You are a hospital scheduling constraint validation agent. Your role is to ensure all staff allocations comply with:
        
        1. Labor laws and regulations
        2. Hospital policies
        3. Union agreements
        4. Safety requirements
        5. Professional licensing requirements
        
        Validate each allocation against these constraints and flag violations.
        """
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        allocations = input_data.get("allocations", [])
        staff_data = input_data.get("staff_data", {})
        policies = input_data.get("policies", {})
        
        messages = [
            SystemMessage(content=self.get_system_prompt()),
            HumanMessage(content=f"""
            Please validate the following staff allocations against hospital policies and regulations:
            
            Allocations: {json.dumps(allocations, indent=2, default=str)}
            Staff Data: {json.dumps(staff_data, indent=2, default=str)}
            Policies: {json.dumps(policies, indent=2, default=str)}
            
            Return validation results in JSON format:
            {{
                "is_valid": true/false,
                "violations": [
                    {{
                        "type": "violation_type",
                        "severity": "high/medium/low",
                        "description": "detailed description",
                        "affected_staff": ["staff_ids"],
                        "suggested_fix": "recommendation"
                    }}
                ],
                "warnings": [list of warnings],
                "compliance_score": 0.95
            }}
            """)
        ]
        
        response = await self.call_llm(messages)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "is_valid": False,
                "violations": [{"type": "system_error", "description": "Failed to validate constraints"}],
                "warnings": [],
                "compliance_score": 0.0
            }

class OptimizationAgent(BaseAgent):
    """Agent responsible for optimizing staff allocations for efficiency and satisfaction"""
    
    def get_system_prompt(self) -> str:
        return """
        You are a hospital staff allocation optimization agent. Your goal is to improve existing allocations by:
        
        1. Minimizing labor costs while maintaining quality
        2. Balancing workload fairly among staff
        3. Maximizing staff satisfaction and preferences
        4. Ensuring adequate coverage for all shifts
        5. Reducing overtime and fatigue
        6. Optimizing skill utilization
        
        Analyze current allocations and suggest improvements.
        """
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        current_allocation = input_data.get("current_allocation", {})
        performance_metrics = input_data.get("performance_metrics", {})
        staff_feedback = input_data.get("staff_feedback", {})
        
        messages = [
            SystemMessage(content=self.get_system_prompt()),
            HumanMessage(content=f"""
            Analyze and optimize the following staff allocation:
            
            Current Allocation: {json.dumps(current_allocation, indent=2, default=str)}
            Performance Metrics: {json.dumps(performance_metrics, indent=2, default=str)}
            Staff Feedback: {json.dumps(staff_feedback, indent=2, default=str)}
            
            Provide optimization recommendations in JSON format:
            {{
                "optimized_allocation": {{
                    "changes": [list of suggested changes],
                    "expected_improvements": {{
                        "cost_savings": "percentage",
                        "satisfaction_increase": "percentage",
                        "efficiency_gain": "percentage"
                    }}
                }},
                "optimization_strategies": [list of strategies used],
                "implementation_priority": [ordered list of changes by priority],
                "risk_assessment": {{
                    "risks": [potential risks],
                    "mitigation_strategies": [how to address risks]
                }}
            }}
            """)
        ]
        
        response = await self.call_llm(messages)
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "optimized_allocation": {"changes": []},
                "optimization_strategies": [],
                "implementation_priority": [],
                "risk_assessment": {"risks": [], "mitigation_strategies": []}
            }