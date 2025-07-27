import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Divider,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { Person, Close, Add, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

const skills = [
  'Nursing',
  'Emergency',
  'Surgery',
  'Pediatrics',
  'Cardiology',
  'Radiology',
  'Pharmacy',
  'Laboratory'
];

export default function StaffAssignmentDialog({ open, shift, onClose, onSave }) {
  const dispatch = useDispatch();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock staff data - replace with actual API call
  const mockStaff = [
    { id: 1, name: 'Dr. Smith', role: 'Doctor', skills: ['Surgery', 'Emergency'] },
    { id: 2, name: 'Nurse Johnson', role: 'Nurse', skills: ['Nursing', 'Pediatrics'] },
    { id: 3, name: 'Dr. Lee', role: 'Doctor', skills: ['Cardiology'] },
    { id: 4, name: 'Nurse Davis', role: 'Nurse', skills: ['Emergency', 'Nursing'] },
  ];

  useEffect(() => {
    if (open) {
      // In a real app, fetch staff list from API
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStaffList(mockStaff);
        setFilteredStaff(mockStaff);
        setLoading(false);
      }, 500);
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStaff(staffList);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = staffList.filter(
        staff => 
          staff.name.toLowerCase().includes(term) ||
          staff.role.toLowerCase().includes(term) ||
          staff.skills.some(skill => skill.toLowerCase().includes(term))
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staffList]);

  const handleAssignStaff = (staff) => {
    if (!shift.assignments.some(a => a.staff_id === staff.id)) {
      const newAssignment = {
        id: Date.now(), // Temporary ID
        staff_id: staff.id,
        staff_name: staff.name,
        role: staff.role,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      };
      
      onSave({
        ...shift,
        assignments: [...(shift.assignments || []), newAssignment]
      });
    }
  };

  const handleRemoveAssignment = (assignmentId) => {
    onSave({
      ...shift,
      assignments: (shift.assignments || []).filter(a => a.id !== assignmentId)
    });
  };

  const isStaffAssigned = (staffId) => {
    return (shift.assignments || []).some(a => a.staff_id === staffId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Assign Staff to Shift</span>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">
          {shift?.name} • {shift?.department?.name}
        </Typography>
        <Typography variant="body2">
          {shift?.start_time && new Date(shift.start_time).toLocaleString()} - 
          {shift?.end_time && new Date(shift.end_time).toLocaleString()}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Current Assignments ({shift?.assignments?.length || 0}/{shift?.required_staff_count || 0})
          </Typography>
          
          {shift?.assignments?.length > 0 ? (
            <List dense>
              {shift.assignments.map((assignment) => (
                <ListItem key={assignment.id} divider>
                  <Person color="primary" sx={{ mr: 1 }} />
                  <ListItemText
                    primary={assignment.staff_name}
                    secondary={`${assignment.role} • Assigned: ${new Date(assignment.assigned_at).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              No staff assigned to this shift yet.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Available Staff
          </Typography>
          
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search staff by name, role, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Person color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense>
              {filteredStaff.map((staff) => (
                <ListItem 
                  key={staff.id} 
                  button 
                  disabled={isStaffAssigned(staff.id)}
                  onClick={() => handleAssignStaff(staff)}
                  divider
                >
                  <ListItemText
                    primary={staff.name}
                    secondary={
                      <>
                        {staff.role}
                        <Box component="span" sx={{ ml: 1, '& > *': { mr: 0.5 } }}>
                          {staff.skills.map(skill => (
                            <Chip 
                              key={skill} 
                              label={skill} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                  {isStaffAssigned(staff.id) ? (
                    <Chip 
                      label="Assigned" 
                      size="small" 
                      color="success"
                      variant="outlined"
                    />
                  ) : (
                    <IconButton size="small" color="primary">
                      <Add />
                    </IconButton>
                  )}
                </ListItem>
              ))}
              
              {filteredStaff.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', p: 2 }}>
                  No staff members found matching your search.
                </Typography>
              )}
            </List>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
