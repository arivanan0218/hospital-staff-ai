import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Person,
  Email,
  Phone,
  Work,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, createStaff, updateStaff, deleteStaff, setFilters } from '../store/slices/staffSlice';
import StaffDetailsDialog from '../components/staff/StaffDetailsDialog';
import StaffFormDialog from '../components/staff/StaffFormDialog';

export default function StaffManagement() {
  const dispatch = useDispatch();
  const { list: staff, loading, filters, pagination } = useSelector(state => state.staff);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchStaff({ skip: page * rowsPerPage, limit: rowsPerPage, filters }));
  }, [dispatch, page, rowsPerPage, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setShowDetailsDialog(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setEditMode(true);
    setShowFormDialog(true);
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      await dispatch(deleteStaff(staffId));
    }
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setEditMode(false);
    setShowFormDialog(true);
  };

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'technician': return '🔬';
      case 'administrator': return '💼';
      case 'support': return '🛠️';
      default: return '👤';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Staff Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 2 }}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddStaff}
          >
            Add Staff
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="nurse">Nurse</MenuItem>
                  <MenuItem value="technician">Technician</MenuItem>
                  <MenuItem value="administrator">Administrator</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Name"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Staff Cards View for Mobile */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Grid container spacing={2}>
          {staff.map((member) => (
            <Grid item xs={12} sm={6} key={member.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getRoleIcon(member.role)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {member.first_name} {member.last_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {member.role}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Email fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{member.email}</Typography>
                  </Box>
                  
                  {member.phone && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Phone fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{member.phone}</Typography>
                    </Box>
                  )}
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      label={member.status}
                      color={getStatusColor(member.status)}
                      size="small"
                    />
                    <Box>
                      <IconButton size="small" onClick={() => handleViewStaff(member)}>
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditStaff(member)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteStaff(member.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Staff Table View for Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Hourly Rate</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {member.first_name[0]}{member.last_name[0]}
                      </Avatar>
                      {member.first_name} {member.last_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.role}
                      size="small"
                      variant="outlined"
                      icon={<span>{getRoleIcon(member.role)}</span>}
                    />
                  </TableCell>
                  <TableCell>{member.department?.name || 'Unassigned'}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      color={getStatusColor(member.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${member.hourly_rate}/hr</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewStaff(member)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditStaff(member)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDeleteStaff(member.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add staff"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={handleAddStaff}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      <StaffDetailsDialog
        open={showDetailsDialog}
        staff={selectedStaff}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedStaff(null);
        }}
      />

      <StaffFormDialog
        open={showFormDialog}
        staff={editMode ? selectedStaff : null}
        error={formError}
        onClose={() => {
          setShowFormDialog(false);
          setSelectedStaff(null);
          setEditMode(false);
          setFormError(null);
        }}
        onSave={async (staffData) => {
          try {
            setFormError(null);
            if (editMode && selectedStaff) {
              await dispatch(updateStaff({ id: selectedStaff.id, data: staffData })).unwrap();
            } else {
              await dispatch(createStaff(staffData)).unwrap();
            }
            setShowFormDialog(false);
            setSelectedStaff(null);
            setEditMode(false);
          } catch (error) {
            // Error is already logged in the thunk
            setFormError(error.payload || { detail: [{ msg: 'An unknown error occurred' }] });
          }
        }}
      />
    </Box>
  );
}