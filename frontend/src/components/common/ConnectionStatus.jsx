// import React from 'react';
// import { Chip } from '@mui/material';
// import { Wifi, WifiOff } from '@mui/icons-material';

// export default function ConnectionStatus({ connected }) {
//   return (
//     <Chip
//       icon={connected ? <Wifi /> : <WifiOff />}
//       label={connected ? 'Connected' : 'Disconnected'}
//       color={connected ? 'success' : 'error'}
//       size="small"
//       variant="outlined"
//       sx={{ mr: 2 }}
//     />
//   );
// }

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';

export default function ConnectionStatus({ connected }) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1.5,
      borderRadius: '10px',
      backgroundColor: connected ? '#f8f8f8' : '#f5f5f5',
      border: `1px solid ${connected ? '#e0e0e0' : '#d0d0d0'}`,
      transition: 'all 0.2s ease-in-out',
    }}>
      <Box sx={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        backgroundColor: connected ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.1)',
      }}>
        {connected ? (
          <Wifi sx={{ 
            fontSize: 14, 
            color: '#000000',
          }} />
        ) : (
          <WifiOff sx={{ 
            fontSize: 14, 
            color: '#666666',
          }} />
        )}
      </Box>
      
      <Stack spacing={0}>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 700,
          color: connected ? '#000000' : '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          lineHeight: 1,
        }}>
          {connected ? 'Live' : 'Offline'}
        </Typography>
        <Typography sx={{
          fontSize: '10px',
          fontWeight: 500,
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          lineHeight: 1,
          mt: 0.5,
        }}>
          Connection
        </Typography>
      </Stack>
      
      {/* Status Indicator Dot */}
      <Box sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: connected ? '#000000' : '#cccccc',
        ml: 'auto',
        animation: connected ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
      }} />
    </Box>
  );
}