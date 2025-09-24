import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Palette,
  Language,
  Storage,
  Help,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Visibility,
  VisibilityOff,
  Delete,
  Download,
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const Settings = ({ userRole }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      activities: true,
      events: true,
      certificates: true,
      facultyMeetings: true,
    },
    privacy: {
      profileVisible: true,
      activitiesVisible: true,
      contactVisible: false,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      autoSave: true,
      compactView: false,
    },
    systemLimits: {
      maxFileSize: 10,
      sessionTimeout: 30,
      maxUsers: 1000,
    },
  });
  const getInitialProfileData = () => {
    const baseData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || '',
      bio: user?.profile?.bio || '',
    };

    if (userRole === 'student') {
      return {
        ...baseData,
        department: user?.profile?.department || '',
        year: user?.profile?.year || '',
        rollNumber: user?.profile?.rollNumber || '',
      };
    } else if (userRole === 'faculty') {
      return {
        ...baseData,
        department: user?.profile?.department || '',
        designation: user?.profile?.designation || 'Professor',
        experience: user?.profile?.experience || '',
        specialization: user?.profile?.specialization || [],
        qualifications: user?.profile?.qualifications || [],
      };
    } else {
      return baseData;
    }
  };

  const [profileData, setProfileData] = useState(getInitialProfileData());
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Theme and preference functions
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--bg-color', '#121212');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--card-bg', '#1e1e1e');
      root.style.setProperty('--border-color', '#333333');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (theme === 'light') {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--border-color', '#e0e0e0');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      // Auto theme based on system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(isDark ? 'dark' : 'light');
    }
  };

  const applyLanguage = (language) => {
    document.documentElement.lang = language;
    console.log(`Language changed to: ${language}`);
  };

  const applyCompactView = (compact) => {
    if (compact) {
      document.body.classList.add('compact-view');
    } else {
      document.body.classList.remove('compact-view');
    }
  };

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Apply saved preferences
        if (parsedSettings.preferences) {
          if (parsedSettings.preferences.theme) {
            applyTheme(parsedSettings.preferences.theme);
          }
          if (parsedSettings.preferences.language) {
            applyLanguage(parsedSettings.preferences.language);
          }
          if (parsedSettings.preferences.compactView) {
            applyCompactView(parsedSettings.preferences.compactView);
          }
        }
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (category, setting, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value,
      },
    };
    
    setSettings(newSettings);
    
    // Apply theme changes immediately
    if (category === 'preferences' && setting === 'theme') {
      applyTheme(value);
    }
    
    // Apply language changes
    if (category === 'preferences' && setting === 'language') {
      applyLanguage(value);
    }
    
    // Apply compact view
    if (category === 'preferences' && setting === 'compactView') {
      applyCompactView(value);
    }
    
    // Auto-save settings
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
    }, 500);
  };


  const handleSaveSettings = () => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    try {
      // Update user profile
      updateUser({
        ...user,
        name: profileData.name,
        profile: {
          ...user.profile,
          ...profileData,
        },
      });
      setEditMode(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    // Simulate password change
    try {
      // Here you would typically call an API to change the password
      console.log('Password changed successfully');
      alert('Password changed successfully!');
      setChangePasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to change password. Please try again.');
    }
  };

  const handleExportData = () => {
    // Export user data as JSON
    const dataToExport = {
      profile: user,
      settings: settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name}_data_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Admin System Configuration Tab
  const AdminSystemTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          System Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Configure system-wide settings and parameters
        </Typography>
      </Grid>

      {/* System Information */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="System Version" 
                  secondary="Smart Student Hub v2.1.0" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Database Status" 
                  secondary="Connected - Operational" 
                />
                <Chip label="Online" color="success" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Last Backup" 
                  secondary={new Date().toLocaleDateString()} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="System Uptime" 
                  secondary="99.8% (Last 30 days)" 
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* System Limits */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Limits & Quotas
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Maximum File Upload Size (MB)
              </Typography>
              <TextField
                type="number"
                value={settings.systemLimits?.maxFileSize || 10}
                onChange={(e) => handleSettingChange('systemLimits', 'maxFileSize', parseInt(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Session Timeout (minutes)
              </Typography>
              <TextField
                type="number"
                value={settings.systemLimits?.sessionTimeout || 30}
                onChange={(e) => handleSettingChange('systemLimits', 'sessionTimeout', parseInt(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 5, max: 480 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Maximum Users Per Institution
              </Typography>
              <TextField
                type="number"
                value={settings.systemLimits?.maxUsers || 1000}
                onChange={(e) => handleSettingChange('systemLimits', 'maxUsers', parseInt(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 10, max: 10000 }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* System Maintenance */}
      <Grid item xs={12}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Maintenance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="info"
                  onClick={() => alert('System backup initiated')}
                  sx={{ height: 60 }}
                >
                  Backup System
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => alert('Data export started')}
                  sx={{ height: 60 }}
                >
                  Export Data
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    localStorage.clear();
                    alert('System cache cleared');
                  }}
                  sx={{ height: 60 }}
                >
                  Clear Cache
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  onClick={() => alert('System report generated')}
                  sx={{ height: 60 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const ProfileTab = () => {
    // For admin users, show system configuration instead of personal profile
    if (userRole === 'admin') {
      return <AdminSystemTab />;
    }

    // Regular profile tab for students and faculty
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="settings-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={user?.profile?.profileImage}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  className="settings-avatar"
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: -8,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                  size="small"
                >
                  <PhotoCamera />
                </IconButton>
              </Box>
              <Typography variant="h6" gutterBottom>
                {user?.name}
              </Typography>
              <Chip
                label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                color="primary"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
        <Card className="settings-card">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Button
                startIcon={editMode ? <Save /> : <Edit />}
                onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                variant={editMode ? 'contained' : 'outlined'}
              >
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  disabled
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              {userRole === 'student' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Year"
                      value={profileData.year}
                      onChange={(e) => handleProfileChange('year', e.target.value)}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      value={profileData.rollNumber}
                      disabled
                    />
                  </Grid>
                </>
              )}
              {userRole === 'faculty' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => handleProfileChange('department', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Faculty ID"
                      value={user?.facultyId || ''}
                      disabled
                      InputProps={{
                        startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth disabled={!editMode}>
                      <InputLabel>Designation</InputLabel>
                      <Select
                        value={profileData.designation || 'Professor'}
                        onChange={(e) => handleProfileChange('designation', e.target.value)}
                        startAdornment={<Work sx={{ mr: 1, color: 'text.secondary' }} />}
                      >
                        <MenuItem value="Professor">Professor</MenuItem>
                        <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                        <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                        <MenuItem value="Lecturer">Lecturer</MenuItem>
                        <MenuItem value="Senior Lecturer">Senior Lecturer</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience (Years)"
                      value={profileData.experience || ''}
                      onChange={(e) => handleProfileChange('experience', e.target.value)}
                      disabled={!editMode}
                      type="number"
                      inputProps={{ min: 0, max: 50 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Specialization Areas"
                      value={Array.isArray(profileData.specialization) ? profileData.specialization.join(', ') : ''}
                      onChange={(e) => handleProfileChange('specialization', e.target.value.split(', ').filter(s => s.trim()))}
                      disabled={!editMode}
                      placeholder="e.g., Artificial Intelligence, Machine Learning, Data Science"
                      helperText="Separate multiple specializations with commas"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Qualifications"
                      value={Array.isArray(profileData.qualifications) ? profileData.qualifications.join(', ') : ''}
                      onChange={(e) => handleProfileChange('qualifications', e.target.value.split(', ').filter(q => q.trim()))}
                      disabled={!editMode}
                      placeholder="e.g., Ph.D. in Computer Science, M.Tech in AI"
                      helperText="Separate multiple qualifications with commas"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Admin ID"
                      value={user?.id || ''}
                      disabled
                      InputProps={{
                        startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Role"
                      value="System Administrator"
                      disabled
                      InputProps={{
                        startAdornment: <Security sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Access Level"
                      value="Full System Access"
                      disabled
                      InputProps={{
                        startAdornment: <Security sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Login"
                      value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                      disabled
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  disabled={!editMode}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        </Grid>
      </Grid>
    );
  };

  const NotificationTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Channels
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="Email Notifications" secondary="Receive notifications via email" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    className="settings-switch"
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Push Notifications" secondary="Browser push notifications" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    className="settings-switch"
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="SMS Notifications" secondary="Text message alerts" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Types
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary={userRole === 'faculty' ? "Student Activity Approvals" : "Activity Updates"} 
                  secondary={userRole === 'faculty' ? "Notifications for student activities requiring approval" : "New activities and approvals"} 
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.activities}
                    onChange={(e) => handleSettingChange('notifications', 'activities', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Event Notifications" 
                  secondary={userRole === 'faculty' ? "Event organization and student registrations" : "New events and registrations"} 
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.events}
                    onChange={(e) => handleSettingChange('notifications', 'events', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Certificate Updates" 
                  secondary={userRole === 'faculty' ? "Certificate verification requests" : "Certificate status changes"} 
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.certificates}
                    onChange={(e) => handleSettingChange('notifications', 'certificates', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {userRole === 'faculty' && (
                <ListItem>
                  <ListItemText 
                    primary="Faculty Meetings" 
                    secondary="Department meetings and academic announcements" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.facultyMeetings || true}
                      onChange={(e) => handleSettingChange('notifications', 'facultyMeetings', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Password & Security
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    Change
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Visibility />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" size="small">
                    Enable
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              {userRole === 'admin' && (
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Admin Session Timeout"
                    secondary="Automatically logout after inactivity"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" size="small">
                      Configure
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Profile Visibility" 
                  secondary={userRole === 'admin' ? "Admin profile visibility to other users" : "Make your profile visible to others"} 
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {userRole !== 'admin' && (
                <ListItem>
                  <ListItemText primary="Activities Visibility" secondary="Show your activities to others" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.activitiesVisible}
                      onChange={(e) => handleSettingChange('privacy', 'activitiesVisible', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )}
              <ListItem>
                <ListItemText 
                  primary="Contact Information" 
                  secondary={userRole === 'admin' ? "Show admin contact to users" : "Allow others to see your contact info"} 
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.privacy.contactVisible}
                    onChange={(e) => handleSettingChange('privacy', 'contactVisible', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {userRole === 'admin' && (
                <ListItem>
                  <ListItemText 
                    primary="System Logs Access" 
                    secondary="Allow viewing of system audit logs" 
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={true}
                      disabled
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const PreferencesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Display Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.preferences.theme}
                    onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  >
                    <MenuItem value="light">🌞 Light Mode</MenuItem>
                    <MenuItem value="dark">🌙 Dark Mode</MenuItem>
                    <MenuItem value="auto">🔄 Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  >
                    <MenuItem value="en">🇺🇸 English</MenuItem>
                    <MenuItem value="hi">🇮🇳 हिंदी (Hindi)</MenuItem>
                    <MenuItem value="es">🇪🇸 Español</MenuItem>
                    <MenuItem value="fr">🇫🇷 Français</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Compact View" 
                      secondary="Reduce spacing for more content" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.preferences.compactView}
                        onChange={(e) => handleSettingChange('preferences', 'compactView', e.target.checked)}
                        className="settings-switch"
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Auto-Save Settings" 
                      secondary="Automatically save changes" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.preferences.autoSave}
                        onChange={(e) => handleSettingChange('preferences', 'autoSave', e.target.checked)}
                        className="settings-switch"
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Regional Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.preferences.timezone}
                    onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                  >
                    <MenuItem value="Asia/Kolkata">🇮🇳 Asia/Kolkata (IST)</MenuItem>
                    <MenuItem value="America/New_York">🇺🇸 America/New_York (EST)</MenuItem>
                    <MenuItem value="Europe/London">🇬🇧 Europe/London (GMT)</MenuItem>
                    <MenuItem value="Asia/Tokyo">🇯🇵 Asia/Tokyo (JST)</MenuItem>
                    <MenuItem value="Australia/Sydney">🇦🇺 Australia/Sydney (AEST)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.preferences.dateFormat}
                    onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (15/03/2024)</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (03/15/2024)</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2024-03-15)</MenuItem>
                    <MenuItem value="DD MMM YYYY">DD MMM YYYY (15 Mar 2024)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Current time: {new Date().toLocaleString('en-US', { 
                    timeZone: settings.preferences.timezone,
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const DataTab = () => {
    if (userRole === 'admin') {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Manage system data, backups, and database operations.
            </Alert>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Data Export
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Export all system data including users, activities, and analytics.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => alert('System data export initiated')}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Export All System Data
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => alert('Database backup created')}
                  fullWidth
                >
                  Create Database Backup
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  System maintenance and data cleanup operations.
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => alert('Cache cleared successfully')}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Clear System Cache
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => alert('Logs archived')}
                  fullWidth
                >
                  Archive System Logs
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error">
                  System Maintenance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Critical system operations - use with caution.
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => alert('System reset initiated - This would reset all system settings')}
                      fullWidth
                    >
                      Reset System Settings
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => alert('Database cleanup initiated')}
                      fullWidth
                    >
                      Database Cleanup
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }

    // Regular data tab for students and faculty
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Manage your data and account settings. You can export your data or delete your account.
          </Alert>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Data Export
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Download a copy of your data including profile, activities, and settings.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportData}
                fullWidth
              >
                Export My Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Permanently delete your account and all associated data.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                fullWidth
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          {userRole === 'admin' ? 'System Settings' : 'Settings'}
        </Typography>
        <Typography variant="body1">
          {userRole === 'admin' 
            ? 'Configure system-wide settings, security, and administrative options'
            : 'Manage your account settings, preferences, and privacy options'
          }
        </Typography>
      </Paper>

      {/* Settings Content */}
      <Paper className="content-section settings-container">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 3,
            '& .MuiTab-root': {
              minHeight: 72,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
          }}
        >
          <Tab 
            icon={userRole === 'admin' ? <Security /> : <Person />} 
            label={userRole === 'admin' ? 'System Config' : 'Profile'} 
            className="settings-tab" 
          />
          <Tab icon={<Notifications />} label="Notifications" className="settings-tab" />
          <Tab icon={<Security />} label="Security" className="settings-tab" />
          <Tab icon={<Palette />} label="Preferences" className="settings-tab" />
          <Tab icon={<Storage />} label={userRole === 'admin' ? 'System Data' : 'Data'} className="settings-tab" />
        </Tabs>

        {tabValue === 0 && <ProfileTab />}
        {tabValue === 1 && <NotificationTab />}
        {tabValue === 2 && <SecurityTab />}
        {tabValue === 3 && <PreferencesTab />}
        {tabValue === 4 && <DataTab />}
        
        {/* Save Settings Button */}
        {tabValue !== 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              Save Settings
            </Button>
          </Box>
        )}
      </Paper>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleChangePassword} variant="contained" startIcon={<Save />}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
