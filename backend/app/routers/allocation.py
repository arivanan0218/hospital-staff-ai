from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Dict, Any, Optional
from app.services.allocation_service import AllocationService
from app.database import get_db
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

router = APIRouter()

@router.post("/create", response_model=Dict[str, Any])
async def create_allocation(allocation_data: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Create a new staff allocation
    
    Expected payload:
    {
        "shift_ids": [1, 2, 3],
        "constraints": {
            "maxOvertimeHours": 8,
            "minRestHours": 12,
            "preferredAssignments": true,
            "costOptimization": "balanced",
            "emergencyPriority": "high"
        },
        "optimization_goals": {
            "minimize_cost": false,
            "maximize_satisfaction": true,
            "balanced": true
        }
    }
    """
    print("\n=== Allocation Request Received ===")
    print(f"Request data: {allocation_data}")
    
    try:
        # Validate required fields
        if not allocation_data.get("shift_ids"):
            error_msg = "No shift IDs provided in the request"
            print(f"Validation error: {error_msg}")
            raise HTTPException(status_code=400, detail=error_msg)
            
        print(f"Processing allocation for shift IDs: {allocation_data['shift_ids']}")
            
        # Extract optimization goals from the payload
        optimization_goals = allocation_data.get("optimization_goals", {})
        print(f"Optimization goals: {optimization_goals}")
        
        # Get or initialize constraints
        constraints = allocation_data.get("constraints", {})
        print(f"Initial constraints: {constraints}")
        
        # Add optimization goals to constraints if provided
        if optimization_goals:
            constraints["optimization_goals"] = {
                "minimize_cost": optimization_goals.get("minimize_cost", False),
                "maximize_satisfaction": optimization_goals.get("maximize_satisfaction", False),
                "balanced": optimization_goals.get("balanced", True)
            }
            print(f"Updated constraints with optimization goals: {constraints}")
        
        # Initialize the allocation service
        allocation_service = AllocationService(db)
        print("Fetching shift data...")
        
        # Get shift data
        shifts = await allocation_service._get_shifts_data(allocation_data["shift_ids"])
        print(f"Found {len(shifts)} valid shifts")
        
        if not shifts:
            error_msg = "No valid shifts found for the provided IDs"
            print(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
            
        # Calculate date range from shifts
        try:
            shift_dates = []
            for shift in shifts:
                if isinstance(shift.get("start_time"), str):
                    shift_dates.append(datetime.fromisoformat(shift["start_time"]))
            
            if not shift_dates:
                raise ValueError("No valid shift dates found")
                
            start_date = min(shift_dates)
            end_date = max(shift_dates) + timedelta(days=1)  # Add one day to include the full day
            print(f"Calculated date range: {start_date} to {end_date}")
            
        except Exception as e:
            error_msg = f"Error processing shift dates: {str(e)}"
            print(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Create the allocation
        print("Starting allocation process...")
        try:
            result = await allocation_service.create_optimal_allocation(
                shift_ids=allocation_data["shift_ids"],
                date_range=(start_date, end_date),
                constraints=constraints
            )
            print("Allocation completed successfully")
            return {"status": "success", "data": result}
            
        except Exception as e:
            error_msg = f"Error during allocation: {str(e)}"
            print(f"Allocation error: {error_msg}")
            print(f"Error type: {type(e).__name__}")
            import traceback
            print(f"Stack trace: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=error_msg)
            
    except HTTPException as he:
        # Re-raise HTTP exceptions as is
        print(f"HTTP Exception: {he.detail}")
        raise
        
    except Exception as e:
        # Catch any other exceptions and log them
        error_msg = f"Unexpected error: {str(e)}"
        print(f"Unexpected error: {error_msg}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        print(f"Stack trace: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/", response_model=List[Dict[str, Any]])
async def get_allocations(
    skip: int = 0, 
    limit: int = 100, 
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all allocations with optional date filtering
    """
    try:
        # TODO: Implement actual database query with date filtering
        return []
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/simulate", response_model=Dict[str, Any])
async def simulate_allocation(
    simulation_data: Dict[str, Any], 
    db: Session = Depends(get_db)
):
    """
    Simulate staff allocation based on criteria
    """
    try:
        allocation_service = AllocationService(db)
        result = await allocation_service.simulate_allocation_scenarios(
            shift_ids=simulation_data.get("shift_ids", []),
            scenarios=simulation_data.get("scenarios", [])
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/analytics", response_model=Dict[str, Any])
async def get_allocation_analytics(
    days_back: int = Query(30, description="Number of days to look back for analytics"),
    db: Session = Depends(get_db)
):
    """
    Get allocation analytics and metrics
    """
    try:
        allocation_service = AllocationService(db)
        return await allocation_service.get_allocation_analytics(days_back=days_back)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
