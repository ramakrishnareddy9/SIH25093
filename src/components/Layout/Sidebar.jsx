import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  School,
  Person,
  Analytics,
  Folder,
  AdminPanelSettings,
  CheckCircle,
  Event,
  CardMembership,
  Business,
} from '@mui/icons-material';

const Sidebar = ({ open, toggleSidebar, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
      { text: 'Profile', icon: <Person />, path: '/app/profile' },
    ];

    const studentItems = [
      { text: 'Activities', icon: <Assignment />, path: '/app/activities' },
      { text: 'Events', icon: <Event />, path: '/app/events' },
      { text: 'Certificates', icon: <CardMembership />, path: '/app/certificates' },
      { text: 'Portfolio', icon: <Folder />, path: '/app/portfolio' },
    ];

    const facultyItems = [
      { text: 'Events', icon: <Event />, path: '/app/events' },
      { text: 'Organizer Panel', icon: <Business />, path: '/app/organizer' },
      { text: 'Approval Panel', icon: <CheckCircle />, path: '/app/faculty' },
      { text: 'Certificates', icon: <CardMembership />, path: '/app/certificates' },
      { text: 'Analytics', icon: <Analytics />, path: '/app/analytics' },
    ];

    const adminItems = [
      { text: 'Activities', icon: <Assignment />, path: '/app/activities' },
      { text: 'Events', icon: <Event />, path: '/app/events' },
      { text: 'Organizer Panel', icon: <Business />, path: '/app/organizer' },
      { text: 'Faculty Panel', icon: <School />, path: '/app/faculty' },
      { text: 'Certificates', icon: <CardMembership />, path: '/app/certificates' },
      { text: 'Analytics', icon: <Analytics />, path: '/app/analytics' },
      { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/app/admin' },
    ];

    switch (userRole) {
      case 'student':
        return [...commonItems, ...studentItems];
      case 'faculty':
        return [...commonItems, ...facultyItems];
      case 'admin':
        return [...commonItems, ...adminItems];
      default:
        return commonItems;
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawerWidth = 270;
  const collapsedWidth = 90;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {getMenuItems().map((item, index) => (
            <Tooltip
              key={item.text}
              title={!open ? item.text : ''}
              placement="right"
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: isActive(item.path)
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    borderRadius: open ? '0 25px 25px 0' : '0',
                    mr: open ? 1 : 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />

        {/* Role-specific additional items */}
        {userRole === 'admin' && (
          <List>
            <Tooltip title={!open ? 'System Settings' : ''} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Settings"
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
