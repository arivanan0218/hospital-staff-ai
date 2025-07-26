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
              secondary={`${allocation.staff} staff assigned`}
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
