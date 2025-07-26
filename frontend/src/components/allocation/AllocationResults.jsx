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
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';

export default function AllocationResults({ result, onApply }) {
  if (!result) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No allocation results to display</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        AI Allocation Results
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Confidence Score
          </Typography>
          <Typography variant="h5" color="primary">
            {((result.confidence_score || 0) * 100).toFixed(1)}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Status
          </Typography>
          <Chip
            icon={result.success !== false ? <CheckCircle /> : <Warning />}
            label={result.success !== false ? 'Success' : 'Has Issues'}
            color={result.success !== false ? 'success' : 'warning'}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Shifts Processed: {result.shifts_processed || 0}
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Staff Considered: {result.staff_considered || 0}
        </Typography>

        {result.allocation_results?.allocations?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Allocations
            </Typography>
            <List dense>
              {result.allocation_results.allocations.map((allocation, idx) => (
                <Paper key={idx} sx={{ mb: 2, p: 1, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2">
                    Shift ID: {allocation.shift_id}
                  </Typography>
                  <List dense>
                    {allocation.staff_assignments?.map((assignment, aidx) => (
                      <ListItem key={aidx}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Staff ${assignment.staff_id}`}
                          secondary={`Confidence: ${(assignment.confidence_score * 100).toFixed(1)}% - ${assignment.reasoning}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </List>
          </Box>
        )}

        {result.constraint_validation?.violations?.length > 0 && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color="error">
                <ErrorIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Constraint Violations ({result.constraint_validation.violations.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {result.constraint_validation.violations.map((violation, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <Warning color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={violation.message}
                      secondary={`Shift: ${violation.shift_id}, Staff: ${violation.staff_id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {result.allocation_results?.recommendations?.length > 0 && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color="info">
                <InfoIcon color="info" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recommendations ({result.allocation_results.recommendations.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {result.allocation_results.recommendations.map((rec, idx) => (
                  <ListItem key={idx}>
                    <ListItemText 
                      primary={rec.recommendation}
                      secondary={`Impact: ${rec.impact}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Show Apply button if there are allocations */}
      {result.allocation_results?.allocations?.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="success"
            onClick={onApply}
            size="large"
            startIcon={<CheckCircle />}
            disabled={!onApply || result._isApplying}
            sx={{
              minWidth: 200,
              mb: 2,
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'text.disabled'
              }
            }}
          >
            {result._isApplying ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Applying...
              </>
            ) : (
              'Apply This Allocation'
            )}
          </Button>
          
          {/* Show allocation results if available */}
          {result._applyResults && (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              {result._applyResults.success.length > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Successfully applied {result._applyResults.success.length} assignment(s)
                </Alert>
              )}
              
              {result._applyResults.skipped.length > 0 && (
                <Alert 
                  severity="info"
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {result._applyResults.skipped.length} assignment(s) skipped (already assigned)
                  </Typography>
                  <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'background.paper', mt: 1 }}>
                    {result._applyResults.skipped.map((skipped, idx) => (
                      <ListItem key={`skipped-${idx}`} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Shift ${skipped.shift_id} - Staff ${skipped.staff_id}`}
                          secondary={skipped.message}
                          secondaryTypographyProps={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
              
              {result._applyResults.failed.length > 0 && (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {result._applyResults.failed.length} assignment(s) failed
                  </Typography>
                  <List dense sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'background.paper', mt: 1 }}>
                    {result._applyResults.failed.map((fail, idx) => (
                      <ListItem key={`failed-${idx}`} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ErrorIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Shift ${fail.shift_id} - Staff ${fail.staff_id}`}
                          secondary={fail.error}
                          secondaryTypographyProps={{ color: 'error.main' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
              
              {(result._applyResults.success.length > 0 || result._applyResults.skipped.length > 0) && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {result._applyResults.success.length + result._applyResults.skipped.length} out of 
                  {result._applyResults.success.length + result._applyResults.skipped.length + result._applyResults.failed.length} 
                  assignments were successfully processed.
                </Alert>
              )}
            </Box>
          )}
          
          {!result._applyResults && result.success === false && (
            <Typography color="warning.main" variant="body2" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
              <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              This allocation has some constraint violations, but you can still apply it.
            </Typography>
          )}
          
          {result._applyError && (
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              {typeof result._applyError === 'string' 
                ? result._applyError 
                : result._applyError?.message || 'An unknown error occurred'}
              
              {result._applyError?.response?.data?.detail && (
                <Box component="div" sx={{ mt: 1 }}>
                  <Typography variant="body2" component="span">
                    {typeof result._applyError.response.data.detail === 'string'
                      ? result._applyError.response.data.detail
                      : JSON.stringify(result._applyError.response.data.detail)}
                  </Typography>
                </Box>
              )}
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
}
