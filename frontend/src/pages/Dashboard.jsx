// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   Alert,
// } from '@mui/material';
// import {
//   People,
//   Schedule,
//   Warning,
//   TrendingUp,
//   Assignment,
//   CheckCircle,
// } from '@mui/icons-material';
// import { Line, Doughnut, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   BarElement,
// } from 'chart.js';
// import { dashboardAPI } from '../services/api';
// import LiveStatusWidget from '../components/dashboard/LiveStatusWidget';
// import AllocationSummary from '../components/dashboard/AllocationSummary';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Dashboard() {
//   const [metrics, setMetrics] = useState({
//     totalStaff: 0,
//     activeShifts: 0,
//     pendingAllocations: 0,
//     allocationEfficiency: 0,
//   });
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [metricsRes, activityRes, alertsRes] = await Promise.all([
//         dashboardAPI.getMetrics(),
//         dashboardAPI.getRecentActivity(),
//         dashboardAPI.getAlerts(),
//       ]);
      
//       setMetrics(metricsRes.data);
//       setRecentActivity(activityRes.data);
//       setAlerts(alertsRes.data);
//     } catch (error) {
//       console.error('Error loading dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chartData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: 'Staff Utilization',
//         data: [85, 89, 92, 78, 84, 67, 71],
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       },
//     ],
//   };

//   const staffDistribution = {
//     labels: ['Doctors', 'Nurses', 'Technicians', 'Support'],
//     datasets: [
//       {
//         data: [25, 45, 20, 10],
//         backgroundColor: [
//           '#FF6384',
//           '#36A2EB',
//           '#FFCE56',
//           '#4BC0C0',
//         ],
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: '100%' }}>
//         <LinearProgress />
//         <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Dashboard
//       </Typography>
      
//       {/* Alerts */}
//       {alerts.length > 0 && (
//         <Box sx={{ mb: 3 }}>
//           {alerts.map((alert, index) => (
//             <Alert 
//               key={index} 
//               severity={alert.severity} 
//               sx={{ mb: 1 }}
//             >
//               {alert.message}
//             </Alert>
//           ))}
//         </Box>
//       )}

//       <Grid container spacing={3}>
//         {/* Key Metrics */}
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <People color="primary" sx={{ mr: 2 }} />
//                 <Box>
//                   <Typography color="textSecondary" gutterBottom>
//                     Total Staff
//                   </Typography>
//                   <Typography variant="h5">
//                     {metrics.totalStaff}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <Schedule color="secondary" sx={{ mr: 2 }} />
//                 <Box>
//                   <Typography color="textSecondary" gutterBottom>
//                     Active Shifts
//                   </Typography>
//                   <Typography variant="h5">
//                     {metrics.activeShifts}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <Assignment color="warning" sx={{ mr: 2 }} />
//                 <Box>
//                   <Typography color="textSecondary" gutterBottom>
//                     Pending Allocations
//                   </Typography>
//                   <Typography variant="h5">
//                     {metrics.pendingAllocations}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <TrendingUp color="success" sx={{ mr: 2 }} />
//                 <Box>
//                   <Typography color="textSecondary" gutterBottom>
//                     Efficiency
//                   </Typography>
//                   <Typography variant="h5">
//                     {metrics.allocationEfficiency}%
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Live Status Widget */}
//         <Grid item xs={12} md={8}>
//           <LiveStatusWidget />
//         </Grid>

//         {/* Allocation Summary */}
//         <Grid item xs={12} md={4}>
//           <AllocationSummary />
//         </Grid>

//         {/* Staff Utilization Chart */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Staff Utilization Trends
//             </Typography>
//             <Line data={chartData} />
//           </Paper>
//         </Grid>

//         {/* Staff Distribution */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Staff Distribution
//             </Typography>
//             <Doughnut data={staffDistribution} />
//           </Paper>
//         </Grid>

//         {/* Recent Activity */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Activity
//             </Typography>
//             <List>
//               {recentActivity.map((activity, index) => (
//                 <ListItem key={index}>
//                   <ListItemIcon>
//                     <CheckCircle color="success" />
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={activity.description}
//                     secondary={activity.timestamp}
//                   />
//                   <Chip
//                     label={activity.type}
//                     size="small"
//                     color="primary"
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Container,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import {
  People,
  Schedule,
  Warning,
  TrendingUp,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { dashboardAPI } from '../services/api';
import LiveStatusWidget from '../components/dashboard/LiveStatusWidget';
import AllocationSummary from '../components/dashboard/AllocationSummary';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStaff: 0,
    activeShifts: 0,
    pendingAllocations: 0,
    allocationEfficiency: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, activityRes, alertsRes] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getAlerts(),
      ]);
      
      setMetrics(metricsRes.data);
      setRecentActivity(activityRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Staff Utilization',
        data: [85, 89, 92, 78, 84, 67, 71],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const staffDistribution = {
    labels: ['Doctors', 'Nurses', 'Technicians', 'Support'],
    datasets: [
      {
        data: [25, 45, 20, 10],
        backgroundColor: [
          '#000000',
          '#404040',
          '#606060',
          '#808080',
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500',
          },
          color: '#666666',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500',
          },
          color: '#666666',
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
          lineWidth: 1,
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500',
          },
          color: '#666666',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500',
          },
          color: '#666666',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  if (loading) {
    return (
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
        }}>
          <Box sx={{ 
            width: { xs: '280px', sm: '320px' }, 
            mb: 4 
          }}>
            <LinearProgress 
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: '#f5f5f5',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  bgcolor: '#000000',
                },
              }}
            />
          </Box>
          <Typography 
            sx={{ 
              color: '#666666', 
              fontWeight: 500,
              fontSize: { xs: '14px', sm: '15px' },
              letterSpacing: '0.5px',
            }}
          >
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  const MetricCard = ({ icon, title, value, delay = 0 }) => (
    <Grow in timeout={500 + delay}>
      <Card sx={{
        height: '100px',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          borderColor: '#d0d0d0',
        },
      }}>
        <CardContent sx={{ 
          p: '20px !important',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Box sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #e5e5e5',
              flexShrink: 0,
            }}>
              {React.cloneElement(icon, { 
                sx: { 
                  fontSize: 20, 
                  color: '#000000' 
                } 
              })}
            </Box>
            <Box sx={{ 
              flex: 1,
              minWidth: 0, // Prevents overflow
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666666', 
                  fontWeight: 600,
                  fontSize: '10px',
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  lineHeight: 1,
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '18px', sm: '22px' },
                  lineHeight: 1,
                  color: '#000000',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 4, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Fade in timeout={300}>
        <Box>
          {/* Page Header */}
          <Box sx={{ 
            mb: { xs: 6, md: 8 },
            textAlign: { xs: 'center', sm: 'left' },
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900,
                color: '#000000',
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
                letterSpacing: '-0.03em',
                lineHeight: { xs: 1.1, md: 1 },
                mb: 2,
              }}
            >
              Dashboard
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                maxWidth: '600px',
              }}
            >
              Monitor staff allocation, track performance metrics, and manage shifts in real-time
            </Typography>
          </Box>
          
          {/* Alerts Section */}
          {alerts.length > 0 && (
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Stack spacing={3}>
                {alerts.map((alert, index) => (
                  <Fade in timeout={500 + index * 100} key={index}>
                    <Alert 
                      severity={alert.severity}
                      sx={{ 
                        borderRadius: '12px',
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fafafa',
                        color: '#333333',
                        py: 2,
                        px: 3,
                        '& .MuiAlert-icon': {
                          fontSize: '20px',
                          color: '#000000',
                          mt: 0.5,
                        },
                        '& .MuiAlert-message': {
                          fontWeight: 500,
                          fontSize: '15px',
                          pt: 0.5,
                        },
                      }}
                    >
                      {alert.message}
                    </Alert>
                  </Fade>
                ))}
              </Stack>
            </Box>
          )}

          {/* Main Content Grid */}
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {/* Key Metrics Row */}
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 3, sm: 4 }}>
                <Grid item xs={12} sm={6} lg={3}>
                  <MetricCard
                    icon={<People />}
                    title="Total Staff"
                    value={metrics.totalStaff}
                    delay={0}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <MetricCard
                    icon={<Schedule />}
                    title="Active Shifts"
                    value={metrics.activeShifts}
                    delay={100}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <MetricCard
                    icon={<TrendingUp />}
                    title="Efficiency"
                    value={`${metrics.allocationEfficiency}%`}
                    delay={200}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <MetricCard
                    icon={<Assignment />}
                    title="Pending Allocations"
                    value={metrics.pendingAllocations}
                    delay={300}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Main Widgets Row */}
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
                {/* Live Status Widget */}
                <Grid item xs={12} lg={8}>
                  <Grow in timeout={800}>
                    <Box sx={{ height: '100%' }}>
                      <LiveStatusWidget />
                    </Box>
                  </Grow>
                </Grid>

                {/* Allocation Summary */}
                <Grid item xs={12} lg={4}>
                  <Grow in timeout={900}>
                    <Box sx={{ height: '100%' }}>
                      <AllocationSummary />
                    </Box>
                  </Grow>
                </Grid>
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
                {/* Staff Utilization Chart */}
                <Grid item xs={12} lg={8}>
                  <Grow in timeout={1000}>
                    <Paper sx={{ 
                      p: { xs: 4, sm: 5, md: 6 },
                      height: { xs: 'auto', lg: '460px' },
                      borderRadius: '16px',
                      border: '1px solid #e5e5e5',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <Box sx={{ mb: 4 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#000000',
                            fontSize: { xs: '18px', sm: '20px', md: '22px' },
                            mb: 1,
                          }}
                        >
                          Staff Utilization Trends
                        </Typography>
                        <Typography
                          sx={{
                            color: '#666666',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}
                        >
                          Weekly performance overview
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        flex: 1,
                        height: { xs: '300px', lg: 'auto' },
                        minHeight: '300px',
                      }}>
                        <Line data={chartData} options={chartOptions} />
                      </Box>
                    </Paper>
                  </Grow>
                </Grid>

                {/* Staff Distribution */}
                <Grid item xs={12} lg={4}>
                  <Grow in timeout={1100}>
                    <Paper sx={{ 
                      p: { xs: 4, sm: 5, md: 6 },
                      height: { xs: 'auto', lg: '460px' },
                      borderRadius: '16px',
                      border: '1px solid #e5e5e5',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <Box sx={{ mb: 4 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#000000',
                            fontSize: { xs: '18px', sm: '20px', md: '22px' },
                            mb: 1,
                          }}
                        >
                          Staff Distribution
                        </Typography>
                        <Typography
                          sx={{
                            color: '#666666',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}
                        >
                          Department breakdown
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        flex: 1,
                        height: { xs: '300px', lg: 'auto' },
                        minHeight: '300px',
                      }}>
                        <Doughnut data={staffDistribution} options={doughnutOptions} />
                      </Box>
                    </Paper>
                  </Grow>
                </Grid>
              </Grid>
            </Grid>

            {/* Recent Activity Full Width */}
            <Grid item xs={12}>
              <Grow in timeout={1200}>
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
                      Recent Activity
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666666',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      Latest system events and notifications
                    </Typography>
                  </Box>

                  <List sx={{ p: 0 }}>
                    {recentActivity.map((activity, index) => (
                      <Fade in timeout={1300 + index * 100} key={index}>
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
                              <CheckCircle sx={{ color: '#000000', fontSize: 20 }} />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            sx={{ ml: 2 }}
                            primary={
                              <Typography sx={{ 
                                fontWeight: 600, 
                                color: '#000000',
                                fontSize: { xs: '14px', sm: '15px' },
                                mb: 1,
                                lineHeight: 1.4,
                              }}>
                                {activity.description}
                              </Typography>
                            }
                            secondary={
                              <Typography sx={{ 
                                color: '#666666', 
                                fontSize: { xs: '12px', sm: '13px' },
                                fontWeight: 500,
                                lineHeight: 1.3,
                              }}>
                                {activity.timestamp}
                              </Typography>
                            }
                          />
                          <Box sx={{ ml: 'auto', pl: 2 }}>
                            <Chip
                              label={activity.type}
                              size="small"
                              sx={{
                                backgroundColor: '#f0f0f0',
                                color: '#000000',
                                fontWeight: 600,
                                fontSize: '11px',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                height: '28px',
                                '&:hover': {
                                  backgroundColor: '#e0e0e0',
                                },
                              }}
                            />
                          </Box>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>
                </Paper>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
}