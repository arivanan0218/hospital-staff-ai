// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Box,
//   Chip,
//   Typography,
//   Autocomplete,
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as yup from 'yup';

// const validationSchema = yup.object({
//   employee_id: yup.string().required('Employee ID is required'),
//   first_name: yup.string().required('First name is required'),
//   last_name: yup.string().required('Last name is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   role: yup.string().required('Role is required'),
//   department_id: yup.number().required('Department is required'),
//   hourly_rate: yup.number().min(0, 'Hourly rate must be positive'),
//   max_hours_per_week: yup.number().min(1).max(168, 'Invalid hours per week'),
// });

// const roleOptions = [
//   { value: 'doctor', label: 'Doctor' },
//   { value: 'nurse', label: 'Nurse' },
//   { value: 'technician', label: 'Technician' },
//   { value: 'administrator', label: 'Administrator' },
//   { value: 'support', label: 'Support' },
// ];

// const statusOptions = [
//   { value: 'active', label: 'Active' },
//   { value: 'inactive', label: 'Inactive' },
//   { value: 'on_leave', label: 'On Leave' },
// ];

// const skillsOptions = [
//   'Emergency Medicine',
//   'Critical Care',
//   'Surgery',
//   'Pediatrics',
//   'Cardiology',
//   'Trauma Care',
//   'Intensive Care',
//   'Nursing',
//   'Patient Care',
//   'Medical Equipment',
//   'Laboratory',
//   'Radiology',
// ];

// export default function StaffFormDialog({ open, staff, onClose, onSave, error, departments = [] }) {
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [backendErrors, setBackendErrors] = useState({});

//   // Reset backend errors when the dialog is opened/closed
//   useEffect(() => {
//     if (open) {
//       setBackendErrors({});
//     }
//   }, [open]);

//   // Update backend errors when error prop changes
//   useEffect(() => {
//     console.log('Error prop changed:', error);
//     if (error?.detail) {
//       const errors = {};
      
//       // Handle FastAPI validation error format
//       error.detail.forEach(err => {
//         // Handle different error formats
//         if (Array.isArray(err.loc)) {
//           // Format: {loc: [field], msg: string, type: string}
//           const field = err.loc[err.loc.length - 1]; // Get the last item which is the field name
//           errors[field] = err.msg || 'This field is invalid';
//         } else if (typeof err === 'object' && err.param) {
//           // Format: {param: field, msg: string, ...}
//           errors[err.param] = err.msg || 'This field is invalid';
//         } else if (typeof err === 'string') {
//           // Handle string errors
//           errors.non_field_errors = errors.non_field_errors 
//             ? `${errors.non_field_errors} ${err}` 
//             : err;
//         }
//       });
      
//       console.log('Processed validation errors:', errors);
//       setBackendErrors(errors);
      
//       // If there are non-field errors, show them in an alert
//       if (errors.non_field_errors) {
//         alert(`Error: ${errors.non_field_errors}`);
//       }
//     }
//   }, [error]);

//   const formik = useFormik({
//     initialValues: {
//       employee_id: staff ? staff.employee_id || '' : '',
//       first_name: staff ? staff.first_name || '' : '',
//       last_name: staff ? staff.last_name || '' : '',
//       email: staff ? staff.email || '' : '',
//       phone: staff ? staff.phone || '' : '',
//       role: staff ? staff.role || '' : '',
//       department_id: staff ? staff.department_id || '' : '',
//       status: staff ? staff.status || 'active' : 'active',
//       hourly_rate: staff ? staff.hourly_rate || 0 : 0,
//       max_hours_per_week: staff ? staff.max_hours_per_week || 40 : 40,
//       skills: staff ? staff.skills || [] : [],
//       certifications: staff ? staff.certifications || '' : '',
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       // Convert skills array to a JSON string
//       const skillsValue = Array.isArray(selectedSkills) && selectedSkills.length > 0 
//         ? JSON.stringify(selectedSkills) 
//         : null;

//       const submitData = {
//         employee_id: values.employee_id,
//         first_name: values.first_name,
//         last_name: values.last_name,
//         email: values.email,
//         phone: values.phone || null,
//         role: values.role,
//         department_id: values.department_id || null,
//         status: values.status,
//         hourly_rate: parseFloat(values.hourly_rate) || 0,
//         max_hours_per_week: parseInt(values.max_hours_per_week, 10) || 40,
//         skills: skillsValue, // Send as JSON string
//         certifications: values.certifications || null,
//       };
      
//       console.log('Submitting staff data:', submitData);
//       onSave(submitData);
//     },
//   });

//   useEffect(() => {
//     if (staff) {
//       formik.setValues({
//         employee_id: staff.employee_id || '',
//         first_name: staff.first_name || '',
//         last_name: staff.last_name || '',
//         email: staff.email || '',
//         phone: staff.phone || '',
//         role: staff.role || '',
//         department_id: staff.department_id || '',
//         status: staff.status || 'active',
//         hourly_rate: staff.hourly_rate || '',
//         max_hours_per_week: staff.max_hours_per_week || 40,
//         skills: staff.skills || '',
//         certifications: staff.certifications || '',
//       });
      
//       try {
//         const skills = staff.skills ? JSON.parse(staff.skills) : [];
//         setSelectedSkills(skills);
//       } catch (e) {
//         setSelectedSkills([]);
//       }
//     } else {
//       formik.resetForm();
//       setSelectedSkills([]);
//     }
//   }, [staff, open]);

//   const handleClose = () => {
//     formik.resetForm();
//     setSelectedSkills([]);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
//       </DialogTitle>
      
//       <form onSubmit={formik.handleSubmit}>
//         <DialogContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="employee_id"
//                 label="Employee ID"
//                 value={formik.values.employee_id}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.employee_id && Boolean(formik.errors.employee_id)) || Boolean(backendErrors.employee_id)}
//                 helperText={(formik.touched.employee_id && formik.errors.employee_id) || backendErrors.employee_id || ' '}
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formik.values.status}
//                   onChange={formik.handleChange}
//                 >
//                   {statusOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="first_name"
//                 label="First Name"
//                 value={formik.values.first_name}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.first_name && Boolean(formik.errors.first_name)) || Boolean(backendErrors.first_name)}
//                 helperText={(formik.touched.first_name && formik.errors.first_name) || backendErrors.first_name || ' '}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="last_name"
//                 label="Last Name"
//                 value={formik.values.last_name}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.last_name && Boolean(formik.errors.last_name)) || Boolean(backendErrors.last_name)}
//                 helperText={(formik.touched.last_name && formik.errors.last_name) || backendErrors.last_name || ' '}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="email"
//                 label="Email"
//                 type="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(backendErrors.email)}
//                 helperText={(formik.touched.email && formik.errors.email) || backendErrors.email || ' '}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="phone"
//                 label="Phone"
//                 value={formik.values.phone}
//                 onChange={formik.handleChange}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Role</InputLabel>
//                 <Select
//                   name="role"
//                   value={formik.values.role}
//                   onChange={formik.handleChange}
//                   error={formik.touched.role && Boolean(formik.errors.role)}
//                 >
//                   {roleOptions.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Department</InputLabel>
//                 <Select
//                   name="department_id"
//                   value={formik.values.department_id}
//                   onChange={formik.handleChange}
//                   error={formik.touched.department_id && Boolean(formik.errors.department_id)}
//                   disabled={departments.length === 0}
//                 >
//                   <MenuItem value="" disabled>Select a department</MenuItem>
//                   {departments.map((dept) => (
//                     <MenuItem key={dept.id} value={dept.id}>
//                       {dept.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="hourly_rate"
//                 label="Hourly Rate ($)"
//                 type="number"
//                 value={formik.values.hourly_rate}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.hourly_rate && Boolean(formik.errors.hourly_rate)) || Boolean(backendErrors.hourly_rate)}
//                 helperText={(formik.touched.hourly_rate && formik.errors.hourly_rate) || backendErrors.hourly_rate || ' '}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 name="max_hours_per_week"
//                 label="Max Hours per Week"
//                 type="number"
//                 value={formik.values.max_hours_per_week}
//                 onChange={formik.handleChange}
//                 error={(formik.touched.max_hours_per_week && Boolean(formik.errors.max_hours_per_week)) || Boolean(backendErrors.max_hours_per_week)}
//                 helperText={(formik.touched.max_hours_per_week && formik.errors.max_hours_per_week) || backendErrors.max_hours_per_week || ' '}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Skills & Competencies
//               </Typography>
//               <Autocomplete
//                 multiple
//                 options={skillsOptions}
//                 value={selectedSkills}
//                 onChange={(event, newValue) => setSelectedSkills(newValue)}
//                 renderTags={(value, getTagProps) =>
//                   value.map((option, index) => (
//                     <Chip
//                       variant="outlined"
//                       label={option}
//                       {...getTagProps({ index })}
//                       key={option}
//                     />
//                   ))
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Select skills"
//                     helperText="Add relevant skills and competencies"
//                   />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 name="certifications"
//                 label="Certifications"
//                 multiline
//                 rows={3}
//                 value={formik.values.certifications}
//                 onChange={formik.handleChange}
//                 helperText="List relevant certifications and licenses"
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button type="submit" variant="contained">
//             {staff ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Chip,
  Typography,
  Autocomplete,
  Stack,
  IconButton,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  Close,
  Person,
  Work,
  ContactMail,
  School,
  AttachMoney,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  employee_id: yup.string().required('Employee ID is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  department_id: yup.number().required('Department is required'),
  hourly_rate: yup.number().min(0, 'Hourly rate must be positive'),
  max_hours_per_week: yup.number().min(1).max(168, 'Invalid hours per week'),
});

const roleOptions = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'technician', label: 'Technician' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'support', label: 'Support' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
];

const skillsOptions = [
  'Emergency Medicine',
  'Critical Care',
  'Surgery',
  'Pediatrics',
  'Cardiology',
  'Trauma Care',
  'Intensive Care',
  'Nursing',
  'Patient Care',
  'Medical Equipment',
  'Laboratory',
  'Radiology',
];

// Move styled components outside to prevent recreation on each render
const FormSection = ({ icon, title, children }) => (
  <Paper sx={{
    p: 3,
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
    mb: 2,
  }}>
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      <Box sx={{
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #e0e0e0',
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 18, color: '#000000' } })}
      </Box>
      <Typography sx={{
        fontSize: '15px',
        fontWeight: 700,
        color: '#000000',
      }}>
        {title}
      </Typography>
    </Stack>
    {children}
  </Paper>
);

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

const StyledSelect = ({ error, children, ...props }) => (
  <FormControl fullWidth>
    <InputLabel sx={{ 
      color: '#666666', 
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#000000',
      },
    }}>
      {props.label}
    </InputLabel>
    <Select
      {...props}
      error={error}
      sx={{
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#cccccc',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#000000',
          borderWidth: 2,
        },
      }}
    >
      {children}
    </Select>
  </FormControl>
);

export default function StaffFormDialog({ open, staff, onClose, onSave, error, departments = [] }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [backendErrors, setBackendErrors] = useState({});

  // Reset backend errors when the dialog is opened/closed
  useEffect(() => {
    if (open) {
      setBackendErrors({});
    }
  }, [open]);

  // Update backend errors when error prop changes
  useEffect(() => {
    console.log('Error prop changed:', error);
    if (error?.detail) {
      const errors = {};
      
      // Handle FastAPI validation error format
      error.detail.forEach(err => {
        // Handle different error formats
        if (Array.isArray(err.loc)) {
          // Format: {loc: [field], msg: string, type: string}
          const field = err.loc[err.loc.length - 1]; // Get the last item which is the field name
          errors[field] = err.msg || 'This field is invalid';
        } else if (typeof err === 'object' && err.param) {
          // Format: {param: field, msg: string, ...}
          errors[err.param] = err.msg || 'This field is invalid';
        } else if (typeof err === 'string') {
          // Handle string errors
          errors.non_field_errors = errors.non_field_errors 
            ? `${errors.non_field_errors} ${err}` 
            : err;
        }
      });
      
      console.log('Processed validation errors:', errors);
      setBackendErrors(errors);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: {
      employee_id: staff ? staff.employee_id || '' : '',
      first_name: staff ? staff.first_name || '' : '',
      last_name: staff ? staff.last_name || '' : '',
      email: staff ? staff.email || '' : '',
      phone: staff ? staff.phone || '' : '',
      role: staff ? staff.role || '' : '',
      department_id: staff ? staff.department_id || '' : '',
      status: staff ? staff.status || 'active' : 'active',
      hourly_rate: staff ? staff.hourly_rate || 0 : 0,
      max_hours_per_week: staff ? staff.max_hours_per_week || 40 : 40,
      skills: staff ? staff.skills || [] : [],
      certifications: staff ? staff.certifications || '' : '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Convert skills array to a JSON string
      const skillsValue = Array.isArray(selectedSkills) && selectedSkills.length > 0 
        ? JSON.stringify(selectedSkills) 
        : null;

      const submitData = {
        employee_id: values.employee_id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone || null,
        role: values.role,
        department_id: values.department_id || null,
        status: values.status,
        hourly_rate: parseFloat(values.hourly_rate) || 0,
        max_hours_per_week: parseInt(values.max_hours_per_week, 10) || 40,
        skills: skillsValue, // Send as JSON string
        certifications: values.certifications || null,
      };
      
      console.log('Submitting staff data:', submitData);
      onSave(submitData);
    },
  });

  useEffect(() => {
    if (staff) {
      formik.setValues({
        employee_id: staff.employee_id || '',
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || '',
        department_id: staff.department_id || '',
        status: staff.status || 'active',
        hourly_rate: staff.hourly_rate || '',
        max_hours_per_week: staff.max_hours_per_week || 40,
        skills: staff.skills || '',
        certifications: staff.certifications || '',
      });
      
      try {
        const skills = staff.skills ? JSON.parse(staff.skills) : [];
        setSelectedSkills(skills);
      } catch (e) {
        setSelectedSkills([]);
      }
    } else {
      formik.resetForm();
      setSelectedSkills([]);
    }
  }, [staff, open]);

  const handleClose = () => {
    formik.resetForm();
    setSelectedSkills([]);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
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
              <Person sx={{ fontSize: 24, color: '#000000' }} />
            </Box>
            <Box>
              <Typography sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1.2,
              }}>
                {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </Typography>
              <Typography sx={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#666666',
                mt: 0.5,
              }}>
                {staff ? 'Update staff information and details' : 'Enter new staff member information'}
              </Typography>
            </Box>
          </Stack>
          <IconButton 
            onClick={handleClose}
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
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ 
          p: 3,
          overflow: 'auto',
          maxHeight: 'calc(95vh - 180px)',
        }}>
          {/* Show backend errors */}
          {backendErrors.non_field_errors && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                border: '1px solid #f5c6cb',
              }}
            >
              {backendErrors.non_field_errors}
            </Alert>
          )}

          {/* Personal Information Section */}
          <FormSection icon={<Person />} title="Personal Information">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="employee_id"
                  label="Employee ID"
                  value={formik.values.employee_id}
                  onChange={formik.handleChange}
                  error={(formik.touched.employee_id && Boolean(formik.errors.employee_id)) || Boolean(backendErrors.employee_id)}
                  helperText={(formik.touched.employee_id && formik.errors.employee_id) || backendErrors.employee_id}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledSelect
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="first_name"
                  label="First Name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  error={(formik.touched.first_name && Boolean(formik.errors.first_name)) || Boolean(backendErrors.first_name)}
                  helperText={(formik.touched.first_name && formik.errors.first_name) || backendErrors.first_name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="last_name"
                  label="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  error={(formik.touched.last_name && Boolean(formik.errors.last_name)) || Boolean(backendErrors.last_name)}
                  helperText={(formik.touched.last_name && formik.errors.last_name) || backendErrors.last_name}
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Contact Information Section */}
          <FormSection icon={<ContactMail />} title="Contact Information">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(backendErrors.email)}
                  helperText={(formik.touched.email && formik.errors.email) || backendErrors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  helperText="Optional contact number"
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Employment Details Section */}
          <FormSection icon={<Work />} title="Employment Details">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledSelect
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledSelect
                  name="department_id"
                  label="Department"
                  value={formik.values.department_id}
                  onChange={formik.handleChange}
                  error={formik.touched.department_id && Boolean(formik.errors.department_id)}
                  disabled={departments.length === 0}
                >
                  <MenuItem value="" disabled>Select a department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="hourly_rate"
                  label="Hourly Rate ($)"
                  type="number"
                  value={formik.values.hourly_rate}
                  onChange={formik.handleChange}
                  error={(formik.touched.hourly_rate && Boolean(formik.errors.hourly_rate)) || Boolean(backendErrors.hourly_rate)}
                  helperText={(formik.touched.hourly_rate && formik.errors.hourly_rate) || backendErrors.hourly_rate}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  name="max_hours_per_week"
                  label="Max Hours per Week"
                  type="number"
                  value={formik.values.max_hours_per_week}
                  onChange={formik.handleChange}
                  error={(formik.touched.max_hours_per_week && Boolean(formik.errors.max_hours_per_week)) || Boolean(backendErrors.max_hours_per_week)}
                  helperText={(formik.touched.max_hours_per_week && formik.errors.max_hours_per_week) || backendErrors.max_hours_per_week}
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* Skills & Qualifications Section */}
          <FormSection icon={<School />} title="Skills & Qualifications">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#000000',
                  mb: 1.5,
                }}>
                  Skills & Competencies
                </Typography>
                <Autocomplete
                  multiple
                  options={skillsOptions}
                  value={selectedSkills}
                  onChange={(event, newValue) => setSelectedSkills(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        sx={{
                          backgroundColor: '#f0f0f0',
                          color: '#000000',
                          fontWeight: 500,
                          fontSize: '11px',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          height: '24px',
                          '& .MuiChip-deleteIcon': {
                            color: '#666666',
                            fontSize: '16px',
                            '&:hover': {
                              color: '#000000',
                            },
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select relevant skills"
                      helperText="Add skills and competencies relevant to this role"
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
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  name="certifications"
                  label="Certifications & Licenses"
                  multiline
                  rows={2}
                  value={formik.values.certifications}
                  onChange={formik.handleChange}
                  helperText="List relevant certifications, licenses, and credentials"
                />
              </Grid>
            </Grid>
          </FormSection>
        </DialogContent>

        <DialogActions sx={{ 
          p: 3,
          pt: 2,
          borderTop: '1px solid #f0f0f0',
          justifyContent: 'flex-end',
        }}>
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={handleClose}
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
              {staff ? 'Update Staff' : 'Create Staff'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}