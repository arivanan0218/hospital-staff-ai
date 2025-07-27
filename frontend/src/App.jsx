import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/common/MainLayout';
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import ShiftManagement from './pages/ShiftManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import AllocationManagement from './pages/AllocationManagement';
import ShiftAssignments from './pages/ShiftAssignments';
import Analytics from './pages/Analytics';
import DepartmentManagement from './components/departments/DepartmentManagement.jsx';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WebSocketProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/staff" element={<StaffManagement />} />
                <Route path="/shifts" element={<ShiftManagement />} />
                <Route path="/attendance" element={<AttendanceManagement />} />
                <Route path="/allocation" element={<AllocationManagement />} />
                <Route path="/shift-assignments" element={<ShiftAssignments />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/departments" element={<DepartmentManagement />} />
              </Routes>
              <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </MainLayout>
          </Router>
        </WebSocketProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;