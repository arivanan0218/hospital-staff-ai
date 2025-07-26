import React from 'react';
import { Chip } from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';

export default function ConnectionStatus({ connected }) {
  return (
    <Chip
      icon={connected ? <Wifi /> : <WifiOff />}
      label={connected ? 'Connected' : 'Disconnected'}
      color={connected ? 'success' : 'error'}
      size="small"
      variant="outlined"
      sx={{ mr: 2 }}
    />
  );
}
