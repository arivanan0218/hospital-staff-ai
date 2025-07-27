// import React, { useState, useEffect } from 'react';
// import { departmentsAPI } from '../../services/api';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DepartmentList = ({ onSelectDepartment }) => {
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     min_staff_required: 1,
//     max_staff_capacity: 10
//   });

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const data = await departmentsAPI.getAll();
//       setDepartments(data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch departments');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'min_staff_required' || name === 'max_staff_capacity' 
//         ? parseInt(value, 10) 
//         : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await departmentsAPI.create(formData);
//       toast.success('Department created successfully');
//       setShowForm(false);
//       setFormData({
//         name: '',
//         description: '',
//         min_staff_required: 1,
//         max_staff_capacity: 10
//       });
//       fetchDepartments();
//     } catch (err) {
//       toast.error('Failed to create department');
//       console.error(err);
//     }
//   };

//   if (loading) return <div>Loading departments...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Departments</h2>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           {showForm ? 'Cancel' : 'Add Department'}
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
//           <h3 className="text-lg font-medium mb-4">Add New Department</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <input
//                 type="text"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Min Staff Required</label>
//               <input
//                 type="number"
//                 name="min_staff_required"
//                 min="1"
//                 value={formData.min_staff_required}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Max Staff Capacity</label>
//               <input
//                 type="number"
//                 name="max_staff_capacity"
//                 min="1"
//                 value={formData.max_staff_capacity}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               />
//             </div>
//           </div>
//           <div className="mt-4">
//             <button
//               type="submit"
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Save Department
//             </button>
//           </div>
//         </form>
//       )}

//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <ul className="divide-y divide-gray-200">
//           {departments.map((dept) => (
//             <li key={dept.id}>
//               <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
//                 <div className="flex-1">
//                   <div className="flex items-center">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
//                       {dept.description && (
//                         <p className="text-sm text-gray-500">{dept.description}</p>
//                       )}
//                       <div className="mt-1 text-sm text-gray-500">
//                         <span>Staff: {dept.min_staff_required} - {dept.max_staff_capacity}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="ml-4 flex-shrink-0">
//                   <button
//                     onClick={() => onSelectDepartment(dept)}
//                     className="text-blue-600 hover:text-blue-900"
//                   >
//                     View/Edit
//                   </button>
//                 </div>
//               </div>
//             </li>
//           ))}
//           {departments.length === 0 && !loading && (
//             <li className="px-4 py-4 text-center text-gray-500">
//               No departments found. Create one to get started.
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default DepartmentList;


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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Stack,
  Grid,
  IconButton,
  Fade,
  Grow,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Business,
  Close,
  Edit,
  People,
  Description,
} from '@mui/icons-material';
import { departmentsAPI } from '../../services/api';

// Styled TextField component
const StyledTextField = ({ error, helperText, ...props }) => (
  <TextField
    {...props}
    error={error}
    helperText={helperText || ' '}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        '& fieldset': {
          borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
          borderColor: '#cccccc',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000000',
          borderWidth: 2,
        },
        '&.Mui-error fieldset': {
          borderColor: '#d32f2f',
        },
      },
      '& .MuiInputLabel-root': {
        color: '#666666',
        fontWeight: 500,
        '&.Mui-focused': {
          color: '#000000',
        },
        '&.Mui-error': {
          color: '#d32f2f',
        },
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        fontSize: '12px',
        '&.Mui-error': {
          color: '#d32f2f',
        },
      },
    }}
  />
);

const DepartmentList = ({ onSelectDepartment }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_staff_required: 1,
    max_staff_capacity: 10
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentsAPI.getAll();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_staff_required' || name === 'max_staff_capacity' 
        ? parseInt(value, 10) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await departmentsAPI.create(formData);
      setSnackbar({
        open: true,
        message: 'Department created successfully!',
        severity: 'success'
      });
      setOpenDialog(false);
      setFormData({
        name: '',
        description: '',
        min_staff_required: 1,
        max_staff_capacity: 10
      });
      fetchDepartments();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create department',
        severity: 'error'
      });
      console.error(err);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      description: '',
      min_staff_required: 1,
      max_staff_capacity: 10
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
            Loading departments...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
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
          minHeight: '50vh',
          textAlign: 'center',
        }}>
          <Typography 
            sx={{ 
              color: '#d32f2f', 
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px' },
              mb: 2,
            }}
          >
            {error}
          </Typography>
          <Button 
            onClick={fetchDepartments}
            sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

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
              }}
            >
              Departments
            </Typography>
            <Typography
              sx={{
                color: '#666666',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                maxWidth: '600px',
              }}
            >
              Manage hospital departments, staffing requirements, and organizational structure
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
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#000000',
                fontSize: '18px',
              }}
            >
              {departments.length} Departments
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: 18 }} />}
              onClick={handleOpenDialog}
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
              Add Department
            </Button>
          </Box>

          {/* Departments Table */}
          <Grow in timeout={500}>
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
                        Department Details
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 700, 
                        color: '#000000',
                        fontSize: '14px',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                      }}>
                        Staff Requirements
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
                    {departments.map((dept, index) => (
                      <TableRow 
                        key={dept.id} 
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f8f8f8',
                          },
                          borderBottom: '1px solid #f5f5f5',
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '10px',
                              backgroundColor: '#f0f0f0',
                              border: '1px solid #e0e0e0',
                            }}>
                              <Business sx={{ fontSize: 20, color: '#666666' }} />
                            </Box>
                            <Box>
                              <Typography sx={{ 
                                fontWeight: 600,
                                color: '#000000',
                                fontSize: '14px',
                                mb: 0.5,
                              }}>
                                {dept.name}
                              </Typography>
                              {dept.description && (
                                <Typography sx={{ 
                                  color: '#666666',
                                  fontSize: '12px',
                                  lineHeight: 1.3,
                                }}>
                                  {dept.description}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <People sx={{ fontSize: 16, color: '#666666' }} />
                            <Typography sx={{ 
                              fontSize: '14px',
                              color: '#000000',
                              fontWeight: 500,
                            }}>
                              {dept.min_staff_required} - {dept.max_staff_capacity} staff
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit Department">
                              <IconButton 
                                size="small"
                                onClick={() => onSelectDepartment(dept)}
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
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {departments.length === 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={3} 
                          sx={{ 
                            py: 6,
                            textAlign: 'center',
                          }}
                        >
                          <Typography sx={{ 
                            color: '#666666',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}>
                            No departments found. Create one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grow>

          {/* Add Department Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            maxWidth="sm" 
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
            <form onSubmit={handleSubmit}>
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
                      <Business sx={{ fontSize: 24, color: '#000000' }} />
                    </Box>
                    <Box>
                      <Typography sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#000000',
                        lineHeight: 1.2,
                      }}>
                        Add New Department
                      </Typography>
                      <Typography sx={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#666666',
                        mt: 0.5,
                      }}>
                        Create a new department with staffing requirements
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton 
                    onClick={handleCloseDialog}
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
                p: 3,
                overflow: 'auto',
                maxHeight: 'calc(95vh - 180px)',
              }}>
                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                  <Grid item xs={12}>
                    <StyledTextField
                      required
                      name="name"
                      label="Department Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      helperText="Enter the name of the department"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <StyledTextField
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      helperText="Optional description of the department's role and responsibilities"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      required
                      name="min_staff_required"
                      label="Minimum Staff Required"
                      type="number"
                      value={formData.min_staff_required}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{ min: 1 }}
                      helperText="Minimum number of staff needed"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      required
                      name="max_staff_capacity"
                      label="Maximum Staff Capacity"
                      type="number"
                      value={formData.max_staff_capacity}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{ min: 1 }}
                      helperText="Maximum staff capacity for this department"
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ 
                p: 3,
                pt: 2,
                borderTop: '1px solid #f0f0f0',
                justifyContent: 'flex-end',
              }}>
                <Stack direction="row" spacing={2}>
                  <Button 
                    onClick={handleCloseDialog}
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
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    sx={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      borderRadius: '10px',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '14px',
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        backgroundColor: '#333333',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    Save Department
                  </Button>
                </Stack>
              </DialogActions>
            </form>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '& .MuiAlert-root': {
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              sx={{
                '& .MuiAlert-icon': {
                  fontSize: '20px',
                },
                '& .MuiAlert-message': {
                  fontWeight: 500,
                  fontSize: '14px',
                },
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
};

export default DepartmentList;
