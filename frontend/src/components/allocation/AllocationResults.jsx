// import React from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Button, 
//   Chip, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   ListItemIcon, 
//   Divider,
//   Alert,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   CircularProgress
// } from '@mui/material';
// import { 
//   CheckCircle, 
//   Warning, 
//   ExpandMore as ExpandMoreIcon,
//   Error as ErrorIcon,
//   Info as InfoIcon,
//   Warning as WarningIcon,
//   ErrorOutline as ErrorOutlineIcon
// } from '@mui/icons-material';

// export default function AllocationResults({ result, onApply }) {
//   if (!result) {
//     return (
//       <Paper sx={{ p: 2 }}>
//         <Typography>No allocation results to display</Typography>
//       </Paper>
//     );
//   }

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         AI Allocation Results
//       </Typography>
      
//       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
//         <Box>
//           <Typography variant="body2" color="textSecondary">
//             Confidence Score
//           </Typography>
//           <Typography variant="h5" color="primary">
//             {((result.confidence_score || 0) * 100).toFixed(1)}%
//           </Typography>
//         </Box>
//         <Box>
//           <Typography variant="body2" color="textSecondary">
//             Status
//           </Typography>
//           <Chip
//             icon={result.success !== false ? <CheckCircle /> : <Warning />}
//             label={result.success !== false ? 'Success' : 'Has Issues'}
//             color={result.success !== false ? 'success' : 'warning'}
//           />
//         </Box>
//       </Box>

//       <Box sx={{ mt: 2, mb: 3 }}>
//         <Typography variant="body1" gutterBottom>
//           Shifts Processed: {result.shifts_processed || 0}
//         </Typography>
        
//         <Typography variant="body1" gutterBottom>
//           Staff Considered: {result.staff_considered || 0}
//         </Typography>

//         {result.allocation_results?.allocations?.length > 0 && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Allocations
//             </Typography>
//             <List dense>
//               {result.allocation_results.allocations.map((allocation, idx) => (
//                 <Paper key={idx} sx={{ mb: 2, p: 1, bgcolor: 'background.paper' }}>
//                   <Typography variant="subtitle2">
//                     Shift ID: {allocation.shift_id}
//                   </Typography>
//                   <List dense>
//                     {allocation.staff_assignments?.map((assignment, aidx) => (
//                       <ListItem key={aidx}>
//                         <ListItemIcon>
//                           <CheckCircle color="success" fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText 
//                           primary={`Staff ${assignment.staff_id}`}
//                           secondary={`Confidence: ${(assignment.confidence_score * 100).toFixed(1)}% - ${assignment.reasoning}`}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Paper>
//               ))}
//             </List>
//           </Box>
//         )}

//         {result.constraint_validation?.violations?.length > 0 && (
//           <Accordion sx={{ mt: 2 }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography color="error">
//                 <ErrorIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
//                 Constraint Violations ({result.constraint_validation.violations.length})
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {result.constraint_validation.violations.map((violation, idx) => (
//                   <ListItem key={idx}>
//                     <ListItemIcon>
//                       <Warning color="warning" />
//                     </ListItemIcon>
//                     <ListItemText 
//                       primary={violation.message}
//                       secondary={`Shift: ${violation.shift_id}, Staff: ${violation.staff_id}`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}

//         {result.allocation_results?.recommendations?.length > 0 && (
//           <Accordion sx={{ mt: 2 }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography color="info">
//                 <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
//                 Recommendations ({result.allocation_results.recommendations.length})
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <List dense>
//                 {result.allocation_results.recommendations.map((rec, idx) => (
//                   <ListItem key={idx}>
//                     <ListItemText 
//                       primary={rec.recommendation}
//                       secondary={`Impact: ${rec.impact}`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </AccordionDetails>
//           </Accordion>
//         )}
//       </Box>

//       {/* Show Apply button if there are allocations */}
//       {result.allocation_results?.allocations?.length > 0 && (
//         <Box sx={{ mt: 3, textAlign: 'center' }}>
//           <Button
//             variant="contained"
//             color="success"
//             onClick={onApply}
//             size="large"
//             startIcon={<CheckCircle />}
//             disabled={!onApply || result._isApplying}
//             sx={{
//               minWidth: 200,
//               mb: 2,
//               '&.Mui-disabled': {
//                 backgroundColor: 'action.disabledBackground',
//                 color: 'text.disabled'
//               }
//             }}
//           >
//             {result._isApplying ? (
//               <>
//                 <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
//                 Applying...
//               </>
//             ) : (
//               'Apply This Allocation'
//             )}
//           </Button>
          
//           {/* Show allocation results if available */}
//           {result._applyResults && (
//             <Box sx={{ mt: 2, textAlign: 'left' }}>
//               {result._applyResults.success.length > 0 && (
//                 <Alert severity="success" sx={{ mb: 2 }}>
//                   Successfully applied {result._applyResults.success.length} assignment(s)
//                 </Alert>
//               )}
              
//               {result._applyResults.skipped.length > 0 && (
//                 <Alert 
//                   severity="info"
//                   sx={{ 
//                     mb: 2,
//                     '& .MuiAlert-message': { width: '100%' }
//                   }}
//                 >
//                   <Typography variant="subtitle2" gutterBottom>
//                     {result._applyResults.skipped.length} assignment(s) skipped (already assigned)
//                   </Typography>
//                   <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'background.paper', mt: 1 }}>
//                     {result._applyResults.skipped.map((skipped, idx) => (
//                       <ListItem key={`skipped-${idx}`} disableGutters>
//                         <ListItemIcon sx={{ minWidth: 32 }}>
//                           <InfoIcon color="info" fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText 
//                           primary={`Shift ${skipped.shift_id} - Staff ${skipped.staff_id}`}
//                           secondary={skipped.message}
//                           secondaryTypographyProps={{ color: 'text.secondary' }}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Alert>
//               )}
              
//               {result._applyResults.failed.length > 0 && (
//                 <Alert 
//                   severity="warning" 
//                   sx={{ 
//                     mb: 2,
//                     '& .MuiAlert-message': { width: '100%' }
//                   }}
//                 >
//                   <Typography variant="subtitle2" gutterBottom>
//                     {result._applyResults.failed.length} assignment(s) failed
//                   </Typography>
//                   <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'background.paper', mt: 1 }}>
//                     {result._applyResults.failed.map((fail, idx) => (
//                       <ListItem key={`failed-${idx}`} disableGutters>
//                         <ListItemIcon sx={{ minWidth: 32 }}>
//                           <ErrorIcon color="error" fontSize="small" />
//                         </ListItemIcon>
//                         <ListItemText 
//                           primary={`Shift ${fail.shift_id} - Staff ${fail.staff_id}`}
//                           secondary={fail.error}
//                           secondaryTypographyProps={{ color: 'error.main' }}
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Alert>
//               )}
              
//               {(result._applyResults.success.length > 0 || result._applyResults.skipped.length > 0) && (
//                 <Alert severity="success" sx={{ mt: 2 }}>
//                   {result._applyResults.success.length + result._applyResults.skipped.length} out of 
//                   {result._applyResults.success.length + result._applyResults.skipped.length + result._applyResults.failed.length} 
//                   assignments were successfully processed.
//                 </Alert>
//               )}
//             </Box>
//           )}
          
//           {!result._applyResults && result.success === false && (
//             <Typography color="warning.main" variant="body2" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
//               <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
//               This allocation has some constraint violations, but you can still apply it.
//             </Typography>
//           )}
          
//           {result._applyError && (
//             <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
//               {typeof result._applyError === 'string' 
//                 ? result._applyError 
//                 : result._applyError?.message || 'An unknown error occurred'}
              
//               {result._applyError?.response?.data?.detail && (
//                 <Box component="div" sx={{ mt: 1 }}>
//                   <Typography variant="body2" component="span">
//                     {typeof result._applyError.response.data.detail === 'string'
//                       ? result._applyError.response.data.detail
//                       : JSON.stringify(result._applyError.response.data.detail)}
//                   </Typography>
//                 </Box>
//               )}
//             </Alert>
//           )}
//         </Box>
//       )}
//     </Paper>
//   );
// }

import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Stack,
  Grid,
  Fade,
  Grow,
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  Psychology,
  TrendingUp,
  Person,
  Schedule,
  Save,
} from '@mui/icons-material';

export default function AllocationResults({ result, onApply }) {
  if (!result) {
    return (
      <Paper sx={{
        p: 4,
        borderRadius: '16px',
        border: '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        textAlign: 'center',
      }}>
        <Psychology sx={{ fontSize: 48, color: '#cccccc', mb: 2 }} />
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#666666',
        }}>
          No allocation results to display
        </Typography>
      </Paper>
    );
  }

  const getStatusConfig = (success) => {
    if (success !== false) {
      return {
        color: '#000000',
        bgColor: '#f8f8f8',
        borderColor: '#e0e0e0',
        label: 'Success',
        icon: <CheckCircle sx={{ fontSize: 16, color: '#000000' }} />
      };
    } else {
      return {
        color: '#666666',
        bgColor: '#f0f0f0',
        borderColor: '#cccccc',
        label: 'Has Issues',
        icon: <Warning sx={{ fontSize: 16, color: '#666666' }} />
      };
    }
  };

  const statusConfig = getStatusConfig(result.success);

  return (
    <Box>
      <Fade in timeout={300}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#000000',
            mb: 1,
          }}>
            AI Allocation Results
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666',
            fontWeight: 500,
          }}>
            Review the AI-generated staff allocation and optimization results
          </Typography>
        </Box>
      </Fade>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={500}>
            <Paper sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: 'center',
            }}>
              <Typography sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                Confidence Score
              </Typography>
              <Typography sx={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1,
              }}>
                {((result.confidence_score || 0) * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={600}>
            <Paper sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: 'center',
            }}>
              <Typography sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                Status
              </Typography>
              <Chip
                icon={statusConfig.icon}
                label={statusConfig.label}
                sx={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.color,
                  border: `1px solid ${statusConfig.borderColor}`,
                  fontWeight: 600,
                  fontSize: '12px',
                  height: '32px',
                  borderRadius: '8px',
                }}
              />
            </Paper>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={700}>
            <Paper sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: 'center',
            }}>
              <Typography sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                Shifts Processed
              </Typography>
              <Typography sx={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1,
              }}>
                {result.shifts_processed || 0}
              </Typography>
            </Paper>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grow in timeout={800}>
            <Paper sx={{
              p: 3,
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              textAlign: 'center',
            }}>
              <Typography sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}>
                Staff Considered
              </Typography>
              <Typography sx={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1,
              }}>
                {result.staff_considered || 0}
              </Typography>
            </Paper>
          </Grow>
        </Grid>
      </Grid>

      {/* Allocations Section */}
      {result.allocation_results?.allocations?.length > 0 && (
        <Fade in timeout={900}>
          <Paper sx={{
            p: 4,
            mb: 4,
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <Typography sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#000000',
              mb: 3,
            }}>
              Staff Allocations
            </Typography>
            
            <Stack spacing={3}>
              {result.allocation_results.allocations.map((allocation, idx) => (
                <Paper key={idx} sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  backgroundColor: '#fafafa',
                }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #e0e0e0',
                    }}>
                      <Schedule sx={{ fontSize: 16, color: '#666666' }} />
                    </Box>
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#000000',
                    }}>
                      Shift ID: {allocation.shift_id}
                    </Typography>
                  </Stack>
                  
                  <List dense sx={{ pl: 0 }}>
                    {allocation.staff_assignments?.map((assignment, aidx) => (
                      <ListItem key={aidx} sx={{
                        px: 2,
                        py: 1.5,
                        mb: 1,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #f0f0f0',
                      }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            backgroundColor: '#f8f8f8',
                            border: '1px solid #e0e0e0',
                          }}>
                            <CheckCircle sx={{ fontSize: 14, color: '#000000' }} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#000000',
                              mb: 0.5,
                            }}>
                              Staff {assignment.staff_id}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{
                              fontSize: '12px',
                              color: '#666666',
                              fontWeight: 500,
                            }}>
                              Confidence: {(assignment.confidence_score * 100).toFixed(1)}% • {assignment.reasoning}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Fade>
      )}

      {/* Constraint Violations */}
      {result.constraint_validation?.violations?.length > 0 && (
        <Fade in timeout={1000}>
          <Accordion sx={{
            mb: 4,
            borderRadius: '16px !important',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            '&:before': { display: 'none' },
          }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#666666' }} />}
              sx={{
                p: 3,
                borderRadius: '16px',
                '&.Mui-expanded': {
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#ffebee',
                  border: '1px solid #ffcdd2',
                }}>
                  <ErrorIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
                </Box>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#d32f2f',
                }}>
                  Constraint Violations ({result.constraint_validation.violations.length})
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, pt: 0 }}>
              <List dense>
                {result.constraint_validation.violations.map((violation, idx) => (
                  <ListItem key={idx} sx={{
                    px: 2,
                    py: 1.5,
                    mb: 1,
                    borderRadius: '8px',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #ffebee',
                  }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Warning sx={{ fontSize: 18, color: '#d32f2f' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#d32f2f',
                          mb: 0.5,
                        }}>
                          {violation.message}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{
                          fontSize: '12px',
                          color: '#666666',
                          fontWeight: 500,
                        }}>
                          Shift: {violation.shift_id} • Staff: {violation.staff_id}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Fade>
      )}

      {/* Recommendations */}
      {result.allocation_results?.recommendations?.length > 0 && (
        <Fade in timeout={1100}>
          <Accordion sx={{
            mb: 4,
            borderRadius: '16px !important',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            '&:before': { display: 'none' },
          }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#666666' }} />}
              sx={{
                p: 3,
                borderRadius: '16px',
                '&.Mui-expanded': {
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#f0f8ff',
                  border: '1px solid #e3f2fd',
                }}>
                  <InfoIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                </Box>
                <Typography sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1976d2',
                }}>
                  AI Recommendations ({result.allocation_results.recommendations.length})
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, pt: 0 }}>
              <List dense>
                {result.allocation_results.recommendations.map((rec, idx) => (
                  <ListItem key={idx} sx={{
                    px: 2,
                    py: 1.5,
                    mb: 1,
                    borderRadius: '8px',
                    backgroundColor: '#f8faff',
                    border: '1px solid #e3f2fd',
                  }}>
                    <ListItemText 
                      primary={
                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1976d2',
                          mb: 0.5,
                        }}>
                          {rec.recommendation}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{
                          fontSize: '12px',
                          color: '#666666',
                          fontWeight: 500,
                        }}>
                          Impact: {rec.impact}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Fade>
      )}

      {/* Apply Section */}
      {result.allocation_results?.allocations?.length > 0 && (
        <Fade in timeout={1200}>
          <Paper sx={{
            p: 4,
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            textAlign: 'center',
          }}>
            <Button
              variant="contained"
              onClick={onApply}
              size="large"
              startIcon={result._isApplying ? null : <Save sx={{ fontSize: 20 }} />}
              disabled={!onApply || result._isApplying}
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '12px',
                px: 5,
                py: 2,
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                minWidth: '200px',
                mb: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: '#333333',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                },
                '&:disabled': {
                  backgroundColor: '#f0f0f0',
                  color: '#cccccc',
                  boxShadow: 'none',
                },
              }}
            >
              {result._isApplying ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={20} sx={{ color: '#cccccc' }} />
                  <span>Applying Allocation...</span>
                </Stack>
              ) : (
                'Apply This Allocation'
              )}
            </Button>
            
            {/* Application Results */}
            {result._applyResults && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                {result._applyResults.success.length > 0 && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      border: '1px solid #c8e6c9',
                      backgroundColor: '#f1f8e9',
                      '& .MuiAlert-icon': {
                        color: '#2e7d32',
                      },
                      '& .MuiAlert-message': {
                        color: '#2e7d32',
                        fontWeight: 500,
                      },
                    }}
                  >
                    Successfully applied {result._applyResults.success.length} assignment(s)
                  </Alert>
                )}
                
                {result._applyResults.skipped.length > 0 && (
                  <Alert 
                    severity="info"
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      border: '1px solid #bbdefb',
                      backgroundColor: '#e3f2fd',
                      '& .MuiAlert-icon': {
                        color: '#1976d2',
                      },
                      '& .MuiAlert-message': { 
                        width: '100%',
                        color: '#1976d2',
                      },
                    }}
                  >
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1976d2',
                      mb: 1,
                    }}>
                      {result._applyResults.skipped.length} assignment(s) skipped (already assigned)
                    </Typography>
                    <List dense sx={{ 
                      maxHeight: 150, 
                      overflow: 'auto', 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px',
                      border: '1px solid #e3f2fd',
                    }}>
                      {result._applyResults.skipped.map((skipped, idx) => (
                        <ListItem key={`skipped-${idx}`} sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <InfoIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#1976d2',
                              }}>
                                Shift {skipped.shift_id} - Staff {skipped.staff_id}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{
                                fontSize: '12px',
                                color: '#666666',
                              }}>
                                {skipped.message}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}
                
                {result._applyResults.failed.length > 0 && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      border: '1px solid #ffcdd2',
                      backgroundColor: '#ffebee',
                      '& .MuiAlert-icon': {
                        color: '#d32f2f',
                      },
                      '& .MuiAlert-message': { 
                        width: '100%',
                        color: '#d32f2f',
                      },
                    }}
                  >
                    <Typography sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#d32f2f',
                      mb: 1,
                    }}>
                      {result._applyResults.failed.length} assignment(s) failed
                    </Typography>
                    <List dense sx={{ 
                      maxHeight: 150, 
                      overflow: 'auto', 
                      backgroundColor: '#ffffff', 
                      borderRadius: '8px',
                      border: '1px solid #ffcdd2',
                    }}>
                      {result._applyResults.failed.map((fail, idx) => (
                        <ListItem key={`failed-${idx}`} sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <ErrorIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#d32f2f',
                              }}>
                                Shift {fail.shift_id} - Staff {fail.staff_id}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{
                                fontSize: '12px',
                                color: '#666666',
                              }}>
                                {fail.error}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}
              </Box>
            )}
            
            {!result._applyResults && result.success === false && (
              <Alert 
                severity="warning" 
                sx={{
                  mt: 2,
                  borderRadius: '12px',
                  border: '1px solid #fff3cd',
                  backgroundColor: '#fffbee',
                  '& .MuiAlert-icon': {
                    color: '#ed6c02',
                  },
                  '& .MuiAlert-message': {
                    color: '#ed6c02',
                    fontWeight: 500,
                  },
                }}
              >
                This allocation has some constraint violations, but you can still apply it if needed.
              </Alert>
            )}
            
            {result._applyError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3, 
                  textAlign: 'left',
                  borderRadius: '12px',
                  border: '1px solid #ffcdd2',
                  backgroundColor: '#ffebee',
                  '& .MuiAlert-icon': {
                    color: '#d32f2f',
                  },
                  '& .MuiAlert-message': {
                    color: '#d32f2f',
                    fontWeight: 500,
                  },
                }}
              >
                {typeof result._applyError === 'string' 
                  ? result._applyError 
                  : result._applyError?.message || 'An unknown error occurred'}
                
                {result._applyError?.response?.data?.detail && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{
                      fontSize: '12px',
                      color: '#d32f2f',
                    }}>
                      {typeof result._applyError.response.data.detail === 'string'
                        ? result._applyError.response.data.detail
                        : JSON.stringify(result._applyError.response.data.detail)}
                    </Typography>
                  </Box>
                )}
              </Alert>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
}