import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const shiftTypes = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'night', label: 'Night' },
  { value: 'emergency', label: 'Emergency' },
];

export default function ShiftDetailsDialog({ open, shift, onClose, onSave }) {
  const isNew = !shift?.id;
  const [editedShift, setEditedShift] = React.useState(shift || {});

  React.useEffect(() => {
    if (shift) {
      setEditedShift(shift);
    } else {
      setEditedShift({
        name: '',
        department_id: '',
        shift_type: 'morning',
        start_time: new Date(),
        end_time: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours later
        required_staff_count: 1,
        notes: '',
        status: 'scheduled'
      });
    }
  }, [shift, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedShift(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (field) => (newValue) => {
    setEditedShift(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedShift);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isNew ? 'Add New Shift' : 'Edit Shift Details'}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gap={2} mt={1}>
            <TextField
              required
              name="name"
              label="Shift Name"
              value={editedShift.name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Shift Type</InputLabel>
              <Select
                name="shift_type"
                value={editedShift.shift_type || 'morning'}
                onChange={handleChange}
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
                value={editedShift.start_time ? new Date(editedShift.start_time) : null}
                onChange={handleDateTimeChange('start_time')}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
              <DateTimePicker
                label="End Time"
                value={editedShift.end_time ? new Date(editedShift.end_time) : null}
                onChange={handleDateTimeChange('end_time')}
                minDateTime={editedShift.start_time ? new Date(editedShift.start_time) : null}
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
              value={editedShift.required_staff_count || 1}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />

            <TextField
              name="notes"
              label="Notes"
              value={editedShift.notes || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            {!isNew && (
              <Box mt={2}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Status: <Chip 
                    label={editedShift.status || 'scheduled'} 
                    size="small" 
                    color={
                      editedShift.status === 'completed' ? 'success' : 
                      editedShift.status === 'cancelled' ? 'error' : 
                      'default'
                    }
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Created: {new Date(editedShift.created_at).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isNew ? 'Create Shift' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
