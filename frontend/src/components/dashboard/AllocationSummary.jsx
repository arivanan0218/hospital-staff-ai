// import React from 'react';
// import { Paper, Typography, Box, List, ListItem, ListItemText, Chip } from '@mui/material';

// export default function AllocationSummary() {
//   const recentAllocations = [
//     { id: 1, shift: 'Morning Shift', staff: 3, status: 'completed' },
//     { id: 2, shift: 'Afternoon Shift', staff: 2, status: 'pending' },
//     { id: 3, shift: 'Night Shift', staff: 4, status: 'completed' },
//   ];

//   return (
//     <Paper sx={{ p: 2, height: '400px' }}>
//       <Typography variant="h6" gutterBottom>
//         Recent Allocations
//       </Typography>
//       <List>
//         {recentAllocations.map((allocation) => (
//           <ListItem key={allocation.id} divider>
//             <ListItemText
//               primary={allocation.shift}
//               secondary={`${allocation.staff} staff assigned`}
//             />
//             <Chip
//               label={allocation.status}
//               color={allocation.status === 'completed' ? 'success' : 'warning'}
//               size="small"
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Paper>
//   );
// }

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Avatar,
  Divider,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  AccessTime,
  WbSunny,
  Brightness3,
  Groups,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

export default function AllocationSummary() {
  const recentAllocations = [
    { id: 1, shift: 'Morning Shift', staff: 3, status: 'completed', time: '06:00 - 14:00', completion: 100 },
    { id: 2, shift: 'Afternoon Shift', staff: 2, status: 'pending', time: '14:00 - 22:00', completion: 75 },
    { id: 3, shift: 'Night Shift', staff: 4, status: 'completed', time: '22:00 - 06:00', completion: 100 },
  ];

  const getShiftIcon = (shiftName) => {
    if (shiftName.includes('Morning')) return <WbSunny sx={{ fontSize: 18, color: '#000000' }} />;
    if (shiftName.includes('Afternoon')) return <AccessTime sx={{ fontSize: 18, color: '#000000' }} />;
    if (shiftName.includes('Night')) return <Brightness3 sx={{ fontSize: 18, color: '#000000' }} />;
    return <AccessTime sx={{ fontSize: 18, color: '#000000' }} />;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: '#000000',
          bgColor: '#f8f8f8',
          borderColor: '#e0e0e0',
          icon: <CheckCircle sx={{ fontSize: 16, color: '#000000' }} />,
          label: 'Completed',
        };
      case 'pending':
        return {
          color: '#666666',
          bgColor: '#f5f5f5',
          borderColor: '#cccccc',
          icon: <Schedule sx={{ fontSize: 16, color: '#666666' }} />,
          label: 'In Progress',
        };
      default:
        return {
          color: '#999999',
          bgColor: '#f0f0f0',
          borderColor: '#d0d0d0',
          icon: <Schedule sx={{ fontSize: 16, color: '#999999' }} />,
          label: 'Unknown',
        };
    }
  };

  const totalStaff = recentAllocations.reduce((sum, allocation) => sum + allocation.staff, 0);
  const completedShifts = recentAllocations.filter(a => a.status === 'completed').length;
  const avgCompletion = recentAllocations.reduce((sum, a) => sum + a.completion, 0) / recentAllocations.length;

  return (
    <Paper sx={{
      p: 5,
      height: '500px',
      borderRadius: '12px',
      border: '1px solid #e5e5e5',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Fade in timeout={300}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: '#000000',
              mb: 1,
              fontSize: '20px',
            }}
          >
            Allocation Summary
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666666',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Recent shift allocations and progress
          </Typography>
        </Box>
      </Fade>

      {/* Quick Stats */}
      <Grow in timeout={500}>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Box sx={{
            flex: 1,
            p: 2.5,
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#e0e0e0',
            },
          }}>
            <Typography sx={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              color: '#000000',
              mb: 0.5,
            }}>
              {totalStaff}
            </Typography>
            <Typography sx={{ 
              fontSize: '11px', 
              color: '#666666', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Total Staff
            </Typography>
          </Box>
          <Box sx={{
            flex: 1,
            p: 2.5,
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#e0e0e0',
            },
          }}>
            <Typography sx={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              color: '#000000',
              mb: 0.5,
            }}>
              {completedShifts}
            </Typography>
            <Typography sx={{ 
              fontSize: '11px', 
              color: '#666666', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Completed
            </Typography>
          </Box>
          <Box sx={{
            flex: 1,
            p: 2.5,
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#e0e0e0',
            },
          }}>
            <Typography sx={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              color: '#000000',
              mb: 0.5,
            }}>
              {avgCompletion.toFixed(0)}%
            </Typography>
            <Typography sx={{ 
              fontSize: '11px', 
              color: '#666666', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Avg Progress
            </Typography>
          </Box>
        </Stack>
      </Grow>

      {/* Allocations List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#000000',
            fontSize: '16px',
            mb: 3,
          }}
        >
          Recent Shifts
        </Typography>

        <List sx={{ p: 0 }}>
          {recentAllocations.map((allocation, index) => {
            const statusConfig = getStatusConfig(allocation.status);
            
            return (
              <Fade in timeout={700 + index * 150} key={allocation.id}>
                <ListItem sx={{
                  p: 0,
                  mb: 3,
                  '&:last-child': { mb: 0 },
                }}>
                  <Box sx={{
                    width: '100%',
                    p: 3,
                    borderRadius: '8px',
                    backgroundColor: statusConfig.bgColor,
                    border: `1px solid ${statusConfig.borderColor}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      backgroundColor: allocation.status === 'completed' ? '#f0f0f0' : '#f0f0f0',
                      borderColor: '#cccccc',
                    },
                  }}>
                    {/* Header Row */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{
                          width: 36,
                          height: 36,
                          backgroundColor: '#ffffff',
                          border: '1px solid #e0e0e0',
                        }}>
                          {getShiftIcon(allocation.shift)}
                        </Avatar>
                        <Box>
                          <Typography sx={{
                            fontWeight: 700,
                            color: '#000000',
                            fontSize: '14px',
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}>
                            {allocation.shift}
                          </Typography>
                          <Typography sx={{
                            color: '#666666',
                            fontSize: '12px',
                            lineHeight: 1.3,
                            fontWeight: 500,
                          }}>
                            {allocation.time}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {statusConfig.icon}
                        <Typography sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: statusConfig.color,
                        }}>
                          {statusConfig.label}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Staff Count */}
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                      <Groups sx={{ fontSize: 16, color: '#666666' }} />
                      <Typography sx={{
                        fontSize: '13px',
                        color: '#666666',
                        fontWeight: 500,
                      }}>
                        {allocation.staff} staff members assigned
                      </Typography>
                    </Stack>

                    {/* Progress Bar */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#000000',
                        }}>
                          Progress
                        </Typography>
                        <Typography sx={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#000000',
                        }}>
                          {allocation.completion}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={allocation.completion}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid #e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            bgcolor: '#000000',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </ListItem>
              </Fade>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Fade in timeout={1200}>
        <Box sx={{ 
          mt: 3, 
          pt: 3, 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#666666',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Updated every 5 minutes
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
}