import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Psychology,
  PlayArrow,
  Stop,
  Refresh,
  Save,
  Download,
  Warning,
  CheckCircle,
  Schedule,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { allocationAPI, shiftsAPI } from '../services/api';
import AllocationScenarioRunner from '../components/allocation/AllocationScenarioRunner';
import AllocationResults from '../components/allocation/AllocationResults';
import ConstraintViolationsList from '../components/allocation/ConstraintViolationsList';

const allocationSteps = [
  'Select Shifts',
  'Set Constraints',
  'Run AI Analysis',
  'Review Results',
  'Apply Allocation'
];

export default function AllocationManagement() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [constraints, setConstraints] = useState({
    maxOvertimeHours: 8,
    minRestHours: 12,
    preferredAssignments: true,
    costOptimization: 'balanced',
    emergencyPriority: 'high',
  });
  const [allocationResult, setAllocationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScenarioRunner, setShowScenarioRunner] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAvailableShifts();
  }, []);

  const loadAvailableShifts = async () => {
    try {
      const response = await shiftsAPI.getAll({
        status: 'scheduled',
        requires_allocation: true
      });
      setAvailableShifts(response.data);
    } catch (error) {
      console.error('Error loading shifts:', error);
      setError('Failed to load available shifts');
    }
  };

  const handleShiftSelection = (shiftId) => {
    setSelectedShifts(prev => 
      prev.includes(shiftId) 
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const runAllocation = async () => {
    if (selectedShifts.length === 0) {
      setError('Please select at least one shift');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Preparing allocation data with shifts:', selectedShifts);
      const allocationData = {
        shift_ids: selectedShifts,
        constraints: constraints,
        optimization_goals: {
          minimize_cost: constraints.costOptimization === 'cost',
          maximize_satisfaction: constraints.costOptimization === 'satisfaction',
          balanced: constraints.costOptimization === 'balanced',
        }
      };

      console.log('Sending allocation request:', JSON.stringify(allocationData, null, 2));
      const response = await allocationAPI.createAllocation(allocationData);
      console.log('Allocation response:', response);
      
      if (response.data && response.data.status === 'success') {
        const result = response.data.data;
        
        // If the main allocation failed but we have a raw_response, try to use that
        if (result.success === false && result.raw_response) {
          try {
            // Try to extract JSON from the raw_response
            const jsonMatch = result.raw_response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsedResponse = JSON.parse(jsonMatch[0]);
              // Create a new result object with the parsed data
              const enhancedResult = {
                ...result,
                success: true, // Override success since we have valid data
                allocation_results: {
                  ...result.allocation_results,
                  allocations: parsedResponse.allocations || [],
                  optimization_score: parsedResponse.optimization_score || 0,
                },
                confidence_score: parsedResponse.optimization_score || 0,
              };
              console.log('Parsed raw response:', enhancedResult);
              setAllocationResult(enhancedResult);
            } else {
              throw new Error('Could not parse raw response');
            }
          } catch (parseError) {
            console.error('Error parsing raw response:', parseError);
            throw new Error('Failed to parse allocation results');
          }
        } else {
          setAllocationResult(result);
        }
        
        setActiveStep(3); // Move to results step
      } else {
        throw new Error(response.data?.message || 'No data received in response');
      }
    } catch (error) {
      console.error('Error running allocation:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        request: error.request,
        config: error.config
      });
      
      // Set more detailed error message
      let errorMessage = 'Failed to run AI allocation. ';
      
      if (error.response) {
        // Server responded with error status code
        if (error.response.data?.detail) {
          errorMessage += error.response.data.detail;
        } else if (error.response.status === 400) {
          errorMessage += 'Invalid request. Please check your input and try again.';
        } else if (error.response.status === 500) {
          errorMessage += 'Server error. Please try again later or contact support.';
        } else {
          errorMessage += `Error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'No response from server. Please check your connection and try again.';
      } else {
        // Something else happened in setting up the request
        errorMessage += `Error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAllocation = async () => {
    if (!allocationResult) {
      setError('No allocation results to apply');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Update the allocation result to show loading state
      setAllocationResult(prev => ({
        ...prev,
        _isApplying: true,
        _applyError: null
      }));
      
      // Get the latest shift data to ensure we're working with current data
      const shiftsResponse = await shiftsAPI.getAll({
        status: 'scheduled',
        requires_allocation: true
      });
      
      // Get all shifts and their assignments
      const allShifts = shiftsResponse.data || [];
      
      // Create a map of existing assignments for quick lookup
      const existingAssignments = new Map();
      
      // Fetch assignments for each shift
      const assignmentPromises = allShifts.map(async (shift) => {
        try {
          const assignmentsResponse = await shiftsAPI.getAssignments(shift.id);
          if (assignmentsResponse.data && Array.isArray(assignmentsResponse.data)) {
            if (!existingAssignments.has(shift.id)) {
              existingAssignments.set(shift.id, new Set());
            }
            assignmentsResponse.data.forEach(assignment => {
              existingAssignments.get(shift.id).add(assignment.staff_id);
            });
          }
        } catch (error) {
          console.error(`Error fetching assignments for shift ${shift.id}:`, error);
        }
      });
      
      // Wait for all assignment fetches to complete
      await Promise.all(assignmentPromises);
      
      const currentShiftIds = shiftsResponse.data.map(shift => shift.id);
      const allocations = allocationResult.allocation_results?.allocations || [];
      
      // Filter out any allocations for shifts that no longer exist
      const validAllocations = allocations.filter(allocation => 
        currentShiftIds.includes(parseInt(allocation.shift_id))
      );
      
      if (validAllocations.length === 0) {
        throw new Error('No valid shifts found to apply allocation');
      }
      
      const results = {
        success: [],
        skipped: [],
        failed: []
      };
      
      // Process the valid allocations
      for (const allocation of validAllocations) {
        const shiftId = allocation.shift_id;
        const assignments = allocation.staff_assignments || [];
        
        for (const assignment of assignments) {
          const staffId = assignment.staff_id;
          
          // Check if this assignment already exists
          if (existingAssignments.has(shiftId) && 
              existingAssignments.get(shiftId).has(staffId)) {
            results.skipped.push({
              shift_id: shiftId,
              staff_id: staffId,
              message: 'Already assigned'
            });
            continue;
          }
          
          try {
            const response = await shiftsAPI.assignStaff(shiftId, { 
              staff_id: staffId,
              assigned_by: 'ai_allocator' 
            });
            
            results.success.push({
              shift_id: shiftId,
              staff_id: staffId,
              message: response.data?.message || 'Assigned successfully'
            });
            
            // Update our local tracking of assignments
            if (!existingAssignments.has(shiftId)) {
              existingAssignments.set(shiftId, new Set());
            }
            existingAssignments.get(shiftId).add(staffId);
            
          } catch (assignmentError) {
            const errorMessage = assignmentError.response?.data?.detail || 
                              assignmentError.message || 
                              'Unknown error';
                              
            console.error(`Error assigning staff ${staffId} to shift ${shiftId}:`, errorMessage);
            
            results.failed.push({
              shift_id: shiftId,
              staff_id: staffId,
              error: errorMessage
            });
          }
        }
      }
      
      // Update the allocation result with the operation results
      setAllocationResult(prev => ({
        ...prev,
        _isApplying: false,
        _applyResults: results,
        _applyError: results.failed.length > 0 ? 
          `Failed to apply ${results.failed.length} out of ${results.failed.length + results.success.length} assignments` : 
          null
      }));
      
      // If we had any successful assignments, refresh the data
      if (results.success.length > 0) {
        await loadAvailableShifts();
      }
      
      // Move to the next step if we had any successful assignments
      if (results.success.length > 0) {
        setActiveStep(4);
      } else if (results.failed.length > 0) {
        // Only show error if all assignments failed
        setError(`Failed to apply any assignments. ${results.failed[0]?.error || 'Please try again.'}`);
      }
      
    } catch (error) {
      console.error('Error applying allocation:', error);
      const errorMessage = error.response?.data?.detail || 
                         error.message || 
                         'An unknown error occurred while applying the allocation';
      
      setError(`Failed to apply allocation: ${errorMessage}`);
      
      // Update the allocation result to remove loading state
      setAllocationResult(prev => ({
        ...prev,
        _isApplying: false,
        _applyError: errorMessage
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Shifts for AI Allocation
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Choose the shifts that need staff allocation. The AI will optimize assignments based on your constraints.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {availableShifts.map((shift) => (
                <Grid item xs={12} md={6} lg={4} key={shift.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedShifts.includes(shift.id) ? 2 : 1,
                      borderColor: selectedShifts.includes(shift.id) ? 'primary.main' : 'divider',
                    }}
                    onClick={() => handleShiftSelection(shift.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{shift.name}</Typography>
                      <Typography color="textSecondary">{shift.department}</Typography>
                      <Box display="flex" justifyContent="space-between" mt={1}>
                        <Typography variant="body2">
                          {new Date(shift.start_time).toLocaleDateString()}
                        </Typography>
                        <Chip 
                          label={`${shift.required_staff_count} staff needed`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Set Allocation Constraints
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Configure the constraints and preferences for the AI allocation system.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Overtime Hours"
                  type="number"
                  value={constraints.maxOvertimeHours}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    maxOvertimeHours: parseInt(e.target.value)
                  }))}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Rest Hours"
                  type="number"
                  value={constraints.minRestHours}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    minRestHours: parseInt(e.target.value)
                  }))}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cost Optimization</InputLabel>
                  <Select
                    value={constraints.costOptimization}
                    onChange={(e) => setConstraints(prev => ({
                      ...prev,
                      costOptimization: e.target.value
                    }))}
                  >
                    <MenuItem value="cost">Minimize Cost</MenuItem>
                    <MenuItem value="satisfaction">Maximize Satisfaction</MenuItem>
                    <MenuItem value="balanced">Balanced Approach</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Emergency Priority</InputLabel>
                  <Select
                    value={constraints.emergencyPriority}
                    onChange={(e) => setConstraints(prev => ({
                      ...prev,
                      emergencyPriority: e.target.value
                    }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              AI Allocation Analysis
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              The AI is analyzing {selectedShifts.length} shifts and generating optimal staff allocations.
            </Typography>
            
            {isProcessing ? (
              <Box sx={{ mt: 4 }}>
                <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI is thinking...
                </Typography>
                <LinearProgress sx={{ mt: 2, mb: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  This may take a few moments while we optimize your staff allocation.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={runAllocation}
                  disabled={selectedShifts.length === 0}
                >
                  Run AI Allocation
                </Button>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected {selectedShifts.length} shifts for analysis
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return allocationResult && (
          <AllocationResults 
            result={allocationResult}
            onApply={applyAllocation}
          />
        );

      case 4:
        return (
          <Box textAlign="center">
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Allocation Applied Successfully!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The AI-generated staff allocation has been applied to your selected shifts.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          AI Staff Allocation
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={() => setShowScenarioRunner(true)}
            sx={{ mr: 2 }}
          >
            Scenario Analysis
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadAvailableShifts}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {allocationSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep < 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 0 && selectedShifts.length === 0}
              >
                Next
              </Button>
            )}
            
            {activeStep === 3 && allocationResult?.success && (
              <Button
                variant="contained"
                color="success"
                onClick={applyAllocation}
                startIcon={<Save />}
              >
                Apply Allocation
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Scenario Runner Dialog */}
      <AllocationScenarioRunner
        open={showScenarioRunner}
        onClose={() => setShowScenarioRunner(false)}
        availableShifts={availableShifts}
      />
    </Box>
  );
}