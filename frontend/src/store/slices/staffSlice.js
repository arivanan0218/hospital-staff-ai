import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { staffAPI } from '../../services/api';

// Async thunks
export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async ({ skip = 0, limit = 100, filters = {} } = {}) => {
    // Only include filters that have values
    const queryParams = { skip, limit };
    
    // Add non-empty filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams[key] = value;
      }
    });
    
    const response = await staffAPI.getAll(queryParams);
    return response.data;
  }
);

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      console.log('Creating staff with data:', JSON.stringify(staffData, null, 2));
      const response = await staffAPI.create(staffData);
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        },
        message: error.message
      });
      
      // Log detailed validation errors if available
      if (error.response?.data?.detail) {
        console.error('Raw validation errors:', JSON.stringify(error.response.data.detail, null, 2));
      }
      
      return rejectWithValue(error.response?.data || { detail: [{ msg: error.message }] });
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }) => {
    const response = await staffAPI.update(id, data);
    return response.data;
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id) => {
    await staffAPI.delete(id);
    return id;
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    list: [],
    loading: false,
    error: null,
    selectedStaff: null,
    filters: {
      role: '',
      department: '',
      status: 'active',
    },
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStaffRealtime: (state, action) => {
      const updatedStaff = action.payload;
      const index = state.list.findIndex(staff => staff.id === updatedStaff.id);
      if (index !== -1) {
        state.list[index] = updatedStaff;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create staff
      .addCase(createStaff.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update staff
      .addCase(updateStaff.fulfilled, (state, action) => {
        const index = state.list.findIndex(staff => staff.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete staff
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.list = state.list.filter(staff => staff.id !== action.payload);
      });
  },
});

export const { setFilters, setSelectedStaff, clearError, updateStaffRealtime } = staffSlice.actions;
export default staffSlice.reducer;