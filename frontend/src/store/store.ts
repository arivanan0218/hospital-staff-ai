import { configureStore } from '@reduxjs/toolkit';
import staffReducer from './slices/staffSlice';
import shiftReducer from './slices/shiftSlice';
import allocationReducer from './slices/allocationSlice';
import dashboardReducer from './slices/dashboardSlice';
import departmentReducer from './slices/departmentSlice';

export const store = configureStore({
  reducer: {
    staff: staffReducer,
    shifts: shiftReducer,
    allocation: allocationReducer,
    dashboard: dashboardReducer,
    departments: departmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;