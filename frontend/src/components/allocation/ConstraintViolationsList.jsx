// import React from 'react';
// import { 
//   List, 
//   ListItem, 
//   ListItemText, 
//   ListItemIcon,
//   Typography, 
//   Paper,
//   Chip 
// } from '@mui/material';
// import { Warning, Error, Info } from '@mui/icons-material';

// export default function ConstraintViolationsList({ violations = [] }) {
//   const getIcon = (severity) => {
//     switch (severity) {
//       case 'high': return <Error color="error" />;
//       case 'medium': return <Warning color="warning" />;
//       default: return <Info color="info" />;
//     }
//   };

//   const getColor = (severity) => {
//     switch (severity) {
//       case 'high': return 'error';
//       case 'medium': return 'warning';
//       default: return 'info';
//     }
//   };

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Constraint Violations
//       </Typography>
      
//       {violations.length === 0 ? (
//         <Typography color="success.main">
//           ✅ No constraint violations found
//         </Typography>
//       ) : (
//         <List>
//           {violations.map((violation, index) => (
//             <ListItem key={index} divider>
//               <ListItemIcon>
//                 {getIcon(violation.severity)}
//               </ListItemIcon>
//               <ListItemText
//                 primary={violation.description}
//                 secondary={violation.suggested_fix}
//               />
//               <Chip 
//                 label={violation.severity}
//                 color={getColor(violation.severity)}
//                 size="small"
//               />
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </Paper>
//   );
// }


import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography, 
  Paper,
  Chip,
  Box,
  Fade 
} from '@mui/material';
import { Warning, Error, Info, CheckCircle } from '@mui/icons-material';

export default function ConstraintViolationsList({ violations = [] }) {
  const getIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      default: return <Info />;
    }
  };

  const getSeverityWeight = (severity) => {
    switch (severity) {
      case 'high': return 700;
      case 'medium': return 600;
      default: return 500;
    }
  };

  return (
    <Paper sx={{ 
      p: { xs: 4, sm: 5, md: 6 },
      borderRadius: '16px',
      border: '1px solid #e5e5e5',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    }}>
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#000000',
            fontSize: { xs: '18px', sm: '20px', md: '22px' },
            mb: 1,
          }}
        >
          Constraint Violations
        </Typography>
        <Typography
          sx={{
            color: '#666666',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          System constraints and recommended fixes
        </Typography>
      </Box>
      
      {violations.length === 0 ? (
        <Fade in timeout={500}>
          <Box sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #e0e0e0',
            }}>
              <CheckCircle sx={{ color: '#000000', fontSize: 20 }} />
            </Box>
            <Typography sx={{
              color: '#000000',
              fontWeight: 600,
              fontSize: { xs: '14px', sm: '15px' },
            }}>
              No constraint violations found
            </Typography>
          </Box>
        </Fade>
      ) : (
        <List sx={{ p: 0 }}>
          {violations.map((violation, index) => (
            <Fade in timeout={500 + index * 100} key={index}>
              <ListItem sx={{
                px: { xs: 3, sm: 4 },
                py: 3,
                mb: 3,
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#e0e0e0',
                  transform: 'translateX(8px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
                '&:last-child': {
                  mb: 0,
                },
              }}>
                <ListItemIcon sx={{ minWidth: '56px' }}>
                  <Box sx={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #e0e0e0',
                  }}>
                    {React.cloneElement(getIcon(violation.severity), { 
                      sx: { 
                        fontSize: 20, 
                        color: '#000000' 
                      } 
                    })}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={
                    <Typography sx={{ 
                      fontWeight: getSeverityWeight(violation.severity), 
                      color: '#000000',
                      fontSize: { xs: '14px', sm: '15px' },
                      mb: 1,
                      lineHeight: 1.4,
                    }}>
                      {violation.description}
                    </Typography>
                  }
                  secondary={
                    violation.suggested_fix && (
                      <Typography sx={{ 
                        color: '#666666', 
                        fontSize: { xs: '12px', sm: '13px' },
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}>
                        💡 {violation.suggested_fix}
                      </Typography>
                    )
                  }
                />
                <Box sx={{ ml: 'auto', pl: 2 }}>
                  <Chip
                    label={violation.severity.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: violation.severity === 'high' ? '#000000' : 
                                     violation.severity === 'medium' ? '#404040' : '#808080',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '10px',
                      borderRadius: '8px',
                      height: '28px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      border: 'none',
                      '&:hover': {
                        backgroundColor: violation.severity === 'high' ? '#333333' : 
                                       violation.severity === 'medium' ? '#606060' : '#999999',
                      },
                    }}
                  />
                </Box>
              </ListItem>
            </Fade>
          ))}
        </List>
      )}
    </Paper>
  );
}