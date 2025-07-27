// import React from 'react';
// import { 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions, 
//   Button,
//   Typography,
//   Box 
// } from '@mui/material';

// export default function AllocationScenarioRunner({ open, onClose, availableShifts }) {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Allocation Scenario Runner</DialogTitle>
//       <DialogContent>
//         <Box sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Scenario Analysis
//           </Typography>
//           <Typography>
//             Compare different allocation strategies and scenarios.
//           </Typography>
//           <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
//             This feature will allow you to run multiple allocation scenarios
//             and compare their effectiveness, cost, and staff satisfaction.
//           </Typography>
//         </Box>
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
  Paper,
  Stack,
  IconButton,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Close,
  TrendingUp,
  CompareArrows,
  Analytics,
  Timeline,
  Assessment,
  Speed,
  Psychology,
  Schedule,
  People,
  AttachMoney,
} from '@mui/icons-material';

export default function AllocationScenarioRunner({ open, onClose, availableShifts }) {
  const scenarioFeatures = [
    {
      icon: <CompareArrows />,
      title: 'Multiple Scenarios',
      description: 'Run and compare different allocation strategies side by side'
    },
    {
      icon: <Analytics />,
      title: 'Performance Metrics',
      description: 'Analyze cost efficiency, staff satisfaction, and coverage quality'
    },
    {
      icon: <Timeline />,
      title: 'Predictive Analysis',
      description: 'Forecast outcomes and identify potential optimization opportunities'
    },
    {
      icon: <Speed />,
      title: 'Real-time Comparison',
      description: 'Instantly compare scenarios with live performance indicators'
    }
  ];

  const mockScenarios = [
    {
      name: 'Cost Optimized',
      description: 'Minimize operational costs while maintaining coverage',
      metrics: { cost: 85, satisfaction: 72, coverage: 95 }
    },
    {
      name: 'Satisfaction Focused',
      description: 'Maximize staff satisfaction and work-life balance',
      metrics: { cost: 65, satisfaction: 94, coverage: 88 }
    },
    {
      name: 'Balanced Approach',
      description: 'Optimal balance between all key performance indicators',
      metrics: { cost: 78, satisfaction: 83, coverage: 92 }
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          maxHeight: '95vh',
          margin: '16px',
          width: 'calc(100% - 32px)',
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
          p: 3,
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
              <TrendingUp sx={{ fontSize: 24, color: '#000000' }} />
            </Box>
            <Box>
              <Typography sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1.2,
              }}>
                Allocation Scenario Runner
              </Typography>
              <Typography sx={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#666666',
                mt: 0.5,
              }}>
                Advanced scenario analysis and comparison tools
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

      <DialogContent sx={{ 
        p: 4,
        overflow: 'auto',
        maxHeight: 'calc(95vh - 180px)',
      }}>
        {/* Overview Section */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#000000',
            mb: 2,
          }}>
            Scenario Analysis Overview
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666',
            fontWeight: 500,
            lineHeight: 1.6,
            mb: 3,
          }}>
            Compare different allocation strategies and scenarios to find the optimal approach 
            for your specific requirements. Analyze performance across multiple dimensions including 
            cost efficiency, staff satisfaction, and coverage quality.
          </Typography>

          {/* Feature Grid */}
          <Grid container spacing={3}>
            {scenarioFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  backgroundColor: '#fafafa',
                  height: '100%',
                }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Box sx={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #e0e0e0',
                      flexShrink: 0,
                    }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { fontSize: 16, color: '#666666' } 
                      })}
                    </Box>
                    <Box>
                      <Typography sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000000',
                        mb: 0.5,
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{
                        fontSize: '12px',
                        color: '#666666',
                        fontWeight: 500,
                        lineHeight: 1.4,
                      }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: '#f0f0f0' }} />

        {/* Sample Scenarios */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#000000',
            mb: 2,
          }}>
            Sample Allocation Scenarios
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#666666',
            fontWeight: 500,
            lineHeight: 1.6,
            mb: 3,
          }}>
            Preview different optimization strategies and their expected performance outcomes.
          </Typography>

          <Stack spacing={3}>
            {mockScenarios.map((scenario, index) => (
              <Paper key={index} sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                backgroundColor: '#ffffff',
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#000000',
                    mb: 0.5,
                  }}>
                    {scenario.name}
                  </Typography>
                  <Typography sx={{
                    fontSize: '13px',
                    color: '#666666',
                    fontWeight: 500,
                  }}>
                    {scenario.description}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <AttachMoney sx={{ fontSize: 16, color: '#666666' }} />
                    <Typography sx={{ fontSize: '12px', color: '#666666', fontWeight: 500 }}>
                      Cost Efficiency:
                    </Typography>
                    <Chip
                      label={`${scenario.metrics.cost}%`}
                      size="small"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '20px',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <People sx={{ fontSize: 16, color: '#666666' }} />
                    <Typography sx={{ fontSize: '12px', color: '#666666', fontWeight: 500 }}>
                      Satisfaction:
                    </Typography>
                    <Chip
                      label={`${scenario.metrics.satisfaction}%`}
                      size="small"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '20px',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Schedule sx={{ fontSize: 16, color: '#666666' }} />
                    <Typography sx={{ fontSize: '12px', color: '#666666', fontWeight: 500 }}>
                      Coverage:
                    </Typography>
                    <Chip
                      label={`${scenario.metrics.coverage}%`}
                      size="small"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '20px',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: '#f0f0f0' }} />

        {/* Coming Soon Features */}
        <Box>
          <Typography sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#000000',
            mb: 2,
          }}>
            Advanced Features (Coming Soon)
          </Typography>

          <List sx={{ p: 0 }}>
            <ListItem sx={{
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              border: '1px solid #f0f0f0',
              mb: 1,
            }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Assessment sx={{ fontSize: 18, color: '#666666' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    Historical Performance Analysis
                  </Typography>
                }
                secondary={
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#666666',
                    fontWeight: 500,
                  }}>
                    Compare current scenarios against historical allocation performance
                  </Typography>
                }
              />
            </ListItem>

            <ListItem sx={{
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              border: '1px solid #f0f0f0',
              mb: 1,
            }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Psychology sx={{ fontSize: 18, color: '#666666' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    AI-Powered Scenario Generation
                  </Typography>
                }
                secondary={
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#666666',
                    fontWeight: 500,
                  }}>
                    Automatically generate optimized scenarios based on your constraints
                  </Typography>
                }
              />
            </ListItem>

            <ListItem sx={{
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              border: '1px solid #f0f0f0',
            }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Timeline sx={{ fontSize: 18, color: '#666666' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#000000',
                  }}>
                    Predictive Impact Modeling
                  </Typography>
                }
                secondary={
                  <Typography sx={{
                    fontSize: '12px',
                    color: '#666666',
                    fontWeight: 500,
                  }}>
                    Forecast long-term effects of different allocation strategies
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3,
        pt: 2,
        borderTop: '1px solid #f0f0f0',
        justifyContent: 'flex-end',
      }}>
        <Button 
          onClick={onClose}
          sx={{
            backgroundColor: '#f8f8f8',
            color: '#666666',
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
              color: '#000000',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}