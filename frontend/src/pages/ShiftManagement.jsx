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
  Alert
} from '@mui/material';
import { Add, Schedule, Close } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts, createShift } from '../store/slices/shiftSlice';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const formatTimeRange = (start, end) => {
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Shift Management
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<CalendarMonthIcon />} sx={{ mr: 2 }}>
            Calendar View
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            Add Shift
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shift Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id} hover>
                <TableCell>{shift.name}</TableCell>
                <TableCell>{shift.department?.name || 'N/A'}</TableCell>
                <TableCell>{formatTimeRange(shift.start_time, shift.end_time)}</TableCell>
                <TableCell>
                  <Chip 
                    label={shift.status}
                    color={getStatusColor(shift.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                  <Button size="small">Assign Staff</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Shift Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <span>Add New Shift</span>
              <Button onClick={handleCloseDialog} color="inherit">
                <Close />
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box display="grid" gap={2} mt={1}>
              <TextField
                required
                name="name"
                label="Shift Name"
                value={newShift.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  name="department_id"
                  value={newShift.department_id || ''}
                  onChange={handleInputChange}
                  labelId="department-select-label"
                  label="Department"
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
                </Select>
                {departmentsError && (
                  <FormHelperText error>{departmentsError}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Shift Type</InputLabel>
                <Select
                  name="shift_type"
                  value={newShift.shift_type}
                  onChange={handleInputChange}
                  label="Shift Type"
                >
                  {shiftTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Time"
                  value={newShift.start_time}
                  onChange={handleDateTimeChange('start_time')}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required />
                  )}
                />
                <DateTimePicker
                  label="End Time"
                  value={newShift.end_time}
                  onChange={handleDateTimeChange('end_time')}
                  minDateTime={newShift.start_time}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required />
                  )}
                />
              </LocalizationProvider>

              <TextField
                required
                name="required_staff_count"
                label="Required Staff Count"
                type="number"
                value={newShift.required_staff_count}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 1 }}
              />

              <TextField
                name="notes"
                label="Notes"
                value={newShift.notes}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Shift
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {typeof snackbar.message === 'string' 
            ? snackbar.message 
            : 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
