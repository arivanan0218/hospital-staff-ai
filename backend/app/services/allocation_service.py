from app.ai.allocation_agent import AllocationAgent, ConstraintAgent, OptimizationAgent
from app.services.staff_service import StaffService
from app.services.shift_service import ShiftService
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime, timedelta
import asyncio

class AllocationService:
    def __init__(self, db: Session):
        self.db = db
        self.staff_service = StaffService(db)
        self.shift_service = ShiftService(db)
        self.allocation_agent = AllocationAgent()
        self.constraint_agent = ConstraintAgent()
        self.optimization_agent = OptimizationAgent()
    
    async def create_optimal_allocation(
        self, 
        shift_ids: List[int], 
        date_range: tuple = None,
        constraints: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Create optimal staff allocation for given shifts
        
        Args:
            shift_ids: List of shift IDs to allocate
            date_range: Optional tuple of (start_date, end_date)
            constraints: Dictionary of allocation constraints
            
        Returns:
            Dict with allocation results and metadata
        """
        if not shift_ids:
            raise ValueError("No shift IDs provided")
            
        if not isinstance(shift_ids, list):
            raise ValueError("shift_ids must be a list")
            
        # Get shift data
        try:
            shifts = await self._get_shifts_data(shift_ids, date_range)
            if not shifts:
                raise ValueError("No valid shifts found for the given IDs")
                
            # Log shift data for debugging
            print(f"Processing {len(shifts)} shifts for allocation")
            
            # Get available staff
            available_staff = await self._get_available_staff_data(shifts)
            if not available_staff:
                raise ValueError("No available staff found for the given shifts")
                
            print(f"Found {len(available_staff)} available staff members")
            
            # Get current allocations for context
            current_allocations = await self._get_current_allocations(shifts)
            
            # Prepare input for allocation agent
            allocation_input = {
                "shifts": shifts,
                "available_staff": available_staff,
                "constraints": constraints or {},
                "current_allocations": current_allocations,
                "metadata": {
                    "shift_count": len(shifts),
                    "staff_count": len(available_staff),
                    "processing_start": datetime.now().isoformat()
                }
            }
            
            # Log the input for debugging
            print(f"Allocation input prepared with {len(shifts)} shifts and {len(available_staff)} staff")
            
        except Exception as e:
            error_msg = f"Error preparing allocation data: {str(e)}"
            print(error_msg)
            raise ValueError(error_msg) from e
        
        # Step 1: Generate initial allocation
        print("🤖 Generating initial allocation...")
        initial_allocation = await self.allocation_agent.process(allocation_input)
        
        # Step 2: Validate constraints
        print("✅ Validating constraints...")
        constraint_validation = await self.constraint_agent.process({
            "allocations": initial_allocation.get("allocations", []),
            "staff_data": available_staff,
            "policies": constraints or {}
        })
        
        # Step 3: Optimize if valid, or fix violations
        if constraint_validation.get("is_valid", False):
            print("🚀 Optimizing allocation...")
            optimization_result = await self.optimization_agent.process({
                "current_allocation": initial_allocation,
                "performance_metrics": {},  # TODO: Add historical performance data
                "staff_feedback": {}  # TODO: Add staff preference data
            })
            
            final_allocation = optimization_result
        else:
            print("⚠️ Constraint violations found, attempting to fix...")
            # TODO: Implement constraint violation fixing logic
            final_allocation = initial_allocation
            final_allocation["constraint_violations"] = constraint_validation.get("violations", [])
        
        # Prepare final result
        result = {
            "allocation_id": f"alloc_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "generated_at": datetime.now().isoformat(),
            "shifts_processed": len(shifts),
            "staff_considered": len(available_staff),
            "allocation_results": final_allocation,
            "constraint_validation": constraint_validation,
            "success": constraint_validation.get("is_valid", False),
            "confidence_score": final_allocation.get("optimization_score", 0.0)
        }
        
        # Save allocation to database
        await self._save_allocation_result(result)
        
        return result
    
    async def _get_shifts_data(self, shift_ids: List[int], date_range: tuple = None) -> List[Dict]:
        """Get detailed shift data"""
        shifts = []
        for shift_id in shift_ids:
            shift = self.shift_service.get_shift_by_id(shift_id)
            if shift:
                shifts.append({
                    "id": shift.id,
                    "name": shift.name,
                    "department": shift.department.name if shift.department else "Unknown",
                    "start_time": shift.start_time.isoformat(),
                    "end_time": shift.end_time.isoformat(),
                    "required_staff_count": shift.required_staff_count,
                    "required_skills": shift.required_skills or "[]",
                    "priority_level": shift.priority_level,
                    "shift_type": shift.shift_type.value if shift.shift_type else "unknown"
                })
        return shifts
    
    async def _get_available_staff_data(self, shifts: List[Dict]) -> List[Dict]:
        """Get available staff for the shifts timeframe"""
        staff_list = self.staff_service.get_staff_list(limit=1000)  # Get all active staff
        
        available_staff = []
        for staff in staff_list:
            staff_data = {
                "id": staff.id,
                "employee_id": staff.employee_id,
                "first_name": staff.first_name,
                "last_name": staff.last_name,
                "role": staff.role.value,
                "skills": staff.skills or "[]",
                "certifications": staff.certifications or "[]",
                "max_hours_per_week": staff.max_hours_per_week,
                "hourly_rate": staff.hourly_rate,
                "current_hours_this_week": 0,  # TODO: Calculate from existing allocations
                "availability": []  # TODO: Get from availability table
            }
            available_staff.append(staff_data)
        
        return available_staff
    
    async def _get_current_allocations(self, shifts: List[Dict]) -> List[Dict]:
        """Get existing allocations that might conflict"""
        # TODO: Implement logic to get current allocations
        return []
    
    async def _save_allocation_result(self, result: Dict[str, Any]):
        """Save allocation result to database for tracking"""
        # TODO: Implement allocation result storage
        pass
    
    async def get_allocation_analytics(self, days_back: int = 30) -> Dict[str, Any]:
        """Get analytics on allocation performance"""
        # TODO: Implement analytics calculation
        return {
            "total_allocations": 0,
            "success_rate": 0.0,
            "average_satisfaction": 0.0,
            "cost_efficiency": 0.0,
            "constraint_compliance": 0.0
        }
    
    async def simulate_allocation_scenarios(
        self, 
        shift_ids: List[int], 
        scenarios: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Run multiple allocation scenarios and compare results"""
        results = []
        
        for i, scenario in enumerate(scenarios):
            print(f"🎯 Running scenario {i+1}/{len(scenarios)}: {scenario.get('name', 'Unnamed')}")
            
            scenario_result = await self.create_optimal_allocation(
                shift_ids=shift_ids,
                constraints=scenario.get("constraints", {})
            )
            
            scenario_result["scenario_name"] = scenario.get("name", f"Scenario {i+1}")
            scenario_result["scenario_description"] = scenario.get("description", "")
            
            results.append(scenario_result)
        
        # Compare scenarios
        comparison = self._compare_scenarios(results)
        
        return {
            "scenarios": results,
            "comparison": comparison,
            "recommendation": comparison.get("best_scenario", {})
        }
    
    def _compare_scenarios(self, scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compare multiple allocation scenarios"""
        if not scenarios:
            return {}
        
        best_scenario = max(scenarios, key=lambda x: x.get("confidence_score", 0))
        
        comparison = {
            "best_scenario": {
                "name": best_scenario.get("scenario_name"),
                "confidence_score": best_scenario.get("confidence_score"),
                "reasoning": "Highest confidence score among all scenarios"
            },
            "metrics": {
                "average_confidence": sum(s.get("confidence_score", 0) for s in scenarios) / len(scenarios),
                "scenarios_with_violations": len([s for s in scenarios if not s.get("success", False)]),
                "total_scenarios": len(scenarios)
            }
        }
        
        return comparison