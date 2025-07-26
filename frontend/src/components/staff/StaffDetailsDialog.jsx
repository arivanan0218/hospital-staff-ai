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
                Hourly Rate: /hr
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
