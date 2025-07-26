import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Person,
  Schedule,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { shiftsAPI } from '../../services/api';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import StaffAssignmentDialog from './StaffAssignmentDialog';

export default function ShiftCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek)
  });

  useEffect(() => {
    loadShifts();
  }, [currentWeek]);

  const loadShifts = async () => {
    try {
      const startDate = startOfWeek(currentWeek);
      const endDate = endOfWeek(currentWeek);
      
      const response = await shiftsAPI.getAll({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });
      
      setShifts(response.data);
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const shiftId = parseInt(draggableId.split('-')[1]);
    const newDate = new Date(destination.droppableId);

    try {
      // Update shift date
      await shiftsAPI.update(shiftId, {
        start_time: format(newDate, 'yyyy-MM-dd HH:mm:ss')
      });
      
      // Reload shifts
      loadShifts();
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const getShiftsForDay = (day) => {
    return shifts.filter(shift => 
      format(new Date(shift.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const getShiftColor = (shift) => {
    switch (shift.status) {
      case 'scheduled': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleShiftClick = (shift) => {
    setSelectedShift(shift);
    setShowShiftDialog(true);
  };

  const handleAssignStaff = (shift) => {
    setSelectedShift(shift);
    setShowAssignmentDialog(true);
  };

  const handleMenuClick = (event, shift) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedShift(shift);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedShift(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Week of {format(startOfWeek(currentWeek), 'MMM d, yyyy')}
        </Typography>
        <Box>
          <Button
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentWeek(new Date())}
            sx={{ mr: 1 }}
          >
            Today
          </Button>
          <Button
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            sx={{ mr: 2 }}
          >
            Next
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowShiftDialog(true)}
          >
            Add Shift
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={1}>
          {weekDays.map((day) => (
            <Grid item xs key={day.toISOString()}>
              <Paper sx={{ p: 1, minHeight: '400px' }}>
                <Typography variant="subtitle2" gutterBottom align="center">
                  {format(day, 'EEE')}
                </Typography>
                <Typography variant="caption" align="center" display="block" mb={1}>
                  {format(day, 'MMM d')}
                </Typography>
                
                <Droppable droppableId={day.toISOString()}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: '300px',
                        backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                        borderRadius: 1,
                        p: 0.5,
                      }}
                    >
                      {getShiftsForDay(day).map((shift, index) => (
                        <Draggable
                          key={shift.id}
                          draggableId={`shift-${shift.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 1,
                                mb: 1,
                                cursor: 'pointer',
                                backgroundColor: snapshot.isDragging ? 'action.selected' : 'background.paper',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                              onClick={() => handleShiftClick(shift)}
                            >
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {shift.name}
                                  </Typography>
                                  <Typography variant="caption" display="block">
                                    {format(new Date(shift.start_time), 'HH:mm')} - 
                                    {format(new Date(shift.end_time), 'HH:mm')}
                                  </Typography>
                                  <Box display="flex" alignItems="center" mt={0.5}>
                                    <Person fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="caption">
                                      {shift.assignments?.length || 0}/{shift.required_staff_count}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box>
                                  <Chip
                                    label={shift.status}
                                    size="small"
                                    color={getShiftColor(shift)}
                                    sx={{ mb: 0.5 }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuClick(e, shift)}
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleAssignStaff(selectedShift);
          handleMenuClose();
        }}>
          <Person sx={{ mr: 1 }} />
          Assign Staff
        </MenuItem>
        <MenuItem onClick={() => {
          setShowShiftDialog(true);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit Shift
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} />
          Delete Shift
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ShiftDetailsDialog
        open={showShiftDialog}
        shift={selectedShift}
        onClose={() => {
          setShowShiftDialog(false);
          setSelectedShift(null);
        }}
        onSave={loadShifts}
      />

      <StaffAssignmentDialog
        open={showAssignmentDialog}
        shift={selectedShift}
        onClose={() => {
          setShowAssignmentDialog(false);
          setSelectedShift(null);
        }}
        onSave={loadShifts}
      />
    </Box>
  );
}