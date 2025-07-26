import { createSlice } from '@reduxjs/toolkit';

const allocationSlice = createSlice({
  name: 'allocation',
  initialState: {
    allocations: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = allocationSlice.actions;
export default allocationSlice.reducer;
