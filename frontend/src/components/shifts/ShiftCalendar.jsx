// import React, { useState, useEffect } from 'react';
// import {
//   Paper,
//   Typography,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Chip,
//   IconButton,
//   Tooltip,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import {
//   Add,
//   Edit,
//   Delete,
//   MoreVert,
//   Person,
//   Schedule,
// } from '@mui/icons-material';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchShifts } from '../../store/slices/shiftSlice';
// import ShiftDetailsDialog from './ShiftDetailsDialog';
// import StaffAssignmentDialog from './StaffAssignmentDialog';

// export default function ShiftCalendar() {
//   const [currentWeek, setCurrentWeek] = useState(new Date());
//   const { list: shifts = [], loading, error } = useSelector((state) => state.shifts || {});
//   const [selectedShift, setSelectedShift] = useState(null);
//   const [showShiftDialog, setShowShiftDialog] = useState(false);
//   const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const dispatch = useDispatch();

//   const weekDays = eachDayOfInterval({
//     start: startOfWeek(currentWeek),
//     end: endOfWeek(currentWeek)
//   });

//   useEffect(() => {
//     const startDate = startOfWeek(currentWeek);
//     const endDate = endOfWeek(currentWeek);
    
//     dispatch(fetchShifts({
//       start_date: startDate.toISOString(),
//       end_date: endDate.toISOString()
//     }));
//   }, [currentWeek, dispatch]);

//   const handleDragEnd = async (result) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     const shiftId = parseInt(draggableId.split('-')[1]);
//     const newDate = new Date(destination.droppableId);

//     try {
//       // TODO: Implement shift update logic with Redux
//       console.log(`Shift ${shiftId} moved to ${newDate}`);
      
//       // For now, just refetch the shifts
//       const startDate = startOfWeek(currentWeek);
//       const endDate = endOfWeek(currentWeek);
      
//       dispatch(fetchShifts({
//         start_date: startDate.toISOString(),
//         end_date: endDate.toISOString()
//       }));
//     } catch (error) {
//       console.error('Error updating shift:', error);
//     }
//   };

//   const getShiftsForDay = (day) => {
//     return shifts.filter(shift => 
//       format(new Date(shift.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
//     );
//   };

//   const getShiftColor = (shift) => {
//     switch (shift.status) {
//       case 'scheduled': return 'primary';
//       case 'in_progress': return 'success';
//       case 'completed': return 'default';
//       case 'cancelled': return 'error';
//       default: return 'default';
//     }
//   };

//   const handleShiftClick = (shift) => {
//     setSelectedShift(shift);
//     setShowShiftDialog(true);
//   };

//   const handleAssignStaff = (shift) => {
//     setSelectedShift(shift);
//     setShowAssignmentDialog(true);
//   };

//   const handleMenuClick = (event, shift) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//     setSelectedShift(shift);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedShift(null);
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h6">
//           Week of {format(startOfWeek(currentWeek), 'MMM d, yyyy')}
//         </Typography>
//         <Box>
//           <Button
//             onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
//             sx={{ mr: 1 }}
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={() => setCurrentWeek(new Date())}
//             sx={{ mr: 1 }}
//           >
//             Today
//           </Button>
//           <Button
//             onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
//             sx={{ mr: 2 }}
//           >
//             Next
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setShowShiftDialog(true)}
//           >
//             Add Shift
//           </Button>
//         </Box>
//       </Box>

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Grid container spacing={1}>
//           {weekDays.map((day) => (
//             <Grid item xs key={day.toISOString()}>
//               <Paper sx={{ p: 1, minHeight: '400px' }}>
//                 <Typography variant="subtitle2" gutterBottom align="center">
//                   {format(day, 'EEE')}
//                 </Typography>
//                 <Typography variant="caption" align="center" display="block" mb={1}>
//                   {format(day, 'MMM d')}
//                 </Typography>
                
//                 <Droppable droppableId={day.toISOString()}>
//                   {(provided, snapshot) => (
//                     <Box
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       sx={{
//                         minHeight: '300px',
//                         backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
//                         borderRadius: 1,
//                         p: 0.5,
//                       }}
//                     >
//                       {getShiftsForDay(day).map((shift, index) => (
//                         <Draggable
//                           key={shift.id}
//                           draggableId={`shift-${shift.id}`}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <Paper
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               sx={{
//                                 p: 1,
//                                 mb: 1,
//                                 cursor: 'pointer',
//                                 backgroundColor: snapshot.isDragging ? 'action.selected' : 'background.paper',
//                                 '&:hover': {
//                                   backgroundColor: 'action.hover',
//                                 },
//                               }}
//                               onClick={() => handleShiftClick(shift)}
//                             >
//                               <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//                                 <Box sx={{ flex: 1 }}>
//                                   <Typography variant="body2" fontWeight="bold">
//                                     {shift.name}
//                                   </Typography>
//                                   <Typography variant="caption" display="block">
//                                     {format(new Date(shift.start_time), 'HH:mm')} - 
//                                     {format(new Date(shift.end_time), 'HH:mm')}
//                                   </Typography>
//                                   <Box display="flex" alignItems="center" mt={0.5}>
//                                     <Person fontSize="small" sx={{ mr: 0.5 }} />
//                                     <Typography variant="caption">
//                                       {shift.assignments?.length || 0}/{shift.required_staff_count}
//                                     </Typography>
//                                   </Box>
//                                 </Box>
                                
//                                 <Box>
//                                   <Chip
//                                     label={shift.status}
//                                     size="small"
//                                     color={getShiftColor(shift)}
//                                     sx={{ mb: 0.5 }}
//                                   />
//                                   <IconButton
//                                     size="small"
//                                     onClick={(e) => handleMenuClick(e, shift)}
//                                   >
//                                     <MoreVert fontSize="small" />
//                                   </IconButton>
//                                 </Box>
//                               </Box>
//                             </Paper>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </Box>
//                   )}
//                 </Droppable>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </DragDropContext>

//       {/* Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={() => {
//           handleAssignStaff(selectedShift);
//           handleMenuClose();
//         }}>
//           <Person sx={{ mr: 1 }} />
//           Assign Staff
//         </MenuItem>
//         <MenuItem onClick={() => {
//           setShowShiftDialog(true);
//           handleMenuClose();
//         }}>
//           <Edit sx={{ mr: 1 }} />
//           Edit Shift
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <Delete sx={{ mr: 1 }} />
//           Delete Shift
//         </MenuItem>
//       </Menu>

//       {/* Dialogs */}
//       <ShiftDetailsDialog
//         open={showShiftDialog}
//         shift={selectedShift}
//         onClose={() => {
//           setShowShiftDialog(false);
//           setSelectedShift(null);
//         }}
//         onSave={() => {
//           const startDate = startOfWeek(currentWeek);
//           const endDate = endOfWeek(currentWeek);
//           dispatch(fetchShifts({
//             start_date: startDate.toISOString(),
//             end_date: endDate.toISOString()
//           }));
//           setShowShiftDialog(false);
//           setSelectedShift(null);
//         }}
//       />

//       <StaffAssignmentDialog
//         open={showAssignmentDialog}
//         shift={selectedShift}
//         onClose={() => {
//           setShowAssignmentDialog(false);
//           setSelectedShift(null);
//         }}
//         onSave={() => {
//           const startDate = startOfWeek(currentWeek);
//           const endDate = endOfWeek(currentWeek);
//           dispatch(fetchShifts({
//             start_date: startDate.toISOString(),
//             end_date: endDate.toISOString()
//           }));
//           setShowAssignmentDialog(false);
//           setSelectedShift(null);
//         }}
//       />
//     </Box>
//   );
// }


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
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Person,
  Schedule,
  ChevronLeft,
  ChevronRight,
  Today,
  AccessTime,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts } from '../../store/slices/shiftSlice';
import ShiftDetailsDialog from './ShiftDetailsDialog';
import StaffAssignmentDialog from './StaffAssignmentDialog';

export default function ShiftCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { list: shifts = [], loading, error } = useSelector((state) => state.shifts || {});
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
    const startDate = startOfWeek(currentWeek);
    const endDate = endOfWeek(currentWeek);
    
    dispatch(fetchShifts({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    }));
  }, [currentWeek, dispatch]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const shiftId = parseInt(draggableId.split('-')[1]);
    const newDate = new Date(destination.droppableId);

    try {
      // TODO: Implement shift update logic with Redux
      console.log(`Shift ${shiftId} moved to ${newDate}`);
      
      // For now, just refetch the shifts
      const startDate = startOfWeek(currentWeek);
      const endDate = endOfWeek(currentWeek);
      
      dispatch(fetchShifts({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      }));
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const getShiftsForDay = (day) => {
    return shifts.filter(shift => 
      format(new Date(shift.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
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
      case 'cancelled': 
        return { 
          color: '#d32f2f', 
          bgColor: '#ffebee', 
          borderColor: '#ffcdd2',
          label: 'Cancelled' 
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

  const isToday = (date) => {
    const today = new Date();
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#000000',
            fontSize: { xs: '18px', sm: '20px' },
          }}
        >
          Week of {format(startOfWeek(currentWeek), 'MMM d, yyyy')}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            sx={{
              color: '#666666',
              backgroundColor: '#f8f8f8',
              borderRadius: '10px',
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              border: '1px solid #e0e0e0',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#cccccc',
                color: '#000000',
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: 18 }} />
          </Button>
          
          <Button
            onClick={() => setCurrentWeek(new Date())}
            sx={{
              color: '#666666',
              backgroundColor: '#f8f8f8',
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              border: '1px solid #e0e0e0',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#cccccc',
                color: '#000000',
              },
            }}
          >
            <Today sx={{ fontSize: 16, mr: 1 }} />
            Today
          </Button>
          
          <Button
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            sx={{
              color: '#666666',
              backgroundColor: '#f8f8f8',
              borderRadius: '10px',
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              border: '1px solid #e0e0e0',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#f0f0f0',
                borderColor: '#cccccc',
                color: '#000000',
              },
            }}
          >
            <ChevronRight sx={{ fontSize: 18 }} />
          </Button>
          
          {/* <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            onClick={() => setShowShiftDialog(true)}
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
          </Button> */}
        </Stack>
      </Box>

      {/* Calendar Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {weekDays.map((day, dayIndex) => (
            <Grid item xs={12} sm={6} md key={day.toISOString()}>
              <Fade in timeout={300 + dayIndex * 50}>
                <Paper sx={{
                  p: 3,
                  minHeight: '450px',
                  borderRadius: '16px',
                  border: isToday(day) ? '2px solid #000000' : '1px solid #e5e5e5',
                  backgroundColor: isToday(day) ? '#fafafa' : '#ffffff',
                  boxShadow: isToday(day) ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease-in-out',
                }}>
                  {/* Day Header */}
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography sx={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isToday(day) ? '#000000' : '#666666',
                      mb: 0.5,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {format(day, 'EEE')}
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isToday(day) ? '#000000' : '#999999',
                    }}>
                      {format(day, 'MMM d')}
                    </Typography>
                    {isToday(day) && (
                      <Box sx={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#000000',
                        borderRadius: '50%',
                        mx: 'auto',
                        mt: 1,
                      }} />
                    )}
                  </Box>
                  
                  {/* Droppable Area */}
                  <Droppable droppableId={day.toISOString()}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: '350px',
                          backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                          borderRadius: '12px',
                          border: snapshot.isDraggingOver ? '2px dashed #cccccc' : '2px dashed transparent',
                          p: 1,
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {/* Shift Cards */}
                        {getShiftsForDay(day).map((shift, index) => {
                          const statusConfig = getStatusConfig(shift.status);
                          
                          return (
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
                                    p: 2.5,
                                    mb: 2,
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    border: '1px solid #f0f0f0',
                                    backgroundColor: snapshot.isDragging ? '#f8f8f8' : '#ffffff',
                                    boxShadow: snapshot.isDragging 
                                      ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                                    transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                    transition: snapshot.isDragging ? 'none' : 'all 0.2s ease-in-out',
                                    '&:hover': {
                                      backgroundColor: '#f8f8f8',
                                      borderColor: '#e0e0e0',
                                      transform: snapshot.isDragging ? 'rotate(2deg)' : 'translateY(-1px)',
                                      boxShadow: snapshot.isDragging 
                                        ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                                        : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    },
                                  }}
                                  onClick={() => handleShiftClick(shift)}
                                >
                                  {/* Shift Header */}
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-start',
                                    mb: 2,
                                  }}>
                                    <Box sx={{ flex: 1, mr: 1 }}>
                                      <Typography sx={{
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#000000',
                                        mb: 0.5,
                                        lineHeight: 1.3,
                                      }}>
                                        {shift.name}
                                      </Typography>
                                      <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}>
                                        <AccessTime sx={{ fontSize: 14, color: '#666666' }} />
                                        <Typography sx={{
                                          fontSize: '12px',
                                          color: '#666666',
                                          fontWeight: 500,
                                        }}>
                                          {format(new Date(shift.start_time), 'HH:mm')} - 
                                          {format(new Date(shift.end_time), 'HH:mm')}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                      <Chip
                                        label={statusConfig.label}
                                        size="small"
                                        sx={{
                                          backgroundColor: statusConfig.bgColor,
                                          color: statusConfig.color,
                                          border: `1px solid ${statusConfig.borderColor}`,
                                          fontWeight: 600,
                                          fontSize: '10px',
                                          height: '24px',
                                          borderRadius: '6px',
                                        }}
                                      />
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuClick(e, shift)}
                                        sx={{
                                          width: '24px',
                                          height: '24px',
                                          backgroundColor: '#f0f0f0',
                                          color: '#666666',
                                          '&:hover': {
                                            backgroundColor: '#e0e0e0',
                                            color: '#000000',
                                          },
                                        }}
                                      >
                                        <MoreVert sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                  
                                  {/* Staff Information */}
                                  <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1.5,
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0',
                                  }}>
                                    <Person sx={{ fontSize: 16, color: '#666666' }} />
                                    <Typography sx={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: '#666666',
                                    }}>
                                      Staff Assigned:
                                    </Typography>
                                    <Typography sx={{
                                      fontSize: '12px',
                                      fontWeight: 700,
                                      color: '#000000',
                                    }}>
                                      {shift.assignments?.length || 0}/{shift.required_staff_count}
                                    </Typography>
                                  </Box>
                                </Paper>
                              )}
                            </Draggable>
                          );
                        })}
                        
                        {/* Empty State */}
                        {getShiftsForDay(day).length === 0 && (
                          <Box sx={{
                            height: '300px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#cccccc',
                            textAlign: 'center',
                          }}>
                            <Box>
                              <Schedule sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                              <Typography sx={{
                                fontSize: '13px',
                                fontWeight: 500,
                                opacity: 0.7,
                              }}>
                                No shifts scheduled
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            mt: 1,
            minWidth: '180px',
          },
        }}
      >
        <MenuItem 
          onClick={() => {
            handleAssignStaff(selectedShift);
            handleMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: '#f8f8f8',
            },
          }}
        >
          <Person sx={{ mr: 2, fontSize: 18, color: '#666666' }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            Assign Staff
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            setShowShiftDialog(true);
            handleMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: '#f8f8f8',
            },
          }}
        >
          <Edit sx={{ mr: 2, fontSize: 18, color: '#666666' }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            Edit Shift
          </Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleMenuClose}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: '#f8f8f8',
            },
          }}
        >
          <Delete sx={{ mr: 2, fontSize: 18, color: '#666666' }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
            Delete Shift
          </Typography>
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
        onSave={() => {
          const startDate = startOfWeek(currentWeek);
          const endDate = endOfWeek(currentWeek);
          dispatch(fetchShifts({
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
          }));
          setShowShiftDialog(false);
          setSelectedShift(null);
        }}
      />

      <StaffAssignmentDialog
        open={showAssignmentDialog}
        shift={selectedShift}
        onClose={() => {
          setShowAssignmentDialog(false);
          setSelectedShift(null);
        }}
        onSave={() => {
          const startDate = startOfWeek(currentWeek);
          const endDate = endOfWeek(currentWeek);
          dispatch(fetchShifts({
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
          }));
          setShowAssignmentDialog(false);
          setSelectedShift(null);
        }}
      />
    </Box>
  );
}