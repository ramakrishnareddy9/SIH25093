import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  School,
  Logout,
  Person,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const Navbar = ({ toggleSidebar, userRole }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dataService = useDataService('Navbar');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/app/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/app/settings');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'primary';
      case 'faculty':
        return 'secondary';
      case 'admin':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get dynamic notifications based on user role
  const getNotifications = () => {
    const notifications = [];
    
    if (user?.role === 'faculty') {
      // Faculty notifications: pending activities and certificates to review
      const pendingActivities = dataService.getActivitiesByStatus('pending');
      const pendingCertificates = dataService.getCertificatesByStatus('pending');
      
      pendingActivities.forEach(activity => {
        const student = dataService.getStudentById(activity.studentId);
        notifications.push({
          id: `activity_${activity.id}`,
          type: 'activity_approval',
          title: 'Activity Approval Required',
          message: `${student?.name || 'Student'} submitted "${activity.title}" for approval`,
          timestamp: activity.submissionDate,
          actionUrl: '/app/faculty'
        });
      });
      
      pendingCertificates.forEach(cert => {
        const student = dataService.getStudentById(cert.studentId);
        notifications.push({
          id: `cert_${cert.id}`,
          type: 'certificate_validation',
          title: 'Certificate Validation Required',
          message: `${student?.name || 'Student'} uploaded "${cert.title}" for validation`,
          timestamp: cert.uploadDate,
          actionUrl: '/app/faculty'
        });
      });
      
    } else if (user?.role === 'student') {
      // Student notifications: activity approvals, certificate status
      const studentActivities = dataService.getActivitiesByStudent(user.id);
      const studentCertificates = dataService.getCertificatesByStudent(user.id);
      
      // Recent activity approvals/rejections
      studentActivities
        .filter(activity => 
          activity.status === 'approved' || activity.status === 'rejected'
        )
        .slice(0, 5)
        .forEach(activity => {
          notifications.push({
            id: `activity_status_${activity.id}`,
            type: activity.status === 'approved' ? 'activity_approved' : 'activity_rejected',
            title: `Activity ${activity.status === 'approved' ? 'Approved' : 'Rejected'}`,
            message: `Your activity "${activity.title}" has been ${activity.status}`,
            timestamp: activity.approvalDate || activity.rejectionDate,
            actionUrl: '/app/activities'
          });
        });
      
      // Certificate validation status
      studentCertificates
        .filter(cert => cert.status === 'approved' || cert.status === 'rejected')
        .slice(0, 3)
        .forEach(cert => {
          notifications.push({
            id: `cert_status_${cert.id}`,
            type: cert.status === 'approved' ? 'certificate_approved' : 'certificate_rejected',
            title: `Certificate ${cert.status === 'approved' ? 'Validated' : 'Rejected'}`,
            message: `Your certificate "${cert.title}" has been ${cert.status}`,
            timestamp: cert.approvalDate || cert.rejectionDate,
            actionUrl: '/app/certificates'
          });
        });
        
    } else if (user?.role === 'admin') {
      // Admin notifications: system-wide pending items
      const pendingActivities = dataService.getActivitiesByStatus('pending');
      const pendingCertificates = dataService.getCertificatesByStatus('pending');
      const allEvents = dataService.getAllEvents();
      
      if (pendingActivities.length > 0) {
        notifications.push({
          id: 'admin_activities',
          type: 'admin_overview',
          title: 'Pending Activities',
          message: `${pendingActivities.length} activities awaiting faculty approval`,
          timestamp: new Date().toISOString(),
          actionUrl: '/app/admin'
        });
      }
      
      if (pendingCertificates.length > 0) {
        notifications.push({
          id: 'admin_certificates',
          type: 'admin_overview',
          title: 'Pending Certificates',
          message: `${pendingCertificates.length} certificates awaiting validation`,
          timestamp: new Date().toISOString(),
          actionUrl: '/app/admin'
        });
      }
      
      // Recent events created
      const recentEvents = allEvents
        .filter(event => {
          const eventDate = new Date(event.createdDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return eventDate > weekAgo;
        })
        .slice(0, 3);
        
      recentEvents.forEach(event => {
        notifications.push({
          id: `event_${event.id}`,
          type: 'new_event',
          title: 'New Event Created',
          message: `"${event.title}" created by ${event.createdBy || event.organizer.name}`,
          timestamp: event.createdDate,
          actionUrl: '/app/events'
        });
      });
    }
    
    // Sort by timestamp (newest first) and limit to 10
    return notifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const notifications = getNotifications();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <School sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Smart Student Hub
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
              <Chip
                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                color={getRoleColor(user.role)}
                size="small"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            </>
          )}

          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationMenuOpen}
          >
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar 
              src={user?.profile?.profileImage} 
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.charAt(0) || <AccountCircle />}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>
            <Person sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <Settings sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 350, maxHeight: 400 }
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={() => {
                  navigate(notification.actionUrl);
                  handleMenuClose();
                }}
                sx={{ 
                  whiteSpace: 'normal',
                  alignItems: 'flex-start',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(notification.timestamp).toLocaleDateString()} {new Date(notification.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;