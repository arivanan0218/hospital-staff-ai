import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: {},
    notifications: [],
    loading: false,
  },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addRealtimeNotification, clearNotifications } = dashboardSlice.actions;
export default dashboardSlice.reducer;
