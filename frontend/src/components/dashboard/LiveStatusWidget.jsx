// import React, { useState, useEffect } from 'react';
// import {
//   Paper,
//   Typography,
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   LinearProgress,
//   IconButton,
//   Tooltip,
// } from '@mui/material';
// import {
//   Circle,
//   Refresh,
//   Warning,
//   CheckCircle,
//   Schedule,
// } from '@mui/icons-material';
// import { useWebSocket } from '../../contexts/WebSocketContext';

// export default function LiveStatusWidget() {
//   const [liveData, setLiveData] = useState({
//     onlineStaff: [],
//     activeShifts: [],
//     systemStatus: 'online',
//     lastUpdate: new Date(),
//   });
//   const { connected, sendMessage } = useWebSocket();

//   useEffect(() => {
//     // Request initial data
//     if (connected) {
//       sendMessage({
//         type: 'request_live_status',
//         timestamp: new Date().toISOString(),
//       });
//     }
//   }, [connected]);

//   const handleRefresh = () => {
//     if (connected) {
//       sendMessage({
//         type: 'request_live_status',
//         timestamp: new Date().toISOString(),
//       });
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'online': return 'success';
//       case 'busy': return 'warning';
//       case 'offline': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'active': return <CheckCircle color="success" />;
//       case 'pending': return <Schedule color="warning" />;
//       case 'issue': return <Warning color="error" />;
//       default: return <Circle />;
//     }
//   };

//   return (
//     <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6">
//           Live Status
//         </Typography>
//         <Box display="flex" alignItems="center">
//           <Chip
//             label={connected ? 'Connected' : 'Disconnected'}
//             color={connected ? 'success' : 'error'}
//             size="small"
//             sx={{ mr: 1 }}
//           />
//           <Tooltip title="Refresh">
//             <IconButton onClick={handleRefresh} size="small">
//               <Refresh />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {!connected && (
//         <Box sx={{ mb: 2 }}>
//           <LinearProgress />
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//             Connecting to live updates...
//           </Typography>
//         </Box>
//       )}

//       <Typography variant="subtitle2" gutterBottom>
//         Active Shifts ({liveData.activeShifts.length})
//       </Typography>
//       <List dense>
//         {liveData.activeShifts.map((shift, index) => (
//           <ListItem key={index}>
//             <ListItemIcon>
//               {getStatusIcon(shift.status)}
//             </ListItemIcon>
//             <ListItemText
//               primary={shift.name}
//               secondary={`${shift.department} • ${shift.staffCount} staff`}
//             />
//             <Chip
//               label={shift.status}
//               size="small"
//               color={getStatusColor(shift.status)}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
//         Online Staff ({liveData.onlineStaff.length})
//       </Typography>
//       <List dense>
//         {liveData.onlineStaff.slice(0, 5).map((staff, index) => (
//           <ListItem key={index}>
//             <ListItemIcon>
//               <Circle color="success" />
//             </ListItemIcon>
//             <ListItemText
//               primary={`${staff.firstName} ${staff.lastName}`}
//               secondary={staff.role}
//             />
//             <Chip
//               label={staff.status}
//               size="small"
//               color={getStatusColor(staff.status)}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
//         Last updated: {liveData.lastUpdate.toLocaleTimeString()}
//       </Typography>
//     </Paper>
//   );
// }


import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  Badge,
  Divider,
  Fade,
} from '@mui/material';
import {
  Circle,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
  Wifi,
  WifiOff,
} from '@mui/icons-material';
import { useWebSocket } from '../../contexts/WebSocketContext';

export default function LiveStatusWidget() {
  const [liveData, setLiveData] = useState({
    onlineStaff: [],
    activeShifts: [],
    systemStatus: 'online',
    lastUpdate: new Date(),
  });
  const { connected, sendMessage } = useWebSocket();

  useEffect(() => {
    // Request initial data
    if (connected) {
      sendMessage({
        type: 'request_live_status',
        timestamp: new Date().toISOString(),
      });
    }
  }, [connected]);

  const handleRefresh = () => {
    if (connected) {
      sendMessage({
        type: 'request_live_status',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#000000';
      case 'busy': return '#666666';
      case 'offline': return '#cccccc';
      default: return '#999999';
    }
  };

  const getStatusIcon = (status) => {
    const iconProps = { 
      sx: { 
        fontSize: 18,
        color: status === 'active' ? '#000000' : 
               status === 'pending' ? '#666666' : 
               status === 'issue' ? '#999999' : '#cccccc'
      }
    };
    
    switch (status) {
      case 'active': return <CheckCircle {...iconProps} />;
      case 'pending': return <Schedule {...iconProps} />;
      case 'issue': return <Warning {...iconProps} />;
      default: return <Circle {...iconProps} />;
    }
  };

  const ConnectionIndicator = () => (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: '8px',
        backgroundColor: connected ? '#f8f8f8' : '#f0f0f0',
        border: `1px solid ${connected ? '#e0e0e0' : '#cccccc'}`,
      }}>
        {connected ? (
          <Wifi sx={{ fontSize: 16, color: '#000000' }} />
        ) : (
          <WifiOff sx={{ fontSize: 16, color: '#666666' }} />
        )}
        <Typography 
          sx={{ 
            fontSize: '12px',
            fontWeight: 700,
            color: connected ? '#000000' : '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {connected ? 'Live' : 'Offline'}
        </Typography>
      </Box>
      <Tooltip title="Refresh data">
        <IconButton 
          onClick={handleRefresh} 
          size="small"
          sx={{
            width: '36px',
            height: '36px',
            backgroundColor: '#f8f8f8',
            border: '1px solid #e0e0e0',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f0f0f0',
              borderColor: '#cccccc',
              transform: 'rotate(180deg)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Refresh sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const StatusBadge = ({ status }) => (
    <Box sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: getStatusColor(status),
      border: '1px solid #ffffff',
      boxShadow: '0 0 0 1px #e0e0e0',
    }} />
  );

  return (
    <Paper sx={{
      p: 5,
      height: '500px',
      borderRadius: '12px',
      border: '1px solid #e5e5e5',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#000000',
            fontSize: '20px',
          }}
        >
          Live Status
        </Typography>
        <ConnectionIndicator />
      </Box>

      {/* Loading State */}
      {!connected && (
        <Fade in>
          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: '#f5f5f5',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  bgcolor: '#000000',
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: '#666666',
                fontSize: '13px',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              Connecting to live updates...
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Content Container */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Active Shifts Section */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '16px',
              }}
            >
              Active Shifts
            </Typography>
            <Chip 
              label={liveData.activeShifts.length}
              size="small"
              sx={{
                backgroundColor: '#f0f0f0',
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
                height: '24px',
                border: '1px solid #e0e0e0',
              }}
            />
          </Box>

          <List sx={{ p: 0 }}>
            {liveData.activeShifts.map((shift, index) => (
              <Fade in timeout={300 + index * 100} key={index}>
                <ListItem sx={{
                  px: 3,
                  py: 2,
                  mb: 2,
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#e0e0e0',
                    transform: 'translateY(-1px)',
                  },
                  '&:last-child': {
                    mb: 0,
                  },
                }}>
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e0e0e0',
                    }}>
                      {getStatusIcon(shift.status)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ 
                        fontWeight: 600, 
                        color: '#000000',
                        fontSize: '14px',
                        mb: 0.5,
                      }}>
                        {shift.name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ 
                        color: '#666666',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}>
                        {shift.department} • {shift.staffCount} staff
                      </Typography>
                    }
                  />
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <StatusBadge status={shift.status} />
                    <Typography sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#666666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {shift.status}
                    </Typography>
                  </Stack>
                </ListItem>
              </Fade>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3, bgcolor: '#f0f0f0' }} />

        {/* Online Staff Section */}
        <Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '16px',
              }}
            >
              Online Staff
            </Typography>
            <Chip 
              label={liveData.onlineStaff.length}
              size="small"
              sx={{
                backgroundColor: '#f0f0f0',
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
                height: '24px',
                border: '1px solid #e0e0e0',
              }}
            />
          </Box>

          <List sx={{ p: 0 }}>
            {liveData.onlineStaff.slice(0, 5).map((staff, index) => (
              <Fade in timeout={600 + index * 100} key={index}>
                <ListItem sx={{
                  px: 3,
                  py: 2,
                  mb: 2,
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#e0e0e0',
                    transform: 'translateY(-1px)',
                  },
                  '&:last-child': {
                    mb: 0,
                  },
                }}>
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Badge
                      badgeContent=""
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: getStatusColor(staff.status),
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 0 0 1px #e0e0e0',
                        },
                      }}
                    >
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#f0f0f0',
                        color: '#000000',
                        fontWeight: 700,
                        fontSize: '13px',
                        border: '1px solid #e0e0e0',
                      }}>
                        {staff.firstName?.[0]}{staff.lastName?.[0]}
                      </Avatar>
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ 
                        fontWeight: 600, 
                        color: '#000000',
                        fontSize: '14px',
                        mb: 0.5,
                      }}>
                        {staff.firstName} {staff.lastName}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ 
                        color: '#666666',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}>
                        {staff.role}
                      </Typography>
                    }
                  />
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <StatusBadge status={staff.status} />
                    <Typography sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#666666',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {staff.status}
                    </Typography>
                  </Stack>
                </ListItem>
              </Fade>
            ))}
          </List>
        </Box>
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
            Last updated: {liveData.lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
}