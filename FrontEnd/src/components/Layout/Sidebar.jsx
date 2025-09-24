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

// Import services and hooks
import { useDataService } from '../../hooks/useDataService';

const Sidebar = ({ open, toggleSidebar, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dataService = useDataService('Sidebar');

  const getMenuItems = () => {
    // Get menu items from service
    const menuData = dataService.getMenuItems();
    
    // Icon mapping for menu items
    const iconMap = {
      Dashboard: <Dashboard />,
      AdminPanelSettings: <AdminPanelSettings />,
      Business: <Business />,
      Analytics: <Analytics />,
      Person: <Person />,
      Assignment: <Assignment />,
      Event: <Event />,
      CardMembership: <CardMembership />,
      Folder: <Folder />,
      School: <School />
    };
    
    // Get menu items for current role from service data
    const roleMenuItems = menuData.menuItems?.[userRole];
    
    if (roleMenuItems) {
      return roleMenuItems.map(item => ({
        ...item,
        icon: iconMap[item.icon] || <Dashboard />
      }));
    }
    
    // Fallback to hardcoded menu items if service data not available
    if (userRole === 'admin') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
        { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/app/admin' },
        { text: 'Settings', icon: <Business />, path: '/app/settings' },
      ];
    } else if (userRole === 'student') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
        { text: 'My Profile', icon: <Person />, path: '/app/profile' },
        { text: 'Activities', icon: <Assignment />, path: '/app/activities' },
        { text: 'Events', icon: <Event />, path: '/app/events' },
        { text: 'Certificates', icon: <CardMembership />, path: '/app/certificates' },
        { text: 'Portfolio', icon: <Folder />, path: '/app/portfolio' },
      ];
    } else if (userRole === 'faculty') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/app/dashboard' },
        { text: 'Faculty Panel', icon: <School />, path: '/app/faculty' },
        { text: 'My Profile', icon: <Person />, path: '/app/profile' },
        { text: 'Events', icon: <Event />, path: '/app/events' },
      ];
    }
    return [];
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
            <Tooltip title={!open ? 'Analytics' : ''} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation('/app/analytics')}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    backgroundColor: isActive('/app/analytics')
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
                    <Analytics />
                  </ListItemIcon>
                  <ListItemText
                    primary="Analytics"
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
