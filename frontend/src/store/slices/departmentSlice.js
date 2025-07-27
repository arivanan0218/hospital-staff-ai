import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentsAPI } from '../../services/api';

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching departments...');
      const response = await departmentsAPI.getAll();
      console.log('Departments API response:', response);
      
      // The response itself is the array of departments
      if (!Array.isArray(response)) {
        console.error('Expected array of departments but got:', response);
        return [];
      }
      
      // Transform the data to ensure it has the expected structure
      return response.map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description || '',
        min_staff_required: dept.min_staff_required || 0,
        max_staff_capacity: dept.max_staff_capacity || 0
      }));
      
    } catch (error) {
      console.error('Error in fetchDepartments:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch departments';
      return rejectWithValue(errorMessage);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we're always setting an array, even if payload is undefined
        state.list = Array.isArray(action.payload) ? action.payload : [];
        console.log('Departments set in state:', state.list);
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch departments';
        console.error('Error in fetchDepartments reducer:', action.payload);
      });
  },
});

export default departmentSlice.reducer;
