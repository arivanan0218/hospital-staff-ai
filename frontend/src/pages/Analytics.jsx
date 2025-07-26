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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Line,
  Bar,
  Doughnut,
  Scatter,
} from 'react-chartjs-2';
import { allocationAPI } from '../services/api';
import { format, subDays, subMonths } from 'date-fns';

export default function Analytics() {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    allocation_success_rate: 0,
    average_satisfaction: 0,
    cost_efficiency: 0,
    constraint_compliance: 0,
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

  const allocationTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Success Rate %',
        data: [85, 89, 92, 88],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Satisfaction Score',
        data: [7.8, 8.1, 8.5, 8.2],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
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
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  const costAnalysisData = {
    labels: ['Regular Hours', 'Overtime', 'Premium Shifts', 'Emergency Coverage'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="h4" color="primary">
              {analytics.allocation_success_rate}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg Satisfaction
            </Typography>
            <Typography variant="h4" color="secondary">
              {analytics.average_satisfaction}/10
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Cost Efficiency
            </Typography>
            <Typography variant="h4" color="success.main">
              {analytics.cost_efficiency}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Compliance
            </Typography>
            <Typography variant="h4" color="warning.main">
              {analytics.constraint_compliance}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Allocation Performance Trends
          </Typography>
          <Line data={allocationTrendsData} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Cost Distribution
          </Typography>
          <Doughnut data={costAnalysisData} />
        </Paper>
      </Grid>
    </Grid>
  );

  const renderStaffTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Staff Utilization by Role
          </Typography>
          <Bar data={staffUtilizationData} />
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Overtime Analysis
          </Typography>
          {/* Add overtime chart here */}
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Analytics Dashboard
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 3 Months</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="outlined" onClick={loadAnalytics}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" />
          <Tab label="Staff Analytics" />
          <Tab label="Shift Analytics" />
          <Tab label="AI Performance" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && renderOverviewTab()}
          {tabValue === 1 && renderStaffTab()}
          {tabValue === 2 && <Typography>Shift Analytics Coming Soon</Typography>}
          {tabValue === 3 && <Typography>AI Performance Metrics Coming Soon</Typography>}
        </Box>
      </Paper>
    </Box>
  );
}