// import React, { useState } from 'react';
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Badge,
//   Menu,
//   MenuItem,
//   Avatar,
//   Tooltip,
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard,
//   People,
//   Schedule,
//   Assignment,
//   AssignmentInd,
//   Analytics,
//   Notifications,
//   Settings,
//   AccountCircle,
//   Business,
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useWebSocket } from '../../contexts/WebSocketContext';
// import ConnectionStatus from './ConnectionStatus';

// const drawerWidth = 240;

// const menuItems = [
//   { text: 'Dashboard', icon: <Dashboard />, path: '/' },
//   { text: 'Staff', icon: <People />, path: '/staff' },
//   { text: 'Shifts', icon: <Schedule />, path: '/shifts' },
//   { text: 'Shift Assignments', icon: <AssignmentInd />, path: '/shift-assignments' },
//   { text: 'Attendance', icon: <Assignment />, path: '/attendance' },
//   { text: 'Allocation', icon: <Assignment />, path: '/allocation' },
//   { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
//   { text: 'Departments', icon: <Business />, path: '/departments' },
// ];

// export default function MainLayout({ children }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { connected } = useWebSocket();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant="h6" noWrap component="div">
//           Hospital AI
//         </Typography>
//       </Toolbar>
//       <List>
//         {menuItems.map((item) => (
//           <ListItem
//             key={item.text}
//             onClick={() => navigate(item.path)}
//             selected={location.pathname === item.path}
//             component="div"
//             sx={{
//               cursor: 'pointer',
//               '&.Mui-selected': {
//                 backgroundColor: 'primary.main',
//                 color: 'white',
//                 '& .MuiListItemIcon-root': {
//                   color: 'white',
//                 },
//               },
//               '&:hover': {
//                 backgroundColor: 'action.hover',
//               },
//             }}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             Hospital Staff Allocation System
//           </Typography>
          
//           <ConnectionStatus connected={connected} />
          
//           <Tooltip title="Notifications">
//             <IconButton color="inherit">
//               <Badge badgeContent={4} color="error">
//                 <Notifications />
//               </Badge>
//             </IconButton>
//           </Tooltip>
          
//           <Tooltip title="Settings">
//             <IconButton color="inherit">
//               <Settings />
//             </IconButton>
//           </Tooltip>
          
//           <Tooltip title="Profile">
//             <IconButton
//               color="inherit"
//               onClick={handleProfileMenuOpen}
//             >
//               <Avatar sx={{ width: 32, height: 32 }}>
//                 <AccountCircle />
//               </Avatar>
//             </IconButton>
//           </Tooltip>
          
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleProfileMenuClose}
//           >
//             <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
//             <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>
      
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       >
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
      
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           mt: 8,
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// }

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Schedule,
  Assignment,
  AssignmentInd,
  Analytics,
  Notifications,
  Settings,
  AccountCircle,
  Business,
  LogoutOutlined,
  PersonOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../../contexts/WebSocketContext';
import ConnectionStatus from './ConnectionStatus';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Staff', icon: <People />, path: '/staff' },
  { text: 'Shifts', icon: <Schedule />, path: '/shifts' },
  { text: 'Shift Assignments', icon: <AssignmentInd />, path: '/shift-assignments' },
  { text: 'Attendance', icon: <Assignment />, path: '/attendance' },
  { text: 'Allocation', icon: <Assignment />, path: '/allocation' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Departments', icon: <Business />, path: '/departments' },
];

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { connected } = useWebSocket();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#ffffff',
    }}>
      {/* Logo/Brand Section */}
      <Box sx={{ 
        p: 4,
        borderBottom: '1px solid #f0f0f0',
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800,
            color: '#000000',
            fontSize: '20px',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Hospital AI
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666666',
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Staff Management
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  px: 2,
                  py: 1.5,
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isSelected ? '#000000' : 'transparent',
                  color: isSelected ? '#ffffff' : '#666666',
                  '&:hover': {
                    backgroundColor: isSelected ? '#000000' : '#f8f8f8',
                    color: isSelected ? '#ffffff' : '#000000',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: isSelected ? '#ffffff' : '#000000',
                    },
                  },
                  '& .MuiListItemIcon-root': {
                    color: isSelected ? '#ffffff' : '#666666',
                    minWidth: '40px',
                    transition: 'color 0.2s ease-in-out',
                  },
                }}
              >
                <ListItemIcon>
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '14px',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ 
        p: 3,
        borderTop: '1px solid #f0f0f0',
      }}>
        <ConnectionStatus connected={connected} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          color: '#000000',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#000000',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: '#000000',
              fontSize: '18px',
            }}
          >
            Hospital Staff Allocation System
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                sx={{
                  color: '#666666',
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e5e5e5',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    borderColor: '#d0d0d0',
                  },
                }}
              >
                <Badge 
                  badgeContent={4} 
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 600,
                      minWidth: '18px',
                      height: '18px',
                    },
                  }}
                >
                  <Notifications sx={{ fontSize: 18 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton 
                sx={{
                  color: '#666666',
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e5e5e5',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    borderColor: '#d0d0d0',
                  },
                }}
              >
                <Settings sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            
            {/* Profile */}
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  ml: 1,
                  p: 0,
                }}
              >
                <Avatar sx={{ 
                  width: 40, 
                  height: 40,
                  backgroundColor: '#f0f0f0',
                  color: '#000000',
                  border: '2px solid #e5e5e5',
                  fontWeight: 600,
                  fontSize: '14px',
                  '&:hover': {
                    borderColor: '#d0d0d0',
                  },
                }}>
                  JD
                </Avatar>
              </IconButton>
            </Tooltip>
          </Stack>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '12px',
                border: '1px solid #e5e5e5',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                mt: 1,
                minWidth: '200px',
              },
            }}
          >
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f0f0' }}>
              <Typography sx={{ fontWeight: 600, color: '#000000', fontSize: '14px' }}>
                John Doe
              </Typography>
              <Typography sx={{ color: '#666666', fontSize: '12px' }}>
                Administrator
              </Typography>
            </Box>
            <MenuItem 
              onClick={handleProfileMenuClose}
              sx={{
                py: 1.5,
                px: 3,
                '&:hover': {
                  backgroundColor: '#f8f8f8',
                },
              }}
            >
              <PersonOutlined sx={{ mr: 2, fontSize: 18, color: '#666666' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                Profile
              </Typography>
            </MenuItem>
            <Divider sx={{ mx: 2 }} />
            <MenuItem 
              onClick={handleProfileMenuClose}
              sx={{
                py: 1.5,
                px: 3,
                '&:hover': {
                  backgroundColor: '#f8f8f8',
                },
              }}
            >
              <LogoutOutlined sx={{ mr: 2, fontSize: 18, color: '#666666' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Side Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid #f0f0f0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
          backgroundColor: '#fafafa',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}