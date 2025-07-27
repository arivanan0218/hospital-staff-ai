// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Button, 
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { Add, Schedule, Close, TableRows } from '@mui/icons-material';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchShifts, createShift } from '../store/slices/shiftSlice';
// import ShiftCalendar from '../components/shifts/ShiftCalendar';
// import { fetchDepartments } from '../store/slices/departmentSlice';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// const shiftTypes = [
//   { value: 'morning', label: 'Morning' },
//   { value: 'afternoon', label: 'Afternoon' },
//   { value: 'night', label: 'Night' },
//   { value: 'emergency', label: 'Emergency' },
// ];

// export default function ShiftManagement() {
//   const dispatch = useDispatch();
//   const { list: shifts = [], loading: shiftsLoading, error: shiftsError } = useSelector((state) => state.shifts || {});
//   // Get departments from Redux store with proper initialization
//   const departmentsState = useSelector((state) => state.departments);
  
//   // Safely extract departments with fallbacks
//   const departments = Array.isArray(departmentsState?.list) ? departmentsState.list : [];
//   const departmentsLoading = departmentsState?.loading || false;
//   const departmentsError = departmentsState?.error || null;
  
//   console.log('Departments state:', {
//     departments,
//     loading: departmentsLoading,
//     error: departmentsError
//   });
//   const [openDialog, setOpenDialog] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [view, setView] = useState('table'); // 'table' or 'calendar'
  
//   const [newShift, setNewShift] = useState(() => {
//     // Initialize with default values including department_id as empty string
//     return {
//       name: '',
//       department_id: '',
//       shift_type: 'morning', // Default to morning shift
//       start_time: new Date(),
//       end_time: new Date(Date.now() + 8 * 60 * 60 * 1000), // Default 8 hour shift
//       required_staff_count: 1,
//       notes: ''
//     };
//   });

//   // Fetch departments when component mounts
//   useEffect(() => {
//     console.log('Dispatching fetchDepartments...');
//     dispatch(fetchDepartments())
//       .then((result) => {
//         console.log('fetchDepartments result:', result);
//       })
//       .catch((error) => {
//         console.error('Error in fetchDepartments:', error);
//       });
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchShifts());
//   }, [dispatch]);

//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => setOpenDialog(false);

//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewShift({ ...newShift, [name]: value });
//   };

//   const handleDateTimeChange = (name) => (date) => {
//     setNewShift({ ...newShift, [name]: date });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(createShift(newShift)).unwrap();
//       setOpenDialog(false);
//       setSnackbar({
//         open: true,
//         message: 'Shift created successfully!',
//         severity: 'success'
//       });
//       // Reset form
//       setNewShift({
//         name: '',
//         department_id: '',
//         shift_type: '',
//         start_time: new Date(),
//         end_time: new Date(Date.now() + 8 * 60 * 60 * 1000),
//         required_staff_count: 1,
//         notes: ''
//       });
//     } catch (error) {
//       const errorMessage = error?.message || error?.toString() || 'Failed to create shift';
//       setSnackbar({
//         open: true,
//         message: errorMessage,
//         severity: 'error'
//       });
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'scheduled': return 'primary';
//       case 'in_progress': return 'success';
//       case 'completed': return 'default';
//       default: return 'default';
//     }
//   };

//   const formatTimeRange = (start, end) => {
//     const formatTime = (date) => {
//       return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };
//     return `${formatTime(start)} - ${formatTime(end)}`;
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">
//           <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
//           Shift Management
//         </Typography>
//         <Box>
//           <Button 
//             variant={view === 'calendar' ? 'contained' : 'outlined'} 
//             startIcon={<CalendarMonthIcon />} 
//             sx={{ mr: 2 }}
//             onClick={() => setView('calendar')}
//           >
//             Calendar View
//           </Button>
//           <Button 
//             variant={view === 'table' ? 'contained' : 'outlined'} 
//             startIcon={<TableRows />} 
//             sx={{ mr: 2 }}
//             onClick={() => setView('table')}
//           >
//             Table View
//           </Button>
//           <Button 
//             variant="contained" 
//             startIcon={<Add />}
//             onClick={handleOpenDialog}
//           >
//             Add Shift
//           </Button>
//         </Box>
//       </Box>

//       {view === 'table' ? (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Shift Name</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>Time</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {shifts.map((shift) => (
//                 <TableRow key={shift.id} hover>
//                   <TableCell>{shift.name}</TableCell>
//                   <TableCell>{shift.department?.name || 'N/A'}</TableCell>
//                   <TableCell>{formatTimeRange(shift.start_time, shift.end_time)}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={shift.status}
//                       color={getStatusColor(shift.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button size="small">Edit</Button>
//                     <Button size="small">Assign Staff</Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Paper sx={{ p: 2 }}>
//           <ShiftCalendar />
//         </Paper>
//       )}

//       {/* Add Shift Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//         <form onSubmit={handleSubmit}>
//           <DialogTitle>
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <span>Add New Shift</span>
//               <Button onClick={handleCloseDialog} color="inherit">
//                 <Close />
//               </Button>
//             </Box>
//           </DialogTitle>
//           <DialogContent dividers>
//             <Box display="grid" gap={2} mt={1}>
//               <TextField
//                 required
//                 name="name"
//                 label="Shift Name"
//                 value={newShift.name}
//                 onChange={handleInputChange}
//                 fullWidth
//                 margin="normal"
//               />
              
//               <FormControl fullWidth margin="normal" required>
//                 <InputLabel id="department-select-label">Department</InputLabel>
//                 <Select
//                   name="department_id"
//                   value={newShift.department_id || ''}
//                   onChange={handleInputChange}
//                   labelId="department-select-label"
//                   label="Department"
//                   disabled={departmentsLoading || departmentsError || departments.length === 0}
//                 >
//                   {departmentsLoading ? (
//                     <MenuItem disabled>Loading departments...</MenuItem>
//                   ) : departmentsError ? (
//                     <MenuItem disabled>Error loading departments</MenuItem>
//                   ) : departments.length > 0 ? (
//                     [
//                       <MenuItem key="select" value="" disabled>
//                         Select a department
//                       </MenuItem>,
//                       ...departments.map((dept) => (
//                         <MenuItem key={dept.id} value={dept.id}>
//                           {dept.name}
//                         </MenuItem>
//                       ))
//                     ]
//                   ) : (
//                     <MenuItem disabled>No departments available</MenuItem>
//                   )}
//                 </Select>
//                 {departmentsError && (
//                   <FormHelperText error>{departmentsError}</FormHelperText>
//                 )}
//               </FormControl>

//               <FormControl fullWidth margin="normal" required>
//                 <InputLabel>Shift Type</InputLabel>
//                 <Select
//                   name="shift_type"
//                   value={newShift.shift_type}
//                   onChange={handleInputChange}
//                   label="Shift Type"
//                 >
//                   {shiftTypes.map((type) => (
//                     <MenuItem key={type.value} value={type.value}>
//                       {type.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DateTimePicker
//                   label="Start Time"
//                   value={newShift.start_time}
//                   onChange={handleDateTimeChange('start_time')}
//                   renderInput={(params) => (
//                     <TextField {...params} fullWidth margin="normal" required />
//                   )}
//                 />
//                 <DateTimePicker
//                   label="End Time"
//                   value={newShift.end_time}
//                   onChange={handleDateTimeChange('end_time')}
//                   minDateTime={newShift.start_time}
//                   renderInput={(params) => (
//                     <TextField {...params} fullWidth margin="normal" required />
//                   )}
//                 />
//               </LocalizationProvider>

//               <TextField
//                 required
//                 name="required_staff_count"
//                 label="Required Staff Count"
//                 type="number"
//                 value={newShift.required_staff_count}
//                 onChange={handleInputChange}
//                 fullWidth
//                 margin="normal"
//                 inputProps={{ min: 1 }}
//               />

//               <TextField
//                 name="notes"
//                 label="Notes"
//                 value={newShift.notes}
//                 onChange={handleInputChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={3}
//               />
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Cancel</Button>
//             <Button type="submit" variant="contained" color="primary">
//               Create Shift
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
//           {typeof snackbar.message === 'string' 
//             ? snackbar.message 
//             : 'An error occurred. Please try again.'}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }


import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Container,
  Stack,
  Grid,
  IconButton,
  Fade,
  Grow,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import { 
  Add, 
  Schedule, 
  Close, 
  TableRows,
  Edit,
  People,
  AccessTime,
} from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts, createShift } from '../store/slices/shiftSlice';
import ShiftCalendar from '../components/shifts/ShiftCalendar';
import { fetchDepartments } from '../store/slices/departmentSlice';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const shiftTypes = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'night', label: 'Night' },
  { value: 'emergency', label: 'Emergency' },
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

export default function ShiftManagement() {
  const dispatch = useDispatch();
  const { list: shifts = [], loading: shiftsLoading, error: shiftsError } = useSelector((state) => state.shifts || {});
  // Get departments from Redux store with proper initialization
  const departmentsState = useSelector((state) => state.departments);
  
  // Safely extract departments with fallbacks
  const departments = Array.isArray(departmentsState?.list) ? departmentsState.list : [];
  const departmentsLoading = departmentsState?.loading || false;
  const departmentsError = departmentsState?.error || null;
  
  console.log('Departments state:', {
    departments,
    loading: departmentsLoading,
    error: departmentsError
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [view, setView] = useState('table'); // 'table' or 'calendar'
  
  const [newShift, setNewShift] = useState(() => {
    // Initialize with default values including department_id as empty string
    return {
      name: '',
      department_id: '',
      shift_type: 'morning', // Default to morning shift
      start_time: new Date(),
      end_time: new Date(Date.now() + 8 * 60 * 60 * 1000), // Default 8 hour shift
      required_staff_count: 1,
      notes: ''
    };
  });

  // Fetch departments when component mounts
  useEffect(() => {
    console.log('Dispatching fetchDepartments...');
    dispatch(fetchDepartments())
      .then((result) => {
        console.log('fetchDepartments result:', result);
      })
      .catch((error) => {
        console.error('Error in fetchDepartments:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShift({ ...newShift, [name]: value });
  };

  const handleDateTimeChange = (name) => (date) => {
    setNewShift({ ...newShift, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createShift(newShift)).unwrap();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Shift created successfully!',
        severity: 'success'
      });
      // Reset form
      setNewShift({
        name: '',
        department_id: '',
        shift_type: '',
        start_time: new Date(),
        end_time: new Date(Date.now() + 8 * 60 * 60 * 1000),
        required_staff_count: 1,
        notes: ''
      });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Failed to create shift';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled': 
        return { 
          color: '#000000', 
          bgColor: '#f8f8f8', 
          borderColor: '#e0e0e0',
          label: 'Scheduled' 
        };
      case 'in_progress': 
        return { 
          color: '#666666', 
          bgColor: '#f0f0f0', 
          borderColor: '#cccccc',
          label: 'In Progress' 
        };
      case 'completed': 
        return { 
          color: '#999999', 
          bgColor: '#f5f5f5', 
          borderColor: '#d0d0d0',
          label: 'Completed' 
        };
      default: 
        return { 
          color: '#999999', 
          bgColor: '#f5f5f5', 
          borderColor: '#d0d0d0',
          label: status 
        };
    }
  };

  const formatTimeRange = (start, end) => {
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
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
              Shift Management
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
              Schedule and manage hospital shifts, staffing requirements, and coverage
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
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#000000',
                  fontSize: '18px',
                }}
              >
                {shifts.length} Active Shifts
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant={view === 'calendar' ? 'contained' : 'outlined'}
                startIcon={<CalendarMonthIcon sx={{ fontSize: 18 }} />}
                onClick={() => setView('calendar')}
                sx={{
                  borderColor: view === 'calendar' ? '#000000' : '#e0e0e0',
                  color: view === 'calendar' ? '#ffffff' : '#666666',
                  backgroundColor: view === 'calendar' ? '#000000' : '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: view === 'calendar' ? '#333333' : '#cccccc',
                    backgroundColor: view === 'calendar' ? '#333333' : '#f8f8f8',
                  },
                }}
              >
                Calendar View
              </Button>
              <Button
                variant={view === 'table' ? 'contained' : 'outlined'}
                startIcon={<TableRows sx={{ fontSize: 18 }} />}
                onClick={() => setView('table')}
                sx={{
                  borderColor: view === 'table' ? '#000000' : '#e0e0e0',
                  color: view === 'table' ? '#ffffff' : '#666666',
                  backgroundColor: view === 'table' ? '#000000' : '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: view === 'table' ? '#333333' : '#cccccc',
                    backgroundColor: view === 'table' ? '#333333' : '#f8f8f8',
                  },
                }}
              >
                Table View
              </Button>
              <Button
                variant="contained"
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#333333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Add Shift
              </Button>
            </Stack>
          </Box>

          {/* Content Area */}
          {view === 'table' ? (
            <Grow in timeout={500}>
              <Paper sx={{
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
              }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#fafafa' }}>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Shift Details
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Department
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Schedule
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 2,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shifts.map((shift, index) => {
                        const statusConfig = getStatusConfig(shift.status);
                        
                        return (
                          <TableRow 
                            key={shift.id} 
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f8f8f8',
                              },
                              borderBottom: '1px solid #f5f5f5',
                            }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{
                                  width: '40px',
                                  height: '40px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '10px',
                                  backgroundColor: '#f0f0f0',
                                  border: '1px solid #e0e0e0',
                                }}>
                                  <Schedule sx={{ fontSize: 20, color: '#666666' }} />
                                </Box>
                                <Box>
                                  <Typography sx={{ 
                                    fontWeight: 600,
                                    color: '#000000',
                                    fontSize: '14px',
                                    mb: 0.5,
                                  }}>
                                    {shift.name}
                                  </Typography>
                                  <Typography sx={{ 
                                    color: '#666666',
                                    fontSize: '12px',
                                    textTransform: 'capitalize',
                                  }}>
                                    {shift.shift_type} Shift
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Typography sx={{ 
                                fontSize: '14px',
                                color: '#666666',
                                fontWeight: 500,
                              }}>
                                {shift.department?.name || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}>
                                <AccessTime sx={{ fontSize: 16, color: '#666666' }} />
                                <Typography sx={{ 
                                  fontSize: '14px',
                                  color: '#000000',
                                  fontWeight: 500,
                                }}>
                                  {formatTimeRange(shift.start_time, shift.end_time)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={statusConfig.label}
                                size="small"
                                sx={{
                                  backgroundColor: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  border: `1px solid ${statusConfig.borderColor}`,
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  height: '28px',
                                  borderRadius: '8px',
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit Shift">
                                  <IconButton 
                                    size="small"
                                    sx={{
                                      width: '32px',
                                      height: '32px',
                                      backgroundColor: '#f8f8f8',
                                      color: '#666666',
                                      '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        color: '#000000',
                                      },
                                    }}
                                  >
                                    <Edit sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Assign Staff">
                                  <IconButton 
                                    size="small"
                                    sx={{
                                      width: '32px',
                                      height: '32px',
                                      backgroundColor: '#f8f8f8',
                                      color: '#666666',
                                      '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                        color: '#000000',
                                      },
                                    }}
                                  >
                                    <People sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grow>
          ) : (
            <Grow in timeout={500}>
              <Paper sx={{ 
                p: 4,
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}>
                <ShiftCalendar />
              </Paper>
            </Grow>
          )}

          {/* Add Shift Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            maxWidth="sm" 
            fullWidth
            scroll="body"
            PaperProps={{
              sx: {
                borderRadius: '20px',
                border: '1px solid #e5e5e5',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                overflow: 'hidden',
                maxHeight: '95vh',
                margin: '16px',
                width: 'calc(100% - 32px)',
              }
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <DialogTitle sx={{ 
                p: 0,
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 3,
                }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #e0e0e0',
                    }}>
                      <Schedule sx={{ fontSize: 24, color: '#000000' }} />
                    </Box>
                    <Box>
                      <Typography sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#000000',
                        lineHeight: 1.2,
                      }}>
                        Add New Shift
                      </Typography>
                      <Typography sx={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#666666',
                        mt: 0.5,
                      }}>
                        Create a new shift schedule and assign requirements
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton 
                    onClick={handleCloseDialog}
                    sx={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      color: '#666666',
                      '&:hover': {
                        backgroundColor: '#f8f8f8',
                        borderColor: '#cccccc',
                      },
                    }}
                  >
                    <Close sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </DialogTitle>

              <DialogContent sx={{ 
                p: 3,
                overflow: 'auto',
                maxHeight: 'calc(95vh - 180px)',
              }}>
                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                  <Grid item xs={12}>
                    <StyledTextField
                      required
                      name="name"
                      label="Shift Name"
                      value={newShift.name}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Enter a descriptive name for this shift"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <StyledSelect
                      name="department_id"
                      label="Department"
                      value={newShift.department_id || ''}
                      onChange={handleInputChange}
                      error={departmentsError}
                      disabled={departmentsLoading || departmentsError || departments.length === 0}
                    >
                      {departmentsLoading ? (
                        <MenuItem disabled>Loading departments...</MenuItem>
                      ) : departmentsError ? (
                        <MenuItem disabled>Error loading departments</MenuItem>
                      ) : departments.length > 0 ? (
                        [
                          <MenuItem key="select" value="" disabled>
                            Select a department
                          </MenuItem>,
                          ...departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </MenuItem>
                          ))
                        ]
                      ) : (
                        <MenuItem disabled>No departments available</MenuItem>
                      )}
                    </StyledSelect>
                    {departmentsError && (
                      <FormHelperText error sx={{ ml: 0, fontSize: '12px' }}>
                        {departmentsError}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledSelect
                      name="shift_type"
                      label="Shift Type"
                      value={newShift.shift_type}
                      onChange={handleInputChange}
                    >
                      {shiftTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Start Time"
                        value={newShift.start_time}
                        onChange={handleDateTimeChange('start_time')}
                        renderInput={(params) => (
                          <StyledTextField 
                            {...params} 
                            fullWidth 
                            required 
                            helperText="Select shift start date and time"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="End Time"
                        value={newShift.end_time}
                        onChange={handleDateTimeChange('end_time')}
                        minDateTime={newShift.start_time}
                        renderInput={(params) => (
                          <StyledTextField 
                            {...params} 
                            fullWidth 
                            required 
                            helperText="Select shift end date and time"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      required
                      name="required_staff_count"
                      label="Required Staff Count"
                      type="number"
                      value={newShift.required_staff_count}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{ min: 1 }}
                      helperText="Number of staff members needed"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <StyledTextField
                      name="notes"
                      label="Notes & Instructions"
                      value={newShift.notes}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      helperText="Add any special instructions or requirements"
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ 
                p: 3,
                pt: 2,
                borderTop: '1px solid #f0f0f0',
                justifyContent: 'flex-end',
              }}>
                <Stack direction="row" spacing={2}>
                  <Button 
                    onClick={handleCloseDialog}
                    sx={{
                      backgroundColor: '#f8f8f8',
                      color: '#666666',
                      borderRadius: '10px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: '#cccccc',
                        color: '#000000',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
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
                    }}
                  >
                    Create Shift
                  </Button>
                </Stack>
              </DialogActions>
            </form>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '& .MuiAlert-root': {
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              sx={{
                '& .MuiAlert-icon': {
                  fontSize: '20px',
                },
                '& .MuiAlert-message': {
                  fontWeight: 500,
                  fontSize: '14px',
                },
              }}
            >
              {typeof snackbar.message === 'string' 
                ? snackbar.message 
                : 'An error occurred. Please try again.'}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
}