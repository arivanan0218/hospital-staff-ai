import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Typography, 
  Paper,
  Chip 
} from '@mui/material';
import { Warning, Error, Info } from '@mui/icons-material';

export default function ConstraintViolationsList({ violations = [] }) {
  const getIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error color="error" />;
      case 'medium': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Constraint Violations
      </Typography>
      
      {violations.length === 0 ? (
        <Typography color="success.main">
          ✅ No constraint violations found
        </Typography>
      ) : (
        <List>
          {violations.map((violation, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                {getIcon(violation.severity)}
              </ListItemIcon>
              <ListItemText
                primary={violation.description}
                secondary={violation.suggested_fix}
              />
              <Chip 
                label={violation.severity}
                color={getColor(violation.severity)}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
