# Run this script from the frontend directory
# Save as create_missing_files.ps1 and run: powershell -ExecutionPolicy Bypass -File create_missing_files.ps1

Write-Host "🚀 Creating missing frontend files..." -ForegroundColor Green

# Create directories
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
$directories = @(
    "src/store/slices",
    "src/components/common",
    "src/components/dashboard", 
    "src/components/staff",
    "src/components/shifts",
    "src/components/allocation",
    "src/components/attendance",
    "src/pages"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "✅ Created $dir" -ForegroundColor Green
}

# Create Redux slices
Write-Host "`n🗄️ Creating Redux slices..." -ForegroundColor Yellow

# shiftSlice.js
@"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async () => {
    return [];
  }
);

const shiftSlice = createSlice({
  name: 'shifts',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateShiftRealtime: (state, action) => {
      const updatedShift = action.payload;
      const index = state.list.findIndex(shift => shift.id === updatedShift.id);
      if (index !== -1) {
        state.list[index] = updatedShift;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateShiftRealtime } = shiftSlice.actions;
export default shiftSlice.reducer;
"@ | Set-Content "src/store/slices/shiftSlice.js"

# allocationSlice.js
@"
import { createSlice } from '@reduxjs/toolkit';

const allocationSlice = createSlice({
  name: 'allocation',
  initialState: {
    allocations: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = allocationSlice.actions;
export default allocationSlice.reducer;
"@ | Set-Content "src/store/slices/allocationSlice.js"

# dashboardSlice.js
@"
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: {},
    notifications: [],
    loading: false,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addRealtimeNotification, clearNotifications } = dashboardSlice.actions;
export default dashboardSlice.reducer;
"@ | Set-Content "src/store/slices/dashboardSlice.js"

Write-Host "✅ Created Redux slices" -ForegroundColor Green

# Create components
Write-Host "`n🧩 Creating components..." -ForegroundColor Yellow

# ConnectionStatus.jsx
@"
import React from 'react';
import { Chip } from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';

export default function ConnectionStatus({ connected }) {
  return (
    <Chip
      icon={connected ? <Wifi /> : <WifiOff />}
      label={connected ? 'Connected' : 'Disconnected'}
      color={connected ? 'success' : 'error'}
      size="small"
      variant="outlined"
      sx={{ mr: 2 }}
    />
  );
}
"@ | Set-Content "src/components/common/ConnectionStatus.jsx"

# AllocationSummary.jsx
@"
import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText, Chip } from '@mui/material';

export default function AllocationSummary() {
  const recentAllocations = [
    { id: 1, shift: 'Morning Shift', staff: 3, status: 'completed' },
    { id: 2, shift: 'Afternoon Shift', staff: 2, status: 'pending' },
    { id: 3, shift: 'Night Shift', staff: 4, status: 'completed' },
  ];

  return (
    <Paper sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        Recent Allocations
      </Typography>
      <List>
        {recentAllocations.map((allocation) => (
          <ListItem key={allocation.id} divider>
            <ListItemText
              primary={allocation.shift}
              secondary={`{allocation.staff} staff assigned`}
            />
            <Chip
              label={allocation.status}
              color={allocation.status === 'completed' ? 'success' : 'warning'}
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
"@ | Set-Content "src/components/dashboard/AllocationSummary.jsx"

# StaffDetailsDialog.jsx
@"
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import { Person, Email, Phone, Work } from '@mui/icons-material';

export default function StaffDetailsDialog({ open, staff, onClose }) {
  if (!staff) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Person sx={{ mr: 1 }} />
          Staff Details
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {staff.first_name} {staff.last_name}
            </Typography>
            <Chip label={staff.role} color="primary" />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ mr: 1 }} />
              <Typography>{staff.email}</Typography>
            </Box>
          </Grid>
          
          {staff.phone && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone sx={{ mr: 1 }} />
                <Typography>{staff.phone}</Typography>
              </Box>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <Work sx={{ mr: 1 }} />
              <Typography>Employee ID: {staff.employee_id}</Typography>
            </Box>
          </Grid>
          
          {staff.hourly_rate && (
            <Grid item xs={12}>
              <Typography variant="body2">
                Hourly Rate: ${staff.hourly_rate}/hr
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
"@ | Set-Content "src/components/staff/StaffDetailsDialog.jsx"

# AllocationScenarioRunner.jsx
@"
import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Box 
} from '@mui/material';

export default function AllocationScenarioRunner({ open, onClose, availableShifts }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Allocation Scenario Runner</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Scenario Analysis
          </Typography>
          <Typography>
            Compare different allocation strategies and scenarios.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This feature will allow you to run multiple allocation scenarios
            and compare their effectiveness, cost, and staff satisfaction.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
"@ | Set-Content "src/components/allocation/AllocationScenarioRunner.jsx"

# AllocationResults.jsx
@"
import React from 'react';
import { Box, Typography, Paper, Button, Grid, Chip } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';

export default function AllocationResults({ result, onApply }) {
  if (!result) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No allocation results to display</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        AI Allocation Results
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">
            Confidence Score
          </Typography>
          <Typography variant="h5" color="primary">
            {((result.confidence_score || 0) * 100).toFixed(1)}%
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">
            Status
          </Typography>
          <Chip
            icon={result.success ? <CheckCircle /> : <Warning />}
            label={result.success ? 'Success' : 'Has Issues'}
            color={result.success ? 'success' : 'warning'}
          />
        </Grid>
      </Grid>

      <Typography variant="body1" gutterBottom>
        Shifts Processed: {result.shifts_processed || 0}
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Staff Considered: {result.staff_considered || 0}
      </Typography>

      {result.success && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="success"
            onClick={onApply}
            size="large"
          >
            Apply This Allocation
          </Button>
        </Box>
      )}
    </Paper>
  );
}
"@ | Set-Content "src/components/allocation/AllocationResults.jsx"

# ConstraintViolationsList.jsx
@"
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography, 
  Paper,
  Chip 
} from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';

export default function ConstraintViolationsList({ violations = [] }) {
  const getIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Constraint Violations
      </Typography>
      
      {violations.length === 0 ? (
        <Typography color="success.main">
          ✅ No constraint violations found
        </Typography>
      ) : (
        <List>
          {violations.map((violation, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                {getIcon(violation.severity)}
              </ListItemIcon>
              <ListItemText
                primary={violation.description}
                secondary={violation.suggested_fix}
              />
              <Chip 
                label={violation.severity}
                color={getColor(violation.severity)}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
"@ | Set-Content "src/components/allocation/ConstraintViolationsList.jsx"

Write-Host "✅ Created components" -ForegroundColor Green

# Create pages
Write-Host "`n📄 Creating pages..." -ForegroundColor Yellow

# ShiftManagement.jsx
@"
import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { Add, Calendar, Schedule } from '@mui/icons-material';

export default function ShiftManagement() {
  const [shifts] = useState([
    { id: 1, name: 'Morning Shift', department: 'Emergency', time: '07:00 - 15:00', status: 'scheduled' },
    { id: 2, name: 'Afternoon Shift', department: 'ICU', time: '15:00 - 23:00', status: 'in_progress' },
    { id: 3, name: 'Night Shift', department: 'Emergency', time: '23:00 - 07:00', status: 'scheduled' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Shift Management
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Calendar />} sx={{ mr: 2 }}>
            Calendar View
          </Button>
          <Button variant="contained" startIcon={<Add />}>
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
                <TableCell>{shift.department}</TableCell>
                <TableCell>{shift.time}</TableCell>
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
    </Box>
  );
}
"@ | Set-Content "src/pages/ShiftManagement.jsx"

# AttendanceManagement.jsx
@"
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent 
} from '@mui/material';
import { Assignment, AccessTime, People } from '@mui/icons-material';

export default function AttendanceManagement() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
        Attendance Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Staff Present Today
                  </Typography>
                  <Typography variant="h5">
                    23/30
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTime color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average Hours
                  </Typography>
                  <Typography variant="h5">
                    7.5h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          Attendance tracking features will be available soon, including:
        </Typography>
        <ul>
          <li>Clock in/out functionality</li>
          <li>Break time tracking</li>
          <li>Overtime calculations</li>
          <li>Absence management</li>
          <li>Attendance reports</li>
        </ul>
      </Paper>
    </Box>
  );
}
"@ | Set-Content "src/pages/AttendanceManagement.jsx"

Write-Host "✅ Created pages" -ForegroundColor Green

Write-Host "`n🎉 All missing files created successfully!" -ForegroundColor Green
Write-Host "✨ Your frontend should now start without errors!" -ForegroundColor Cyan