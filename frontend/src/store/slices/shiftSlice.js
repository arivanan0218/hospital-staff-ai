import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shiftsAPI } from '../../services/api';

export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shiftsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createShift = createAsyncThunk(
  'shifts/createShift',
  async (shiftData, { rejectWithValue }) => {
    try {
      // Format the shift data to match the backend's expected format
      const formattedShiftData = {
        name: shiftData.name,
        department_id: Number(shiftData.department_id),
        shift_type: shiftData.shift_type,
        start_time: shiftData.start_time.toISOString(),
        end_time: shiftData.end_time.toISOString(),
        required_staff_count: Number(shiftData.required_staff_count),
        notes: shiftData.notes || '',
        required_skills: '', // Add this if your backend requires it
        priority_level: 1 // Default priority level
      };
      
      console.log('Sending shift data:', formattedShiftData);
      const response = await shiftsAPI.create(formattedShiftData);
      return response.data;
    } catch (error) {
      console.error('Error creating shift:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create shift';
      return rejectWithValue(errorMessage);
    }
  }
);

const shiftSlice = createSlice({
  name: 'shifts',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateShiftRealtime: (state, action) => {
      const updatedShift = action.payload;
      const index = state.list.findIndex(shift => shift.id === updatedShift.id);
      if (index !== -1) {
        state.list[index] = updatedShift;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch shifts';
      })
      .addCase(createShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create shift';
      });
  },
});

export const { updateShiftRealtime } = shiftSlice.actions;
export default shiftSlice.reducer;
