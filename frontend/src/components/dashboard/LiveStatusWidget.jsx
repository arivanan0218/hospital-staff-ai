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
} from '@mui/material';
import {
  Circle,
  Refresh,
  Warning,
  CheckCircle,
  Schedule,
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
      case 'online': return 'success';
      case 'busy': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'pending': return <Schedule color="warning" />;
      case 'issue': return <Warning color="error" />;
      default: return <Circle />;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Live Status
        </Typography>
        <Box display="flex" alignItems="center">
          <Chip
            label={connected ? 'Connected' : 'Disconnected'}
            color={connected ? 'success' : 'error'}
            size="small"
            sx={{ mr: 1 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {!connected && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Connecting to live updates...
          </Typography>
        </Box>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Active Shifts ({liveData.activeShifts.length})
      </Typography>
      <List dense>
        {liveData.activeShifts.map((shift, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {getStatusIcon(shift.status)}
            </ListItemIcon>
            <ListItemText
              primary={shift.name}
              secondary={`${shift.department} • ${shift.staffCount} staff`}
            />
            <Chip
              label={shift.status}
              size="small"
              color={getStatusColor(shift.status)}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
        Online Staff ({liveData.onlineStaff.length})
      </Typography>
      <List dense>
        {liveData.onlineStaff.slice(0, 5).map((staff, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Circle color="success" />
            </ListItemIcon>
            <ListItemText
              primary={`${staff.firstName} ${staff.lastName}`}
              secondary={staff.role}
            />
            <Chip
              label={staff.status}
              size="small"
              color={getStatusColor(staff.status)}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
        Last updated: {liveData.lastUpdate.toLocaleTimeString()}
      </Typography>
    </Paper>
  );
}