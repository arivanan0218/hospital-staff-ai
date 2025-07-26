import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async () => {
    return [];
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
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateShiftRealtime } = shiftSlice.actions;
export default shiftSlice.reducer;
