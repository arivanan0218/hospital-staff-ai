// import React from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Grid,
//   Chip,
//   Divider,
// } from '@mui/material';
// import { Person, Email, Phone, Work } from '@mui/icons-material';

// export default function StaffDetailsDialog({ open, staff, onClose }) {
//   if (!staff) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <Box display="flex" alignItems="center">
//           <Person sx={{ mr: 1 }} />
//           Staff Details
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Typography variant="h5" gutterBottom>
//               {staff.first_name} {staff.last_name}
//             </Typography>
//             <Chip label={staff.role} color="primary" />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Divider sx={{ my: 2 }} />
//           </Grid>
          
//           <Grid item xs={12}>
//             <Box display="flex" alignItems="center" mb={1}>
//               <Email sx={{ mr: 1 }} />
//               <Typography>{staff.email}</Typography>
//             </Box>
//           </Grid>
          
//           {staff.phone && (
//             <Grid item xs={12}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <Phone sx={{ mr: 1 }} />
//                 <Typography>{staff.phone}</Typography>
//               </Box>
//             </Grid>
//           )}
          
//           <Grid item xs={12}>
//             <Box display="flex" alignItems="center" mb={1}>
//               <Work sx={{ mr: 1 }} />
//               <Typography>Employee ID: {staff.employee_id}</Typography>
//             </Box>
//           </Grid>
          
//           {staff.hourly_rate && (
//             <Grid item xs={12}>
//               <Typography variant="body2">
//                 Hourly Rate: /hr
//               </Typography>
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Paper,
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  Work, 
  Business,
  Schedule,
  AttachMoney,
  Close,
  Badge,
} from '@mui/icons-material';

export default function StaffDetailsDialog({ open, staff, onClose }) {
  if (!staff) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': 
        return { 
          color: '#000000', 
          bgColor: '#f8f8f8', 
          borderColor: '#e0e0e0',
          label: 'Active' 
        };
      case 'inactive': 
        return { 
          color: '#999999', 
          bgColor: '#f5f5f5', 
          borderColor: '#d0d0d0',
          label: 'Inactive' 
        };
      case 'on_leave': 
        return { 
          color: '#666666', 
          bgColor: '#f0f0f0', 
          borderColor: '#cccccc',
          label: 'On Leave' 
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

  const statusConfig = getStatusConfig(staff.status);

  const InfoRow = ({ icon, label, value, highlight = false }) => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      py: 2,
      px: 3,
      borderRadius: '12px',
      backgroundColor: highlight ? '#fafafa' : 'transparent',
      border: highlight ? '1px solid #f0f0f0' : 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#f8f8f8',
      },
    }}>
      <Box sx={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #e0e0e0',
        mr: 3,
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 20, color: '#666666' } })}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mb: 0.5,
        }}>
          {label}
        </Typography>
        <Typography sx={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#000000',
          lineHeight: 1.3,
        }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 0,
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 4,
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #e0e0e0',
            }}>
              <Person sx={{ fontSize: 24, color: '#000000' }} />
            </Box>
            <Box>
              <Typography sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1.2,
              }}>
                Staff Details
              </Typography>
              <Typography sx={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#666666',
                mt: 0.5,
              }}>
                Complete staff member information
              </Typography>
            </Box>
          </Stack>
          <IconButton 
            onClick={onClose}
            sx={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              color: '#666666',
              '&:hover': {
                backgroundColor: '#f8f8f8',
                borderColor: '#cccccc',
              },
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Profile Section */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            p: 3,
            borderRadius: '16px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
          }}>
            <Avatar sx={{
              width: 64,
              height: 64,
              backgroundColor: '#f0f0f0',
              color: '#000000',
              fontWeight: 700,
              fontSize: '24px',
              border: '3px solid #e5e5e5',
              mr: 3,
            }}>
              {staff.first_name[0]}{staff.last_name[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1.2,
                mb: 1,
              }}>
                {staff.first_name} {staff.last_name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={staff.role}
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '28px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    textTransform: 'capitalize',
                  }}
                />
                <Chip
                  label={statusConfig.label}
                  sx={{
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.borderColor}`,
                    fontWeight: 600,
                    fontSize: '12px',
                    height: '28px',
                    borderRadius: '8px',
                  }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Contact Information */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#000000',
              mb: 3,
            }}>
              Contact Information
            </Typography>
            
            <Stack spacing={1}>
              <InfoRow
                icon={<Email />}
                label="Email Address"
                value={staff.email}
              />
              
              {staff.phone && (
                <InfoRow
                  icon={<Phone />}
                  label="Phone Number"
                  value={staff.phone}
                />
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: '#f0f0f0' }} />

          {/* Employment Details */}
          <Box>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#000000',
              mb: 3,
            }}>
              Employment Details
            </Typography>
            
            <Stack spacing={1}>
              <InfoRow
                icon={<Badge />}
                label="Employee ID"
                value={staff.employee_id || 'Not assigned'}
              />
              
              <InfoRow
                icon={<Business />}
                label="Department"
                value={staff.department?.name || 'Unassigned'}
              />
              
              {staff.hourly_rate && (
                <InfoRow
                  icon={<AttachMoney />}
                  label="Hourly Rate"
                  value={`$${staff.hourly_rate}/hour`}
                  highlight={true}
                />
              )}
              
              {staff.hire_date && (
                <InfoRow
                  icon={<Schedule />}
                  label="Hire Date"
                  value={new Date(staff.hire_date).toLocaleDateString()}
                />
              )}
            </Stack>
          </Box>

          {/* Additional Information */}
          {(staff.skills || staff.certifications || staff.notes) && (
            <>
              <Divider sx={{ my: 3, backgroundColor: '#f0f0f0' }} />
              <Box>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#000000',
                  mb: 3,
                }}>
                  Additional Information
                </Typography>
                
                {staff.skills && (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#666666',
                      mb: 1,
                    }}>
                      Skills & Qualifications
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      color: '#000000',
                      lineHeight: 1.6,
                    }}>
                      {staff.skills}
                    </Typography>
                  </Box>
                )}
                
                {staff.notes && (
                  <Box>
                    <Typography sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#666666',
                      mb: 1,
                    }}>
                      Notes
                    </Typography>
                    <Typography sx={{
                      fontSize: '14px',
                      color: '#000000',
                      lineHeight: 1.6,
                    }}>
                      {staff.notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 4,
        pt: 0,
        borderTop: '1px solid #f0f0f0',
        justifyContent: 'flex-end',
      }}>
        <Button 
          onClick={onClose}
          sx={{
            backgroundColor: '#f8f8f8',
            color: '#000000',
            borderRadius: '10px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            border: '1px solid #e0e0e0',
            '&:hover': {
              backgroundColor: '#f0f0f0',
              borderColor: '#cccccc',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}