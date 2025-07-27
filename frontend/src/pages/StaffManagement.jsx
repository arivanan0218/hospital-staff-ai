// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   IconButton,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   Tooltip,
//   Fab,
// } from '@mui/material';
// import {
//   Add,
//   Edit,
//   Delete,
//   Visibility,
//   FilterList,
//   Person,
//   Email,
//   Phone,
//   Work,
// } from '@mui/icons-material';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchStaff, createStaff, updateStaff, deleteStaff, setFilters } from '../store/slices/staffSlice';
// import { fetchDepartments } from '../store/slices/departmentSlice';
// import StaffDetailsDialog from '../components/staff/StaffDetailsDialog';
// import StaffFormDialog from '../components/staff/StaffFormDialog';

// export default function StaffManagement() {
//   const dispatch = useDispatch();
//   const { list: staff, loading, filters, pagination } = useSelector(state => state.staff);
//   const { list: departments = [], loading: departmentsLoading } = useSelector(state => state.departments || {});
  
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false);
//   const [showFormDialog, setShowFormDialog] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [formError, setFormError] = useState(null);

//   useEffect(() => {
//     dispatch(fetchStaff({ skip: page * rowsPerPage, limit: rowsPerPage, filters }));
//     // Fetch departments if not already loaded
//     if (departments.length === 0) {
//       dispatch(fetchDepartments());
//     }
//   }, [dispatch, page, rowsPerPage, filters, departments.length]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleViewStaff = (staff) => {
//     setSelectedStaff(staff);
//     setShowDetailsDialog(true);
//   };

//   const handleEditStaff = (staff) => {
//     setSelectedStaff(staff);
//     setEditMode(true);
//     setShowFormDialog(true);
//   };

//   const handleDeleteStaff = async (staffId) => {
//     if (window.confirm('Are you sure you want to delete this staff member?')) {
//       await dispatch(deleteStaff(staffId));
//     }
//   };

//   const handleAddStaff = () => {
//     setSelectedStaff(null);
//     setEditMode(false);
//     setShowFormDialog(true);
//   };

//   const handleFilterChange = (field, value) => {
//     dispatch(setFilters({ [field]: value }));
//     setPage(0);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'success';
//       case 'inactive': return 'default';
//       case 'on_leave': return 'warning';
//       default: return 'default';
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'doctor': return '👨‍⚕️';
//       case 'nurse': return '👩‍⚕️';
//       case 'technician': return '🔬';
//       case 'administrator': return '💼';
//       case 'support': return '🛠️';
//       default: return '👤';
//     }
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">
//           Staff Management
//         </Typography>
//         <Box>
//           <Button
//             variant="outlined"
//             startIcon={<FilterList />}
//             onClick={() => setShowFilters(!showFilters)}
//             sx={{ mr: 2 }}
//           >
//             Filters
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddStaff}
//           >
//             Add Staff
//           </Button>
//         </Box>
//       </Box>

//       {/* Filters */}
//       {showFilters && (
//         <Paper sx={{ p: 2, mb: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Role</InputLabel>
//                 <Select
//                   value={filters.role}
//                   onChange={(e) => handleFilterChange('role', e.target.value)}
//                 >
//                   <MenuItem value="">All Roles</MenuItem>
//                   <MenuItem value="doctor">Doctor</MenuItem>
//                   <MenuItem value="nurse">Nurse</MenuItem>
//                   <MenuItem value="technician">Technician</MenuItem>
//                   <MenuItem value="administrator">Administrator</MenuItem>
//                   <MenuItem value="support">Support</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth size="small">
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   value={filters.status}
//                   onChange={(e) => handleFilterChange('status', e.target.value)}
//                 >
//                   <MenuItem value="">All Status</MenuItem>
//                   <MenuItem value="active">Active</MenuItem>
//                   <MenuItem value="inactive">Inactive</MenuItem>
//                   <MenuItem value="on_leave">On Leave</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 label="Search Name"
//                 value={filters.search || ''}
//                 onChange={(e) => handleFilterChange('search', e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>
//       )}

//       {/* Staff Cards View for Mobile */}
//       <Box sx={{ display: { xs: 'block', md: 'none' } }}>
//         <Grid container spacing={2}>
//           {staff.map((member) => (
//             <Grid item xs={12} sm={6} key={member.id}>
//               <Card>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" mb={2}>
//                     <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
//                       {getRoleIcon(member.role)}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="h6">
//                         {member.first_name} {member.last_name}
//                       </Typography>
//                       <Typography variant="body2" color="textSecondary">
//                         {member.role}
//                       </Typography>
//                     </Box>
//                   </Box>
                  
//                   <Box display="flex" alignItems="center" mb={1}>
//                     <Email fontSize="small" sx={{ mr: 1 }} />
//                     <Typography variant="body2">{member.email}</Typography>
//                   </Box>
                  
//                   {member.phone && (
//                     <Box display="flex" alignItems="center" mb={1}>
//                       <Phone fontSize="small" sx={{ mr: 1 }} />
//                       <Typography variant="body2">{member.phone}</Typography>
//                     </Box>
//                   )}
                  
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
//                     <Chip
//                       label={member.status}
//                       color={getStatusColor(member.status)}
//                       size="small"
//                     />
//                     <Box>
//                       <IconButton size="small" onClick={() => handleViewStaff(member)}>
//                         <Visibility />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleEditStaff(member)}>
//                         <Edit />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleDeleteStaff(member.id)}>
//                         <Delete />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Staff Table View for Desktop */}
//       <Box sx={{ display: { xs: 'none', md: 'block' } }}>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Department</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Hourly Rate</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {staff.map((member) => (
//                 <TableRow key={member.id} hover>
//                   <TableCell>
//                     <Box display="flex" alignItems="center">
//                       <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
//                         {member.first_name[0]}{member.last_name[0]}
//                       </Avatar>
//                       {member.first_name} {member.last_name}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={member.role}
//                       size="small"
//                       variant="outlined"
//                       icon={<span>{getRoleIcon(member.role)}</span>}
//                     />
//                   </TableCell>
//                   <TableCell>{member.department?.name || 'Unassigned'}</TableCell>
//                   <TableCell>{member.email}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={member.status}
//                       color={getStatusColor(member.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>${member.hourly_rate}/hr</TableCell>
//                   <TableCell>
//                     <Tooltip title="View Details">
//                       <IconButton size="small" onClick={() => handleViewStaff(member)}>
//                         <Visibility />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Edit">
//                       <IconButton size="small" onClick={() => handleEditStaff(member)}>
//                         <Edit />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton size="small" onClick={() => handleDeleteStaff(member.id)}>
//                         <Delete />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
          
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={pagination.total}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </TableContainer>
//       </Box>

//       {/* Floating Action Button for Mobile */}
//       <Fab
//         color="primary"
//         aria-label="add staff"
//         sx={{
//           position: 'fixed',
//           bottom: 16,
//           right: 16,
//           display: { xs: 'flex', md: 'none' }
//         }}
//         onClick={handleAddStaff}
//       >
//         <Add />
//       </Fab>

//       {/* Dialogs */}
//       <StaffFormDialog
//         open={showFormDialog}
//         staff={editMode ? selectedStaff : null}
//         error={formError}
//         departments={departments}
//         onClose={() => {
//           setShowFormDialog(false);
//           setSelectedStaff(null);
//           setEditMode(false);
//           setFormError(null);
//         }}
//         onSave={async (staffData) => {
//           try {
//             setFormError(null);
//             if (editMode && selectedStaff) {
//               await dispatch(updateStaff({ id: selectedStaff.id, data: staffData })).unwrap();
//             } else {
//               await dispatch(createStaff(staffData)).unwrap();
//             }
//             setShowFormDialog(false);
//             setSelectedStaff(null);
//             setEditMode(false);
//           } catch (error) {
//             // Error is already logged in the thunk
//             setFormError(error.payload || { detail: [{ msg: 'An unknown error occurred' }] });
//           }
//         }}
//       />
//     </Box>
//   );
// }

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
  Container,
  Stack,
  Fade,
  Collapse,
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
  Search,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, createStaff, updateStaff, deleteStaff, setFilters } from '../store/slices/staffSlice';
import { fetchDepartments } from '../store/slices/departmentSlice';
import StaffDetailsDialog from '../components/staff/StaffDetailsDialog';
import StaffFormDialog from '../components/staff/StaffFormDialog';

export default function StaffManagement() {
  const dispatch = useDispatch();
  const { list: staff, loading, filters, pagination } = useSelector(state => state.staff);
  const { list: departments = [], loading: departmentsLoading } = useSelector(state => state.departments || {});
  
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
    // Fetch departments if not already loaded
    if (departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, page, rowsPerPage, filters, departments.length]);

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

  const getRoleConfig = (role) => {
    const configs = {
      doctor: { icon: '👨‍⚕️', color: '#000000' },
      nurse: { icon: '👩‍⚕️', color: '#000000' },
      technician: { icon: '🔬', color: '#000000' },
      administrator: { icon: '💼', color: '#000000' },
      support: { icon: '🛠️', color: '#000000' },
    };
    return configs[role] || { icon: '👤', color: '#666666' };
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in timeout={300}>
        <Box>
          {/* Page Header */}
          <Box sx={{ 
            mb: { xs: 4, md: 6 },
            textAlign: 'left',
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 900,
                color: '#000000',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 2,
                textAlign: 'left',
              }}
            >
              Staff Management
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                maxWidth: '600px',
                textAlign: 'left',
              }}
            >
              Manage your hospital staff, roles, and departments efficiently
            </Typography>
          </Box>

          {/* Action Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#000000',
                  fontSize: '18px',
                }}
              >
                {pagination.total} Staff Members
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#666666',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#cccccc',
                    backgroundColor: '#f8f8f8',
                  },
                }}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<Add sx={{ fontSize: 18 }} />}
                onClick={handleAddStaff}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  fontSize: '13px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: '#333333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Add Staff
              </Button>
            </Stack>
          </Box>

          {/* Filters Section */}
          <Collapse in={showFilters}>
            <Paper sx={{ 
              p: 4, 
              mb: 4,
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#000000',
                  fontSize: '16px',
                  mb: 3,
                }}
              >
                Filter Staff
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#666666', fontWeight: 500 }}>Role</InputLabel>
                    <Select
                      value={filters.role || ''}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      sx={{
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cccccc',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      }}
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
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#666666', fontWeight: 500 }}>Status</InputLabel>
                    <Select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      sx={{
                        borderRadius: '10px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#cccccc',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      }}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="on_leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Search Name"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: '#666666', mr: 1, fontSize: 20 }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#cccccc',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#000000',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666666',
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          {/* Staff Cards View for Mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            <Grid container spacing={3}>
              {staff.map((member, index) => {
                const statusConfig = getStatusConfig(member.status);
                const roleConfig = getRoleConfig(member.role);
                
                return (
                  <Grid item xs={12} sm={6} key={member.id}>
                    <Fade in timeout={300 + index * 50}>
                      <Card sx={{
                        borderRadius: '16px',
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                          borderColor: '#d0d0d0',
                        },
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Avatar sx={{ 
                              width: 48, 
                              height: 48,
                              backgroundColor: '#f0f0f0',
                              color: '#000000',
                              fontWeight: 700,
                              fontSize: '16px',
                              border: '2px solid #e5e5e5',
                            }}>
                              {member.first_name[0]}{member.last_name[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ 
                                fontWeight: 700,
                                color: '#000000',
                                fontSize: '16px',
                                mb: 0.5,
                              }}>
                                {member.first_name} {member.last_name}
                              </Typography>
                              <Chip
                                label={member.role}
                                size="small"
                                sx={{
                                  backgroundColor: '#f0f0f0',
                                  color: '#000000',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                  height: '24px',
                                  borderRadius: '6px',
                                }}
                              />
                            </Box>
                          </Stack>
                          
                          <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Box display="flex" alignItems="center">
                              <Email sx={{ fontSize: 16, color: '#666666', mr: 1.5 }} />
                              <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                                {member.email}
                              </Typography>
                            </Box>
                            
                            {member.phone && (
                              <Box display="flex" alignItems="center">
                                <Phone sx={{ fontSize: 16, color: '#666666', mr: 1.5 }} />
                                <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                                  {member.phone}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              label={statusConfig.label}
                              size="small"
                              sx={{
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.color,
                                border: `1px solid ${statusConfig.borderColor}`,
                                fontWeight: 600,
                                fontSize: '11px',
                                height: '24px',
                                borderRadius: '6px',
                              }}
                            />
                            <Stack direction="row" spacing={0.5}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewStaff(member)}
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: '#f8f8f8',
                                  color: '#666666',
                                  '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                    color: '#000000',
                                  },
                                }}
                              >
                                <Visibility sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditStaff(member)}
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: '#f8f8f8',
                                  color: '#666666',
                                  '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                    color: '#000000',
                                  },
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteStaff(member.id)}
                                sx={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: '#f8f8f8',
                                  color: '#666666',
                                  '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                    color: '#000000',
                                  },
                                }}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Staff Table View for Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper sx={{
              borderRadius: '16px',
              border: '1px solid #e5e5e5',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Staff Member
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Role
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Department
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Contact
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Rate
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staff.map((member, index) => {
                      const statusConfig = getStatusConfig(member.status);
                      const roleConfig = getRoleConfig(member.role);
                      
                      return (
                        <TableRow 
                          key={member.id} 
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f8f8f8',
                            },
                            borderBottom: '1px solid #f5f5f5',
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40,
                                backgroundColor: '#f0f0f0',
                                color: '#000000',
                                fontWeight: 700,
                                fontSize: '14px',
                                border: '2px solid #e5e5e5',
                              }}>
                                {member.first_name[0]}{member.last_name[0]}
                              </Avatar>
                              <Box>
                                <Typography sx={{ 
                                  fontWeight: 600,
                                  color: '#000000',
                                  fontSize: '14px',
                                  mb: 0.5,
                                }}>
                                  {member.first_name} {member.last_name}
                                </Typography>
                                <Typography sx={{ 
                                  color: '#666666',
                                  fontSize: '12px',
                                }}>
                                  ID: {member.id}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={member.role}
                              size="small"
                              sx={{
                                backgroundColor: '#f0f0f0',
                                color: '#000000',
                                fontWeight: 600,
                                fontSize: '11px',
                                height: '28px',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ 
                              fontSize: '14px',
                              color: '#666666',
                              fontWeight: 500,
                            }}>
                              {member.department?.name || 'Unassigned'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ 
                              fontSize: '14px',
                              color: '#666666',
                              fontWeight: 500,
                              mb: 0.5,
                            }}>
                              {member.email}
                            </Typography>
                            {member.phone && (
                              <Typography sx={{ 
                                fontSize: '12px',
                                color: '#999999',
                              }}>
                                {member.phone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Chip
                              label={statusConfig.label}
                              size="small"
                              sx={{
                                backgroundColor: statusConfig.bgColor,
                                color: statusConfig.color,
                                border: `1px solid ${statusConfig.borderColor}`,
                                fontWeight: 600,
                                fontSize: '11px',
                                height: '28px',
                                borderRadius: '8px',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography sx={{ 
                              fontSize: '14px',
                              color: '#000000',
                              fontWeight: 600,
                            }}>
                              ${member.hourly_rate}/hr
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewStaff(member)}
                                  sx={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#f8f8f8',
                                    color: '#666666',
                                    '&:hover': {
                                      backgroundColor: '#f0f0f0',
                                      color: '#000000',
                                    },
                                  }}
                                >
                                  <Visibility sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditStaff(member)}
                                  sx={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#f8f8f8',
                                    color: '#666666',
                                    '&:hover': {
                                      backgroundColor: '#f0f0f0',
                                      color: '#000000',
                                    },
                                  }}
                                >
                                  <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteStaff(member.id)}
                                  sx={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#f8f8f8',
                                    color: '#666666',
                                    '&:hover': {
                                      backgroundColor: '#f0f0f0',
                                      color: '#000000',
                                    },
                                  }}
                                >
                                  <Delete sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                  sx={{
                    borderTop: '1px solid #f0f0f0',
                    '& .MuiTablePagination-toolbar': {
                      px: 3,
                      py: 2,
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#666666',
                    },
                  }}
                />
              </TableContainer>
            </Paper>
          </Box>

          {/* Floating Action Button for Mobile */}
          <Fab
            aria-label="add staff"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              display: { xs: 'flex', md: 'none' },
              backgroundColor: '#000000',
              color: '#ffffff',
              width: '56px',
              height: '56px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#333333',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)',
              },
            }}
            onClick={handleAddStaff}
          >
            <Add sx={{ fontSize: 24 }} />
          </Fab>

          {/* Dialogs */}
          <StaffFormDialog
            open={showFormDialog}
            staff={editMode ? selectedStaff : null}
            error={formError}
            departments={departments}
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
      </Fade>
    </Container>
  );
}