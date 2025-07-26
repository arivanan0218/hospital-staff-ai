import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { shiftsAPI } from '../services/api';

export default function ShiftAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // First get all shifts
        const shiftsResponse = await shiftsAPI.getAll();
        const allShifts = shiftsResponse.data || [];
        
        // Then get assignments for each shift
        const allAssignments = [];
        
        for (const shift of allShifts) {
          try {
            const assignmentsResponse = await shiftsAPI.getAssignments(shift.id);
            if (assignmentsResponse.data && Array.isArray(assignmentsResponse.data)) {
              allAssignments.push({
                shift_id: shift.id,
                shift_name: shift.name || `Shift ${shift.id}`,
                date: shift.date,
                start_time: shift.start_time,
                end_time: shift.end_time,
                assignments: assignmentsResponse.data
              });
            }
          } catch (err) {
            console.error(`Error fetching assignments for shift ${shift.id}:`, err);
          }
        }
        
        setAssignments(allAssignments);
        setError(null);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load shift assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shift Assignments
      </Typography>
      
      {assignments.length === 0 ? (
        <Alert severity="info">No shift assignments found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shift</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Assigned Staff</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((shift) => (
                <React.Fragment key={shift.shift_id}>
                  {shift.assignments.length > 0 ? (
                    shift.assignments.map((assignment, index) => (
                      <TableRow key={`${shift.shift_id}-${index}`}>
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={shift.assignments.length}>
                              {shift.shift_name}
                            </TableCell>
                            <TableCell rowSpan={shift.assignments.length}>
                              {new Date(shift.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell rowSpan={shift.assignments.length}>
                              {shift.start_time} - {shift.end_time}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          Staff #{assignment.staff_id}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={assignment.status || 'Assigned'} 
                            color={assignment.status === 'completed' ? 'success' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>{shift.shift_name}</TableCell>
                      <TableCell>{new Date(shift.date).toLocaleDateString()}</TableCell>
                      <TableCell>{shift.start_time} - {shift.end_time}</TableCell>
                      <TableCell colSpan={2} align="center">
                        <Typography color="textSecondary">No assignments</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
