import pytest
import asyncio
from app.services.allocation_service import AllocationService
from app.database import SessionLocal
from app.models.staff import Staff, StaffRole
from app.models.shifts import Shift, ShiftType

@pytest.fixture
def db_session():
    db = SessionLocal()
    yield db
    db.close()

@pytest.mark.asyncio
async def test_allocation_service(db_session):
    allocation_service = AllocationService(db_session)
    
    # Test with sample shift IDs
    shift_ids = [1, 2, 3]
    constraints = {
        "maxOvertimeHours": 8,
        "minRestHours": 12
    }
    
    result = await allocation_service.create_optimal_allocation(
        shift_ids=shift_ids,
        constraints=constraints
    )
    
    assert "allocation_id" in result
    assert "allocation_results" in result
    assert result["shifts_processed"] == len(shift_ids)

@pytest.mark.asyncio
async def test_scenario_comparison(db_session):
    allocation_service = AllocationService(db_session)
    
    scenarios = [
        {
            "name": "Cost Optimized",
            "constraints": {"costOptimization": "cost"}
        },
        {
            "name": "Satisfaction Optimized", 
            "constraints": {"costOptimization": "satisfaction"}
        }
    ]
    
    result = await allocation_service.simulate_allocation_scenarios(
        shift_ids=[1, 2],
        scenarios=scenarios
    )
    
    assert "scenarios" in result
    assert "comparison" in result
    assert len(result["scenarios"]) == 2