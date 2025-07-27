// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow,
//   CircularProgress,
//   Alert,
//   Chip
// } from '@mui/material';
// import { shiftsAPI } from '../services/api';

// export default function ShiftAssignments() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         setLoading(true);
//         // First get all shifts
//         const shiftsResponse = await shiftsAPI.getAll();
//         const allShifts = shiftsResponse.data || [];
        
//         // Then get assignments for each shift
//         const allAssignments = [];
        
//         for (const shift of allShifts) {
//           try {
//             const assignmentsResponse = await shiftsAPI.getAssignments(shift.id);
//             if (assignmentsResponse.data && Array.isArray(assignmentsResponse.data)) {
//               allAssignments.push({
//                 shift_id: shift.id,
//                 shift_name: shift.name || `Shift ${shift.id}`,
//                 date: shift.date,
//                 start_time: shift.start_time,
//                 end_time: shift.end_time,
//                 assignments: assignmentsResponse.data
//               });
//             }
//           } catch (err) {
//             console.error(`Error fetching assignments for shift ${shift.id}:`, err);
//           }
//         }
        
//         setAssignments(allAssignments);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching assignments:', err);
//         setError('Failed to load shift assignments. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignments();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert severity="error" sx={{ mt: 2 }}>
//         {error}
//       </Alert>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Shift Assignments
//       </Typography>
      
//       {assignments.length === 0 ? (
//         <Alert severity="info">No shift assignments found.</Alert>
//       ) : (
//         <TableContainer component={Paper} sx={{ mt: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Shift</TableCell>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Time</TableCell>
//                 <TableCell>Assigned Staff</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {assignments.map((shift) => (
//                 <React.Fragment key={shift.shift_id}>
//                   {shift.assignments.length > 0 ? (
//                     shift.assignments.map((assignment, index) => (
//                       <TableRow key={`${shift.shift_id}-${index}`}>
//                         {index === 0 && (
//                           <>
//                             <TableCell rowSpan={shift.assignments.length}>
//                               {shift.shift_name}
//                             </TableCell>
//                             <TableCell rowSpan={shift.assignments.length}>
//                               {new Date(shift.date).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell rowSpan={shift.assignments.length}>
//                               {shift.start_time} - {shift.end_time}
//                             </TableCell>
//                           </>
//                         )}
//                         <TableCell>
//                           Staff #{assignment.staff_id}
//                         </TableCell>
//                         <TableCell>
//                           <Chip 
//                             label={assignment.status || 'Assigned'} 
//                             color={assignment.status === 'completed' ? 'success' : 'primary'}
//                             size="small"
//                           />
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell>{shift.shift_name}</TableCell>
//                       <TableCell>{new Date(shift.date).toLocaleDateString()}</TableCell>
//                       <TableCell>{shift.start_time} - {shift.end_time}</TableCell>
//                       <TableCell colSpan={2} align="center">
//                         <Typography color="textSecondary">No assignments</Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </React.Fragment>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// }

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
  Chip,
  Container,
  Stack,
  Avatar,
  Fade,
  Grow,
} from '@mui/material';
import {
  Assignment,
  Person,
  Schedule,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': 
        return { 
          color: '#000000', 
          bgColor: '#f8f8f8', 
          borderColor: '#e0e0e0',
          label: 'Completed' 
        };
      case 'in_progress': 
        return { 
          color: '#666666', 
          bgColor: '#f0f0f0', 
          borderColor: '#cccccc',
          label: 'In Progress' 
        };
      case 'assigned': 
        return { 
          color: '#999999', 
          bgColor: '#f5f5f5', 
          borderColor: '#d0d0d0',
          label: 'Assigned' 
        };
      default: 
        return { 
          color: '#999999', 
          bgColor: '#f5f5f5', 
          borderColor: '#d0d0d0',
          label: status || 'Assigned' 
        };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}>
          <CircularProgress 
            size={48}
            sx={{
              color: '#000000',
              mb: 3,
            }}
          />
          <Typography 
            sx={{ 
              color: '#666666', 
              fontWeight: 500,
              fontSize: '15px',
              letterSpacing: '0.5px',
            }}
          >
            Loading shift assignments...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
        <Fade in timeout={300}>
          <Alert 
            severity="error" 
            sx={{
              borderRadius: '12px',
              border: '1px solid #ffcdd2',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              '& .MuiAlert-icon': {
                fontSize: '20px',
                color: '#d32f2f',
              },
              '& .MuiAlert-message': {
                fontWeight: 500,
                fontSize: '14px',
              },
            }}
          >
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in timeout={300}>
        <Box>
          {/* Page Header */}
          <Box sx={{ 
            mb: { xs: 4, md: 6 },
            textAlign: 'left',
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900,
                color: '#000000',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 2,
                textAlign: 'left',
              }}
            >
              Shift Assignments
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                maxWidth: '600px',
                textAlign: 'left',
              }}
            >
              View and manage staff assignments across all scheduled shifts
            </Typography>
          </Box>

          {/* Summary Stats */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={4} alignItems="center">
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#000000',
                    fontSize: '18px',
                  }}
                >
                  {assignments.length} Active Shifts
                </Typography>
              </Box>
              <Box>
                <Typography 
                  sx={{ 
                    fontWeight: 500,
                    color: '#666666',
                    fontSize: '14px',
                  }}
                >
                  {assignments.reduce((total, shift) => total + shift.assignments.length, 0)} Total Assignments
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Content */}
          {assignments.length === 0 ? (
            <Grow in timeout={500}>
              <Paper sx={{
                p: 6,
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                textAlign: 'center',
              }}>
                <Assignment sx={{ 
                  fontSize: 64, 
                  color: '#cccccc',
                  mb: 2,
                }} />
                <Typography sx={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#666666',
                  mb: 1,
                }}>
                  No Shift Assignments Found
                </Typography>
                <Typography sx={{
                  fontSize: '14px',
                  color: '#999999',
                  maxWidth: '400px',
                  mx: 'auto',
                }}>
                  There are currently no shift assignments to display. Create shifts and assign staff to see them here.
                </Typography>
              </Paper>
            </Grow>
          ) : (
            <Grow in timeout={500}>
              <Paper sx={{
                borderRadius: '16px',
                border: '1px solid #e5e5e5',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
              }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#fafafa' }}>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 3,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Shift Details
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 3,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 3,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Schedule
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 3,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Assigned Staff
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 700, 
                          color: '#000000',
                          fontSize: '14px',
                          py: 3,
                          borderBottom: '1px solid #f0f0f0',
                        }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((shift, shiftIndex) => (
                        <React.Fragment key={shift.shift_id}>
                          {shift.assignments.length > 0 ? (
                            shift.assignments.map((assignment, index) => {
                              const statusConfig = getStatusConfig(assignment.status);
                              
                              return (
                                <TableRow 
                                  key={`${shift.shift_id}-${index}`}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: '#f8f8f8',
                                    },
                                    borderBottom: '1px solid #f5f5f5',
                                  }}
                                >
                                  {index === 0 && (
                                    <>
                                      <TableCell 
                                        rowSpan={shift.assignments.length}
                                        sx={{ py: 3, borderRight: '1px solid #f5f5f5' }}
                                      >
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                          <Box sx={{
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '10px',
                                            backgroundColor: '#f0f0f0',
                                            border: '1px solid #e0e0e0',
                                          }}>
                                            <Schedule sx={{ fontSize: 20, color: '#666666' }} />
                                          </Box>
                                          <Box>
                                            <Typography sx={{ 
                                              fontWeight: 600,
                                              color: '#000000',
                                              fontSize: '14px',
                                              mb: 0.5,
                                            }}>
                                              {shift.shift_name}
                                            </Typography>
                                            <Typography sx={{ 
                                              color: '#666666',
                                              fontSize: '12px',
                                            }}>
                                              Shift ID: {shift.shift_id}
                                            </Typography>
                                          </Box>
                                        </Stack>
                                      </TableCell>
                                      <TableCell 
                                        rowSpan={shift.assignments.length}
                                        sx={{ py: 3, borderRight: '1px solid #f5f5f5' }}
                                      >
                                        <Box sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                        }}>
                                          <CalendarToday sx={{ fontSize: 16, color: '#666666' }} />
                                          <Typography sx={{ 
                                            fontSize: '14px',
                                            color: '#000000',
                                            fontWeight: 500,
                                          }}>
                                            {new Date(shift.date).toLocaleDateString()}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell 
                                        rowSpan={shift.assignments.length}
                                        sx={{ py: 3, borderRight: '1px solid #f5f5f5' }}
                                      >
                                        <Box sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                        }}>
                                          <AccessTime sx={{ fontSize: 16, color: '#666666' }} />
                                          <Typography sx={{ 
                                            fontSize: '14px',
                                            color: '#000000',
                                            fontWeight: 500,
                                          }}>
                                            {shift.start_time} - {shift.end_time}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    </>
                                  )}
                                  <TableCell sx={{ py: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                      <Avatar sx={{
                                        width: 32,
                                        height: 32,
                                        backgroundColor: '#f0f0f0',
                                        color: '#000000',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        border: '1px solid #e0e0e0',
                                      }}>
                                        {assignment.staff_id}
                                      </Avatar>
                                      <Box>
                                        <Typography sx={{ 
                                          fontWeight: 600,
                                          color: '#000000',
                                          fontSize: '14px',
                                          mb: 0.5,
                                        }}>
                                          Staff Member #{assignment.staff_id}
                                        </Typography>
                                        <Typography sx={{ 
                                          color: '#666666',
                                          fontSize: '12px',
                                        }}>
                                          Assignment ID: {index + 1}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </TableCell>
                                  <TableCell sx={{ py: 3 }}>
                                    <Chip
                                      label={statusConfig.label}
                                      size="small"
                                      sx={{
                                        backgroundColor: statusConfig.bgColor,
                                        color: statusConfig.color,
                                        border: `1px solid ${statusConfig.borderColor}`,
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        height: '28px',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow 
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#f8f8f8',
                                },
                                borderBottom: '1px solid #f5f5f5',
                              }}
                            >
                              <TableCell sx={{ py: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Box sx={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '10px',
                                    backgroundColor: '#f0f0f0',
                                    border: '1px solid #e0e0e0',
                                  }}>
                                    <Schedule sx={{ fontSize: 20, color: '#666666' }} />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ 
                                      fontWeight: 600,
                                      color: '#000000',
                                      fontSize: '14px',
                                      mb: 0.5,
                                    }}>
                                      {shift.shift_name}
                                    </Typography>
                                    <Typography sx={{ 
                                      color: '#666666',
                                      fontSize: '12px',
                                    }}>
                                      Shift ID: {shift.shift_id}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ py: 3 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}>
                                  <CalendarToday sx={{ fontSize: 16, color: '#666666' }} />
                                  <Typography sx={{ 
                                    fontSize: '14px',
                                    color: '#000000',
                                    fontWeight: 500,
                                  }}>
                                    {new Date(shift.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: 3 }}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}>
                                  <AccessTime sx={{ fontSize: 16, color: '#666666' }} />
                                  <Typography sx={{ 
                                    fontSize: '14px',
                                    color: '#000000',
                                    fontWeight: 500,
                                  }}>
                                    {shift.start_time} - {shift.end_time}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell colSpan={2} sx={{ py: 3, textAlign: 'center' }}>
                                <Box sx={{
                                  p: 2,
                                  borderRadius: '8px',
                                  backgroundColor: '#fafafa',
                                  border: '1px solid #f0f0f0',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}>
                                  <Person sx={{ fontSize: 16, color: '#cccccc' }} />
                                  <Typography sx={{
                                    color: '#999999',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                  }}>
                                    No staff assigned
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grow>
          )}
        </Box>
      </Fade>
    </Container>
  );
}