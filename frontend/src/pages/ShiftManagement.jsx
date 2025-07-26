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
import { Add, Schedule } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
          <Button variant="outlined" startIcon={<CalendarMonthIcon />} sx={{ mr: 2 }}>
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
