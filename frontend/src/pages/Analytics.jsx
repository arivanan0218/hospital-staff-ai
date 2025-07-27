// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Tabs,
//   Tab,
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import {
//   Line,
//   Bar,
//   Doughnut,
//   Scatter,
// } from 'react-chartjs-2';
// import { allocationAPI } from '../services/api';
// import { format, subDays, subMonths } from 'date-fns';

// export default function Analytics() {
//   const [tabValue, setTabValue] = useState(0);
//   const [timeRange, setTimeRange] = useState('30days');
//   const [analytics, setAnalytics] = useState({
//     allocation_success_rate: 0,
//     average_satisfaction: 0,
//     cost_efficiency: 0,
//     constraint_compliance: 0,
//     trends: [],
//     staff_utilization: [],
//     shift_coverage: [],
//   });

//   useEffect(() => {
//     loadAnalytics();
//   }, [timeRange]);

//   const loadAnalytics = async () => {
//     try {
//       const response = await allocationAPI.getAnalytics();
//       setAnalytics(response.data);
//     } catch (error) {
//       console.error('Error loading analytics:', error);
//     }
//   };

//   const allocationTrendsData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [
//       {
//         label: 'Success Rate %',
//         data: [85, 89, 92, 88],
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.1,
//       },
//       {
//         label: 'Satisfaction Score',
//         data: [7.8, 8.1, 8.5, 8.2],
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         tension: 0.1,
//       },
//     ],
//   };

//   const staffUtilizationData = {
//     labels: ['Doctors', 'Nurses', 'Technicians', 'Support'],
//     datasets: [
//       {
//         label: 'Utilization Rate',
//         data: [78, 92, 67, 54],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.8)',
//           'rgba(54, 162, 235, 0.8)',
//           'rgba(255, 205, 86, 0.8)',
//           'rgba(75, 192, 192, 0.8)',
//         ],
//       },
//     ],
//   };

//   const costAnalysisData = {
//     labels: ['Regular Hours', 'Overtime', 'Premium Shifts', 'Emergency Coverage'],
//     datasets: [
//       {
//         data: [65, 20, 10, 5],
//         backgroundColor: [
//           '#36A2EB',
//           '#FF6384',
//           '#FFCE56',
//           '#4BC0C0',
//         ],
//       },
//     ],
//   };

//   const renderOverviewTab = () => (
//     <Grid container spacing={3}>
//       <Grid item xs={12} sm={6} md={3}>
//         <Card>
//           <CardContent>
//             <Typography color="textSecondary" gutterBottom>
//               Success Rate
//             </Typography>
//             <Typography variant="h4" color="primary">
//               {analytics.allocation_success_rate}%
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
      
//       <Grid item xs={12} sm={6} md={3}>
//         <Card>
//           <CardContent>
//             <Typography color="textSecondary" gutterBottom>
//               Avg Satisfaction
//             </Typography>
//             <Typography variant="h4" color="secondary">
//               {analytics.average_satisfaction}/10
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
      
//       <Grid item xs={12} sm={6} md={3}>
//         <Card>
//           <CardContent>
//             <Typography color="textSecondary" gutterBottom>
//               Cost Efficiency
//             </Typography>
//             <Typography variant="h4" color="success.main">
//               {analytics.cost_efficiency}%
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
      
//       <Grid item xs={12} sm={6} md={3}>
//         <Card>
//           <CardContent>
//             <Typography color="textSecondary" gutterBottom>
//               Compliance
//             </Typography>
//             <Typography variant="h4" color="warning.main">
//               {analytics.constraint_compliance}%
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>

//       <Grid item xs={12} md={8}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Allocation Performance Trends
//           </Typography>
//           <Line data={allocationTrendsData} />
//         </Paper>
//       </Grid>

//       <Grid item xs={12} md={4}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Cost Distribution
//           </Typography>
//           <Doughnut data={costAnalysisData} />
//         </Paper>
//       </Grid>
//     </Grid>
//   );

//   const renderStaffTab = () => (
//     <Grid container spacing={3}>
//       <Grid item xs={12} md={6}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Staff Utilization by Role
//           </Typography>
//           <Bar data={staffUtilizationData} />
//         </Paper>
//       </Grid>
      
//       <Grid item xs={12} md={6}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Overtime Analysis
//           </Typography>
//           {/* Add overtime chart here */}
//         </Paper>
//       </Grid>
//     </Grid>
//   );

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">
//           Analytics Dashboard
//         </Typography>
        
//         <Box display="flex" gap={2}>
//           <FormControl size="small">
//             <InputLabel>Time Range</InputLabel>
//             <Select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//             >
//               <MenuItem value="7days">Last 7 Days</MenuItem>
//               <MenuItem value="30days">Last 30 Days</MenuItem>
//               <MenuItem value="90days">Last 3 Months</MenuItem>
//               <MenuItem value="1year">Last Year</MenuItem>
//             </Select>
//           </FormControl>
          
//           <Button variant="outlined" onClick={loadAnalytics}>
//             Refresh
//           </Button>
//         </Box>
//       </Box>

//       <Paper sx={{ width: '100%' }}>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Overview" />
//           <Tab label="Staff Analytics" />
//           <Tab label="Shift Analytics" />
//           <Tab label="AI Performance" />
//         </Tabs>
        
//         <Box sx={{ p: 3 }}>
//           {tabValue === 0 && renderOverviewTab()}
//           {tabValue === 1 && renderStaffTab()}
//           {tabValue === 2 && <Typography>Shift Analytics Coming Soon</Typography>}
//           {tabValue === 3 && <Typography>AI Performance Metrics Coming Soon</Typography>}
//         </Box>
//       </Paper>
//     </Box>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  Container,
  Fade,
  Grow,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Line,
  Bar,
  Doughnut,
  Scatter,
} from 'react-chartjs-2';
import { 
  TrendingUp, 
  People, 
  AttachMoney, 
  Assignment,
  Refresh 
} from '@mui/icons-material';
import { allocationAPI } from '../services/api';
import { format, subDays, subMonths } from 'date-fns';

export default function Analytics() {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    allocation_success_rate: 92,
    average_satisfaction: 8.4,
    cost_efficiency: 87,
    constraint_compliance: 94,
    trends: [],
    staff_utilization: [],
    shift_coverage: [],
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const response = await allocationAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  // Monochromatic chart styling
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

  const allocationTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Success Rate %',
        data: [85, 89, 92, 88],
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
      {
        label: 'Satisfaction Score',
        data: [7.8, 8.1, 8.5, 8.2],
        borderColor: '#404040',
        backgroundColor: 'rgba(64, 64, 64, 0.02)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#404040',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const staffUtilizationData = {
    labels: ['Doctors', 'Nurses', 'Technicians', 'Support'],
    datasets: [
      {
        label: 'Utilization Rate',
        data: [78, 92, 67, 54],
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

  const costAnalysisData = {
    labels: ['Regular Hours', 'Overtime', 'Premium Shifts', 'Emergency Coverage'],
    datasets: [
      {
        data: [65, 20, 10, 5],
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

  const MetricCard = ({ icon, title, value, delay = 0 }) => (
    <Grow in timeout={500 + delay}>
      <Card sx={{
        height: '120px',
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
          p: '24px !important',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2}
            sx={{ mb: 2 }}
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
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666666', 
                fontWeight: 600,
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                lineHeight: 1,
              }}
            >
              {title}
            </Typography>
          </Stack>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '24px', sm: '28px' },
              lineHeight: 1,
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  const renderOverviewTab = () => (
    <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
      <Grid item xs={12}>
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              icon={<TrendingUp />}
              title="Success Rate"
              value={`${analytics.allocation_success_rate}%`}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              icon={<People />}
              title="Avg Satisfaction"
              value={`${analytics.average_satisfaction}/10`}
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              icon={<AttachMoney />}
              title="Cost Efficiency"
              value={`${analytics.cost_efficiency}%`}
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <MetricCard
              icon={<Assignment />}
              title="Compliance"
              value={`${analytics.constraint_compliance}%`}
              delay={300}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={8}>
        <Grow in timeout={800}>
          <Paper sx={{ 
            p: { xs: 4, sm: 5, md: 6 },
            height: '460px',
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
                Allocation Performance Trends
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
            <Box sx={{ flex: 1, minHeight: '300px' }}>
              <Line data={allocationTrendsData} options={chartOptions} />
            </Box>
          </Paper>
        </Grow>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Grow in timeout={900}>
          <Paper sx={{ 
            p: { xs: 4, sm: 5, md: 6 },
            height: '460px',
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
                Cost Distribution
              </Typography>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Budget allocation breakdown
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: '300px' }}>
              <Doughnut data={costAnalysisData} options={doughnutOptions} />
            </Box>
          </Paper>
        </Grow>
      </Grid>
    </Grid>
  );

  const renderStaffTab = () => (
    <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
      <Grid item xs={12} md={6}>
        <Grow in timeout={500}>
          <Paper sx={{ 
            p: { xs: 4, sm: 5, md: 6 },
            height: '460px',
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
                Staff Utilization by Role
              </Typography>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Department efficiency rates
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: '300px' }}>
              <Bar data={staffUtilizationData} options={chartOptions} />
            </Box>
          </Paper>
        </Grow>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Grow in timeout={600}>
          <Paper sx={{ 
            p: { xs: 4, sm: 5, md: 6 },
            height: '460px',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#000000',
                fontSize: { xs: '18px', sm: '20px', md: '22px' },
                mb: 2,
              }}
            >
              Overtime Analysis
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Coming Soon
            </Typography>
          </Paper>
        </Grow>
      </Grid>
    </Grid>
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
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: { xs: 6, md: 8 },
            gap: { xs: 3, sm: 0 },
          }}>
            <Box>
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
                Analytics
              </Typography>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 500,
                  maxWidth: '600px',
                }}
              >
                Comprehensive performance insights and data visualization
              </Typography>
            </Box>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ minWidth: { xs: 'auto', sm: '300px' } }}
            >
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: '140px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e5',
                    '&:hover': {
                      borderColor: '#d0d0d0',
                    },
                    '&.Mui-focused': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666666',
                    fontWeight: 500,
                    fontSize: '14px',
                  },
                }}
              >
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="90days">Last 3 Months</MenuItem>
                  <MenuItem value="1year">Last Year</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                onClick={loadAnalytics}
                startIcon={<Refresh />}
                sx={{
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#d0d0d0',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {/* Main Content */}
          <Paper sx={{ 
            width: '100%',
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ 
                borderBottom: '1px solid #f0f0f0',
                px: { xs: 2, sm: 4 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#666666',
                  minHeight: '60px',
                  px: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    color: '#000000',
                  },
                  '&.Mui-selected': {
                    color: '#000000',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#000000',
                  height: '3px',
                  borderRadius: '2px',
                },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Staff Analytics" />
              <Tab label="Shift Analytics" />
              <Tab label="AI Performance" />
            </Tabs>
            
            <Box sx={{ p: { xs: 4, sm: 5, md: 6 } }}>
              {tabValue === 0 && renderOverviewTab()}
              {tabValue === 1 && renderStaffTab()}
              {tabValue === 2 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography 
                    variant="h5"
                    sx={{ 
                      fontWeight: 700,
                      color: '#000000',
                      mb: 2,
                    }}
                  >
                    Shift Analytics
                  </Typography>
                  <Typography sx={{ color: '#666666', fontWeight: 500 }}>
                    Coming Soon
                  </Typography>
                </Box>
              )}
              {tabValue === 3 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography 
                    variant="h5"
                    sx={{ 
                      fontWeight: 700,
                      color: '#000000',
                      mb: 2,
                    }}
                  >
                    AI Performance Metrics
                  </Typography>
                  <Typography sx={{ color: '#666666', fontWeight: 500 }}>
                    Coming Soon
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}