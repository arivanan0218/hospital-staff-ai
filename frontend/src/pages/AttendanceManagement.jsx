import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent 
} from '@mui/material';
import { Assignment, AccessTime, People } from '@mui/icons-material';

export default function AttendanceManagement() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
        Attendance Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Staff Present Today
                  </Typography>
                  <Typography variant="h5">
                    23/30
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTime color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average Hours
                  </Typography>
                  <Typography variant="h5">
                    7.5h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon
        </Typography>
        <Typography>
          Attendance tracking features will be available soon, including:
        </Typography>
        <ul>
          <li>Clock in/out functionality</li>
          <li>Break time tracking</li>
          <li>Overtime calculations</li>
          <li>Absence management</li>
          <li>Attendance reports</li>
        </ul>
      </Paper>
    </Box>
  );
}
