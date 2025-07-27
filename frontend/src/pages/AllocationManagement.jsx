// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   LinearProgress,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Alert,
//   Stepper,
//   Step,
//   StepLabel,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider,
// } from '@mui/material';
// import {
//   Psychology,
//   PlayArrow,
//   Stop,
//   Refresh,
//   Save,
//   Download,
//   Warning,
//   CheckCircle,
//   Schedule,
//   People,
//   TrendingUp,
// } from '@mui/icons-material';
// import { allocationAPI, shiftsAPI } from '../services/api';
// import AllocationScenarioRunner from '../components/allocation/AllocationScenarioRunner';
// import AllocationResults from '../components/allocation/AllocationResults';
// import ConstraintViolationsList from '../components/allocation/ConstraintViolationsList';

// const allocationSteps = [
//   'Select Shifts',
//   'Set Constraints',
//   'Run AI Analysis',
//   'Review Results',
//   'Apply Allocation'
// ];

// export default function AllocationManagement() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedShifts, setSelectedShifts] = useState([]);
//   const [availableShifts, setAvailableShifts] = useState([]);
//   const [constraints, setConstraints] = useState({
//     maxOvertimeHours: 8,
//     minRestHours: 12,
//     preferredAssignments: true,
//     costOptimization: 'balanced',
//     emergencyPriority: 'high',
//   });
//   const [allocationResult, setAllocationResult] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showScenarioRunner, setShowScenarioRunner] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadAvailableShifts();
//   }, []);

//   const loadAvailableShifts = async () => {
//     try {
//       const response = await shiftsAPI.getAll({
//         status: 'scheduled',
//         requires_allocation: true
//       });
//       setAvailableShifts(response.data);
//     } catch (error) {
//       console.error('Error loading shifts:', error);
//       setError('Failed to load available shifts');
//     }
//   };

//   const handleShiftSelection = (shiftId) => {
//     setSelectedShifts(prev => 
//       prev.includes(shiftId) 
//         ? prev.filter(id => id !== shiftId)
//         : [...prev, shiftId]
//     );
//   };

//   const handleNext = () => {
//     setActiveStep(prev => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep(prev => prev - 1);
//   };

//   const runAllocation = async () => {
//     if (selectedShifts.length === 0) {
//       setError('Please select at least one shift');
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//       console.log('Preparing allocation data with shifts:', selectedShifts);
//       const allocationData = {
//         shift_ids: selectedShifts,
//         constraints: constraints,
//         optimization_goals: {
//           minimize_cost: constraints.costOptimization === 'cost',
//           maximize_satisfaction: constraints.costOptimization === 'satisfaction',
//           balanced: constraints.costOptimization === 'balanced',
//         }
//       };

//       console.log('Sending allocation request:', JSON.stringify(allocationData, null, 2));
//       const response = await allocationAPI.createAllocation(allocationData);
//       console.log('Allocation response:', response);
      
//       if (response.data && response.data.status === 'success') {
//         const result = response.data.data;
        
//         // If the main allocation failed but we have a raw_response, try to use that
//         if (result.success === false && result.raw_response) {
//           try {
//             // Try to extract JSON from the raw_response
//             const jsonMatch = result.raw_response.match(/\{[\s\S]*\}/);
//             if (jsonMatch) {
//               const parsedResponse = JSON.parse(jsonMatch[0]);
//               // Create a new result object with the parsed data
//               const enhancedResult = {
//                 ...result,
//                 success: true, // Override success since we have valid data
//                 allocation_results: {
//                   ...result.allocation_results,
//                   allocations: parsedResponse.allocations || [],
//                   optimization_score: parsedResponse.optimization_score || 0,
//                 },
//                 confidence_score: parsedResponse.optimization_score || 0,
//               };
//               console.log('Parsed raw response:', enhancedResult);
//               setAllocationResult(enhancedResult);
//             } else {
//               throw new Error('Could not parse raw response');
//             }
//           } catch (parseError) {
//             console.error('Error parsing raw response:', parseError);
//             throw new Error('Failed to parse allocation results');
//           }
//         } else {
//           setAllocationResult(result);
//         }
        
//         setActiveStep(3); // Move to results step
//       } else {
//         throw new Error(response.data?.message || 'No data received in response');
//       }
//     } catch (error) {
//       console.error('Error running allocation:', {
//         error,
//         response: error.response?.data,
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         headers: error.response?.headers,
//         request: error.request,
//         config: error.config
//       });
      
//       // Set more detailed error message
//       let errorMessage = 'Failed to run AI allocation. ';
      
//       if (error.response) {
//         // Server responded with error status code
//         if (error.response.data?.detail) {
//           errorMessage += error.response.data.detail;
//         } else if (error.response.status === 400) {
//           errorMessage += 'Invalid request. Please check your input and try again.';
//         } else if (error.response.status === 500) {
//           errorMessage += 'Server error. Please try again later or contact support.';
//         } else {
//           errorMessage += `Error: ${error.response.status} ${error.response.statusText}`;
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         errorMessage += 'No response from server. Please check your connection and try again.';
//       } else {
//         // Something else happened in setting up the request
//         errorMessage += `Error: ${error.message}`;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const applyAllocation = async () => {
//     if (!allocationResult) {
//       setError('No allocation results to apply');
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setError(null);
      
//       // Update the allocation result to show loading state
//       setAllocationResult(prev => ({
//         ...prev,
//         _isApplying: true,
//         _applyError: null
//       }));
      
//       // Get the latest shift data to ensure we're working with current data
//       const shiftsResponse = await shiftsAPI.getAll({
//         status: 'scheduled',
//         requires_allocation: true
//       });
      
//       // Get all shifts and their assignments
//       const allShifts = shiftsResponse.data || [];
      
//       // Create a map of existing assignments for quick lookup
//       const existingAssignments = new Map();
      
//       // Fetch assignments for each shift
//       const assignmentPromises = allShifts.map(async (shift) => {
//         try {
//           const assignmentsResponse = await shiftsAPI.getAssignments(shift.id);
//           if (assignmentsResponse.data && Array.isArray(assignmentsResponse.data)) {
//             if (!existingAssignments.has(shift.id)) {
//               existingAssignments.set(shift.id, new Set());
//             }
//             assignmentsResponse.data.forEach(assignment => {
//               existingAssignments.get(shift.id).add(assignment.staff_id);
//             });
//           }
//         } catch (error) {
//           console.error(`Error fetching assignments for shift ${shift.id}:`, error);
//         }
//       });
      
//       // Wait for all assignment fetches to complete
//       await Promise.all(assignmentPromises);
      
//       const currentShiftIds = shiftsResponse.data.map(shift => shift.id);
//       const allocations = allocationResult.allocation_results?.allocations || [];
      
//       // Filter out any allocations for shifts that no longer exist
//       const validAllocations = allocations.filter(allocation => 
//         currentShiftIds.includes(parseInt(allocation.shift_id))
//       );
      
//       if (validAllocations.length === 0) {
//         throw new Error('No valid shifts found to apply allocation');
//       }
      
//       const results = {
//         success: [],
//         skipped: [],
//         failed: []
//       };
      
//       // Process the valid allocations
//       for (const allocation of validAllocations) {
//         const shiftId = allocation.shift_id;
//         const assignments = allocation.staff_assignments || [];
        
//         for (const assignment of assignments) {
//           const staffId = assignment.staff_id;
          
//           // Check if this assignment already exists
//           if (existingAssignments.has(shiftId) && 
//               existingAssignments.get(shiftId).has(staffId)) {
//             results.skipped.push({
//               shift_id: shiftId,
//               staff_id: staffId,
//               message: 'Already assigned'
//             });
//             continue;
//           }
          
//           try {
//             const response = await shiftsAPI.assignStaff(shiftId, { 
//               staff_id: staffId,
//               assigned_by: 'ai_allocator' 
//             });
            
//             results.success.push({
//               shift_id: shiftId,
//               staff_id: staffId,
//               message: response.data?.message || 'Assigned successfully'
//             });
            
//             // Update our local tracking of assignments
//             if (!existingAssignments.has(shiftId)) {
//               existingAssignments.set(shiftId, new Set());
//             }
//             existingAssignments.get(shiftId).add(staffId);
            
//           } catch (assignmentError) {
//             const errorMessage = assignmentError.response?.data?.detail || 
//                               assignmentError.message || 
//                               'Unknown error';
                              
//             console.error(`Error assigning staff ${staffId} to shift ${shiftId}:`, errorMessage);
            
//             results.failed.push({
//               shift_id: shiftId,
//               staff_id: staffId,
//               error: errorMessage
//             });
//           }
//         }
//       }
      
//       // Update the allocation result with the operation results
//       setAllocationResult(prev => ({
//         ...prev,
//         _isApplying: false,
//         _applyResults: results,
//         _applyError: results.failed.length > 0 ? 
//           `Failed to apply ${results.failed.length} out of ${results.failed.length + results.success.length} assignments` : 
//           null
//       }));
      
//       // If we had any successful assignments, refresh the data
//       if (results.success.length > 0) {
//         await loadAvailableShifts();
//       }
      
//       // Move to the next step if we had any successful assignments
//       if (results.success.length > 0) {
//         setActiveStep(4);
//       } else if (results.failed.length > 0) {
//         // Only show error if all assignments failed
//         setError(`Failed to apply any assignments. ${results.failed[0]?.error || 'Please try again.'}`);
//       }
      
//     } catch (error) {
//       console.error('Error applying allocation:', error);
//       const errorMessage = error.response?.data?.detail || 
//                          error.message || 
//                          'An unknown error occurred while applying the allocation';
      
//       setError(`Failed to apply allocation: ${errorMessage}`);
      
//       // Update the allocation result to remove loading state
//       setAllocationResult(prev => ({
//         ...prev,
//         _isApplying: false,
//         _applyError: errorMessage
//       }));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Select Shifts for AI Allocation
//             </Typography>
//             <Typography variant="body2" color="textSecondary" gutterBottom>
//               Choose the shifts that need staff allocation. The AI will optimize assignments based on your constraints.
//             </Typography>
            
//             <Grid container spacing={2} sx={{ mt: 2 }}>
//               {availableShifts.map((shift) => (
//                 <Grid item xs={12} md={6} lg={4} key={shift.id}>
//                   <Card 
//                     sx={{ 
//                       cursor: 'pointer',
//                       border: selectedShifts.includes(shift.id) ? 2 : 1,
//                       borderColor: selectedShifts.includes(shift.id) ? 'primary.main' : 'divider',
//                     }}
//                     onClick={() => handleShiftSelection(shift.id)}
//                   >
//                     <CardContent>
//                       <Typography variant="h6">{shift.name}</Typography>
//                       <Typography color="textSecondary">{shift.department}</Typography>
//                       <Box display="flex" justifyContent="space-between" mt={1}>
//                         <Typography variant="body2">
//                           {new Date(shift.start_time).toLocaleDateString()}
//                         </Typography>
//                         <Chip 
//                           label={`${shift.required_staff_count} staff needed`}
//                           size="small"
//                           color="primary"
//                         />
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         );

//       case 1:
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               Set Allocation Constraints
//             </Typography>
//             <Typography variant="body2" color="textSecondary" gutterBottom>
//               Configure the constraints and preferences for the AI allocation system.
//             </Typography>
            
//             <Grid container spacing={3} sx={{ mt: 2 }}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Maximum Overtime Hours"
//                   type="number"
//                   value={constraints.maxOvertimeHours}
//                   onChange={(e) => setConstraints(prev => ({
//                     ...prev,
//                     maxOvertimeHours: parseInt(e.target.value)
//                   }))}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Minimum Rest Hours"
//                   type="number"
//                   value={constraints.minRestHours}
//                   onChange={(e) => setConstraints(prev => ({
//                     ...prev,
//                     minRestHours: parseInt(e.target.value)
//                   }))}
//                 />
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Cost Optimization</InputLabel>
//                   <Select
//                     value={constraints.costOptimization}
//                     onChange={(e) => setConstraints(prev => ({
//                       ...prev,
//                       costOptimization: e.target.value
//                     }))}
//                   >
//                     <MenuItem value="cost">Minimize Cost</MenuItem>
//                     <MenuItem value="satisfaction">Maximize Satisfaction</MenuItem>
//                     <MenuItem value="balanced">Balanced Approach</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Emergency Priority</InputLabel>
//                   <Select
//                     value={constraints.emergencyPriority}
//                     onChange={(e) => setConstraints(prev => ({
//                       ...prev,
//                       emergencyPriority: e.target.value
//                     }))}
//                   >
//                     <MenuItem value="low">Low</MenuItem>
//                     <MenuItem value="medium">Medium</MenuItem>
//                     <MenuItem value="high">High</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </Box>
//         );

//       case 2:
//         return (
//           <Box textAlign="center">
//             <Typography variant="h6" gutterBottom>
//               AI Allocation Analysis
//             </Typography>
//             <Typography variant="body2" color="textSecondary" gutterBottom>
//               The AI is analyzing {selectedShifts.length} shifts and generating optimal staff allocations.
//             </Typography>
            
//             {isProcessing ? (
//               <Box sx={{ mt: 4 }}>
//                 <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
//                 <Typography variant="h6" gutterBottom>
//                   AI is thinking...
//                 </Typography>
//                 <LinearProgress sx={{ mt: 2, mb: 2 }} />
//                 <Typography variant="body2" color="textSecondary">
//                   This may take a few moments while we optimize your staff allocation.
//                 </Typography>
//               </Box>
//             ) : (
//               <Box sx={{ mt: 4 }}>
//                 <Button
//                   variant="contained"
//                   size="large"
//                   startIcon={<PlayArrow />}
//                   onClick={runAllocation}
//                   disabled={selectedShifts.length === 0}
//                 >
//                   Run AI Allocation
//                 </Button>
//                 <Typography variant="body2" sx={{ mt: 2 }}>
//                   Selected {selectedShifts.length} shifts for analysis
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         );

//       case 3:
//         return allocationResult && (
//           <AllocationResults 
//             result={allocationResult}
//             onApply={applyAllocation}
//           />
//         );

//       case 4:
//         return (
//           <Box textAlign="center">
//             <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               Allocation Applied Successfully!
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               The AI-generated staff allocation has been applied to your selected shifts.
//             </Typography>
//           </Box>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">
//           AI Staff Allocation
//         </Typography>
//         <Box>
//           <Button
//             variant="outlined"
//             startIcon={<TrendingUp />}
//             onClick={() => setShowScenarioRunner(true)}
//             sx={{ mr: 2 }}
//           >
//             Scenario Analysis
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Refresh />}
//             onClick={loadAvailableShifts}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Paper sx={{ p: 3 }}>
//         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//           {allocationSteps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>

//         {renderStepContent(activeStep)}

//         <Box display="flex" justifyContent="space-between" mt={4}>
//           <Button
//             disabled={activeStep === 0}
//             onClick={handleBack}
//           >
//             Back
//           </Button>
          
//           <Box>
//             {activeStep < 2 && (
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 disabled={activeStep === 0 && selectedShifts.length === 0}
//               >
//                 Next
//               </Button>
//             )}
            
//             {activeStep === 3 && allocationResult?.success && (
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={applyAllocation}
//                 startIcon={<Save />}
//               >
//                 Apply Allocation
//               </Button>
//             )}
//           </Box>
//         </Box>
//       </Paper>

//       {/* Scenario Runner Dialog */}
//       <AllocationScenarioRunner
//         open={showScenarioRunner}
//         onClose={() => setShowScenarioRunner(false)}
//         availableShifts={availableShifts}
//       />
//     </Box>
//   );
// }

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
  Container,
  Stack,
  Fade,
  Grow,
  CircularProgress,
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
  Settings,
  AutoAwesome,
  CalendarToday,
  AccessTime,
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

// Styled components moved outside to prevent recreation
const StyledTextField = ({ error, helperText, ...props }) => (
  <TextField
    {...props}
    error={error}
    helperText={helperText || ' '}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        '& fieldset': {
          borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
          borderColor: '#cccccc',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000000',
          borderWidth: 2,
        },
        '&.Mui-error fieldset': {
          borderColor: '#d32f2f',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#666666',
        fontWeight: 500,
        '&.Mui-focused': {
          color: '#000000',
        },
        '&.Mui-error': {
          color: '#d32f2f',
        },
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        fontSize: '12px',
        '&.Mui-error': {
          color: '#d32f2f',
        },
      },
    }}
  />
);

const StyledSelect = ({ error, children, ...props }) => (
  <FormControl fullWidth>
    <InputLabel sx={{ 
      color: '#666666', 
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#000000',
      },
    }}>
      {props.label}
    </InputLabel>
    <Select
      {...props}
      error={error}
      sx={{
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#cccccc',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#000000',
          borderWidth: 2,
        },
      }}
    >
      {children}
    </Select>
  </FormControl>
);

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
            <Box sx={{ mb: 4 }}>
              <Typography sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#000000',
                mb: 1,
              }}>
                Select Shifts for AI Allocation
              </Typography>
              <Typography sx={{
                fontSize: '14px',
                color: '#666666',
                fontWeight: 500,
                lineHeight: 1.6,
              }}>
                Choose the shifts that need staff allocation. The AI will optimize assignments based on your constraints.
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {availableShifts.map((shift, index) => (
                <Grid item xs={12} sm={6} lg={4} key={shift.id}>
                  <Fade in timeout={300 + index * 50}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: '16px',
                        border: selectedShifts.includes(shift.id) ? '2px solid #000000' : '1px solid #e5e5e5',
                        backgroundColor: selectedShifts.includes(shift.id) ? '#fafafa' : '#ffffff',
                        boxShadow: selectedShifts.includes(shift.id) 
                          ? '0 4px 12px rgba(0, 0, 0, 0.08)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                          borderColor: selectedShifts.includes(shift.id) ? '#000000' : '#cccccc',
                        },
                      }}
                      onClick={() => handleShiftSelection(shift.id)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                          <Box sx={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            backgroundColor: selectedShifts.includes(shift.id) ? '#f0f0f0' : '#f8f8f8',
                            border: '1px solid #e0e0e0',
                          }}>
                            <Schedule sx={{ fontSize: 20, color: '#666666' }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#000000',
                              mb: 0.5,
                            }}>
                              {shift.name}
                            </Typography>
                            <Typography sx={{
                              fontSize: '13px',
                              color: '#666666',
                              fontWeight: 500,
                            }}>
                              {shift.department}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}>
                            <CalendarToday sx={{ fontSize: 14, color: '#666666' }} />
                            <Typography sx={{
                              fontSize: '12px',
                              color: '#666666',
                              fontWeight: 500,
                            }}>
                              {new Date(shift.start_time).toLocaleDateString()}
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={`${shift.required_staff_count} staff needed`}
                            size="small"
                            sx={{
                              backgroundColor: '#f0f0f0',
                              color: '#000000',
                              fontWeight: 600,
                              fontSize: '11px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid #e0e0e0',
                            }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#000000',
                mb: 1,
              }}>
                Set Allocation Constraints
              </Typography>
              <Typography sx={{
                fontSize: '14px',
                color: '#666666',
                fontWeight: 500,
                lineHeight: 1.6,
              }}>
                Configure the constraints and preferences for the AI allocation system.
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Maximum Overtime Hours"
                  type="number"
                  value={constraints.maxOvertimeHours}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    maxOvertimeHours: parseInt(e.target.value)
                  }))}
                  helperText="Maximum allowed overtime hours per staff member"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="Minimum Rest Hours"
                  type="number"
                  value={constraints.minRestHours}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    minRestHours: parseInt(e.target.value)
                  }))}
                  helperText="Minimum rest hours between consecutive shifts"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledSelect
                  value={constraints.costOptimization}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    costOptimization: e.target.value
                  }))}
                  label="Cost Optimization"
                >
                  <MenuItem value="cost">Minimize Cost</MenuItem>
                  <MenuItem value="satisfaction">Maximize Satisfaction</MenuItem>
                  <MenuItem value="balanced">Balanced Approach</MenuItem>
                </StyledSelect>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledSelect
                  value={constraints.emergencyPriority}
                  onChange={(e) => setConstraints(prev => ({
                    ...prev,
                    emergencyPriority: e.target.value
                  }))}
                  label="Emergency Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </StyledSelect>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#000000',
              mb: 1,
            }}>
              AI Allocation Analysis
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              color: '#666666',
              fontWeight: 500,
              mb: 4,
              maxWidth: '500px',
              mx: 'auto',
            }}>
              The AI is analyzing {selectedShifts.length} shifts and generating optimal staff allocations based on your constraints.
            </Typography>
            
            {isProcessing ? (
              <Box sx={{ py: 4 }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f8f8',
                  border: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  position: 'relative',
                }}>
                  <Psychology sx={{ fontSize: 48, color: '#000000' }} />
                  <CircularProgress 
                    size={116}
                    thickness={2}
                    sx={{
                      color: '#000000',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                    }}
                  />
                </Box>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  mb: 1,
                }}>
                  AI is optimizing allocations...
                </Typography>
                <Typography sx={{
                  fontSize: '14px',
                  color: '#666666',
                  fontWeight: 500,
                }}>
                  This may take a few moments while we analyze staff availability and constraints.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 4 }}>
                <Box sx={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f8f8',
                  border: '2px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                }}>
                  <AutoAwesome sx={{ fontSize: 48, color: '#000000' }} />
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={runAllocation}
                  disabled={selectedShifts.length === 0}
                  sx={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderRadius: '12px',
                    px: 4,
                    py: 2,
                    fontWeight: 600,
                    fontSize: '16px',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      backgroundColor: '#333333',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                    },
                    '&:disabled': {
                      backgroundColor: '#f0f0f0',
                      color: '#cccccc',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Run AI Allocation
                </Button>
                <Typography sx={{
                  fontSize: '13px',
                  color: '#999999',
                  mt: 2,
                }}>
                  {selectedShifts.length} shifts selected for analysis
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
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#f8f8f8',
              border: '2px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}>
              <CheckCircle sx={{ fontSize: 48, color: '#000000' }} />
            </Box>
            <Typography sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#000000',
              mb: 1,
            }}>
              Allocation Applied Successfully!
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              color: '#666666',
              fontWeight: 500,
              maxWidth: '400px',
              mx: 'auto',
            }}>
              The AI-generated staff allocation has been applied to your selected shifts. All assignments are now active.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in timeout={300}>
        <Box>
          {/* Page Header */}
          <Box sx={{ 
            mb: { xs: 4, md: 6 },
            textAlign: 'left',
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900,
                color: '#000000',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 2,
                textAlign: 'left',
              }}
            >
              AI Staff Allocation
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                maxWidth: '600px',
                textAlign: 'left',
              }}
            >
              Leverage artificial intelligence to optimize staff allocation across shifts and departments
            </Typography>
          </Box>

          {/* Action Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '18px',
              }}
            >
              Smart Allocation Wizard
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<TrendingUp sx={{ fontSize: 18 }} />}
                onClick={() => setShowScenarioRunner(true)}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#666666',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#cccccc',
                    backgroundColor: '#f8f8f8',
                  },
                }}
              >
                Scenario Analysis
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh sx={{ fontSize: 18 }} />}
                onClick={loadAvailableShifts}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#666666',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#cccccc',
                    backgroundColor: '#f8f8f8',
                  },
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {/* Error Alert */}
          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ 
                  mb: 4,
                  borderRadius: '12px',
                  border: '1px solid #ffcdd2',
                  backgroundColor: '#ffebee',
                  color: '#d32f2f',
                  '& .MuiAlert-icon': {
                    fontSize: '20px',
                    color: '#d32f2f',
                  },
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                    fontSize: '14px',
                  },
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* Main Content */}
          <Grow in timeout={500}>
            <Paper sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              {/* Stepper */}
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  mb: 5,
                  '& .MuiStepLabel-label': {
                    fontSize: '14px',
                    fontWeight: 500,
                    '&.Mui-active': {
                      fontWeight: 600,
                      color: '#000000',
                    },
                    '&.Mui-completed': {
                      fontWeight: 500,
                      color: '#666666',
                    },
                  },
                  '& .MuiStepIcon-root': {
                    color: '#f0f0f0',
                    '&.Mui-active': {
                      color: '#000000',
                    },
                    '&.Mui-completed': {
                      color: '#000000',
                    },
                  },
                }}
              >
                {allocationSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              <Box sx={{ minHeight: '400px' }}>
                {renderStepContent(activeStep)}
              </Box>

              {/* Navigation */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 5,
                pt: 4,
                borderTop: '1px solid #f0f0f0',
              }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    color: '#666666',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '10px',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '14px',
                    textTransform: 'none',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderColor: '#cccccc',
                    },
                    '&:disabled': {
                      backgroundColor: '#f5f5f5',
                      color: '#cccccc',
                      borderColor: '#f0f0f0',
                    },
                  }}
                >
                  Back
                </Button>
                
                <Box>
                  {activeStep < 2 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={activeStep === 0 && selectedShifts.length === 0}
                      sx={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '10px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          backgroundColor: '#333333',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                        '&:disabled': {
                          backgroundColor: '#f0f0f0',
                          color: '#cccccc',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Next
                    </Button>
                  )}
                  
                  {activeStep === 3 && allocationResult?.success && (
                    <Button
                      variant="contained"
                      onClick={applyAllocation}
                      startIcon={<Save sx={{ fontSize: 18 }} />}
                      disabled={isProcessing}
                      sx={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        borderRadius: '10px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '14px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          backgroundColor: '#333333',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        },
                        '&:disabled': {
                          backgroundColor: '#f0f0f0',
                          color: '#cccccc',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Apply Allocation
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grow>

          {/* Scenario Runner Dialog */}
          <AllocationScenarioRunner
            open={showScenarioRunner}
            onClose={() => setShowScenarioRunner(false)}
            availableShifts={availableShifts}
          />
        </Box>
      </Fade>
    </Container>
  );
}