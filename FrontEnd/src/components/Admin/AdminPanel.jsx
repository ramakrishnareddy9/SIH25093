import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Settings,
  Add,
  Edit,
  Block,
  CheckCircle,
  SupervisorAccount,
  ManageAccounts,
  CloudUpload,
  Download,
  Refresh,
  Assessment,
  Event,
  CardMembership,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const AdminPanel = () => {
  const { user } = useAuth();
  const dataService = useDataService('AdminPanel');
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoApproval: false,
    maxFileSize: 10,
    sessionTimeout: 30,
  });

  // Get data from centralized service
  const students = dataService.getAllStudents();
  const faculty = dataService.getAllFaculty();
  const activities = dataService.getAllActivities();
  const events = dataService.getAllEvents();
  const certificates = dataService.getAllCertificates();
  const statistics = dataService.getStatistics();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserAction = (userId, action) => {
    // In a real app, this would call the DataService to update user status
    console.log(`User ${userId} ${action}d`);
    // For now, just log the action since we're using read-only data
  };

  const handleSystemSettingChange = (setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    
    // In a real app, this would save to backend
    console.log(`System setting ${setting} changed to:`, value);
    
    // Save to localStorage for persistence
    const updatedSettings = { ...systemSettings, [setting]: value };
    localStorage.setItem('systemSettings', JSON.stringify(updatedSettings));
  };

  // Load system settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSystemSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
    }
  }, []);

  // System action handlers
  const handleSystemAction = (action) => {
    switch (action) {
      case 'backup':
        console.log('Initiating system backup...');
        // In a real app, this would trigger a backup process
        alert('System backup initiated successfully!');
        break;
      case 'export':
        console.log('Exporting system data...');
        // In a real app, this would export data
        alert('Data export started. You will receive a download link shortly.');
        break;
      case 'clearCache':
        console.log('Clearing system cache...');
        // Clear localStorage cache
        localStorage.removeItem('systemCache');
        alert('System cache cleared successfully!');
        break;
      case 'generateReport':
        console.log('Generating system report...');
        // In a real app, this would generate a comprehensive report
        alert('System report generation started. Report will be available in the downloads section.');
        break;
      default:
        console.log('Unknown system action:', action);
    }
  };

  // Use statistics from DataService
  const stats = {
    totalUsers: students.length + faculty.length,
    activeUsers: students.length + faculty.length, // Assuming all are active
    totalStudents: statistics.totalStudents,
    totalFaculty: statistics.totalFaculty,
    totalActivities: statistics.totalActivities,
    pendingActivities: statistics.pendingActivities,
    approvedActivities: statistics.approvedActivities,
    totalEvents: statistics.totalEvents,
    approvedCertificates: statistics.approvedCertificates,
  };

  // Dashboard Tab - Simplified
  const DashboardTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          System Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Student activity management system administration
        </Typography>
      </Grid>
      
      {/* Key Metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className="settings-card">
          <CardContent sx={{ textAlign: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalUsers}</Typography>
            <Typography color="text.secondary">Total Users</Typography>
            <Typography variant="caption" color="success.main">
              {stats.activeUsers} Active
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="settings-card">
          <CardContent sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalStudents}</Typography>
            <Typography color="text.secondary">Students</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="settings-card">
          <CardContent sx={{ textAlign: 'center' }}>
            <SupervisorAccount sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalFaculty}</Typography>
            <Typography color="text.secondary">Faculty</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Administrative Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => setTabValue(1)}
                  sx={{ height: 60 }}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => setTabValue(2)}
                  sx={{ height: 60 }}
                >
                  System Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // User Management Tab
  const UserManagementTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">User Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setUserDialogOpen(true)}
          >
            Add User
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Card className="settings-card">
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...students.map(s => ({...s, role: 'student'})), ...faculty.map(f => ({...f, role: 'faculty'}))].map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }} src={user.profileImage}>
                            {user.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={
                            user.role === 'admin' ? 'error' :
                            user.role === 'faculty' ? 'secondary' : 'primary'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedUser(user)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleUserAction(user.id, 'deactivate')}
                          color="error"
                        >
                          <Block />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // System Settings Tab
  const SystemSettingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          System Configuration
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Maintenance Mode"
                  secondary="Enable to restrict system access"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                    color="warning"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="User Registration"
                  secondary="Allow new user registrations"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onChange={(e) => handleSystemSettingChange('registrationEnabled', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Send system email notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onChange={(e) => handleSystemSettingChange('emailNotifications', e.target.checked)}
                    color="info"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Auto-Approval"
                  secondary="Automatically approve certain activities"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={systemSettings.autoApproval}
                    onChange={(e) => handleSystemSettingChange('autoApproval', e.target.checked)}
                    color="success"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Limits
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Maximum File Size (MB)
              </Typography>
              <TextField
                type="number"
                value={systemSettings.maxFileSize}
                onChange={(e) => handleSystemSettingChange('maxFileSize', parseInt(e.target.value))}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Session Timeout (minutes)
              </Typography>
              <TextField
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => handleSystemSettingChange('sessionTimeout', parseInt(e.target.value))}
                fullWidth
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  color="info"
                  onClick={() => handleSystemAction('backup')}
                >
                  Backup System
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  color="primary"
                  onClick={() => handleSystemAction('export')}
                >
                  Export Data
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  color="warning"
                  onClick={() => handleSystemAction('clearCache')}
                >
                  Clear Cache
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  color="success"
                  onClick={() => handleSystemAction('generateReport')}
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

  // Analytics Tab
  const AnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Application Analytics & Reports
        </Typography>
      </Grid>

      {/* User Analytics */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Registration Trends
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">This Month: +24 new users</Typography>
              <LinearProgress variant="determinate" value={75} color="success" sx={{ mb: 1 }} />
              <Typography variant="body2">Last Month: +18 new users</Typography>
              <LinearProgress variant="determinate" value={60} color="info" sx={{ mb: 1 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              33% increase in registrations
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Analytics */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Activity Submission Trends
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Pending: {stats.pendingActivities}</Typography>
              <LinearProgress variant="determinate" value={30} color="warning" sx={{ mb: 1 }} />
              <Typography variant="body2">Approved: {stats.approvedActivities}</Typography>
              <LinearProgress variant="determinate" value={85} color="success" sx={{ mb: 1 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {Math.round((stats.approvedActivities / (stats.pendingActivities + stats.approvedActivities)) * 100)}% approval rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Department-wise Statistics */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Department-wise Distribution
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Computer Science" secondary="45 students, 8 faculty" />
                <Typography variant="body2" color="primary">38%</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Electronics" secondary="32 students, 6 faculty" />
                <Typography variant="body2" color="secondary">25%</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Mechanical" secondary="28 students, 5 faculty" />
                <Typography variant="body2" color="info.main">22%</Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Civil" secondary="18 students, 4 faculty" />
                <Typography variant="body2" color="warning.main">15%</Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* System Performance */}
      <Grid item xs={12} md={6}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              System Performance Metrics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Average Response Time</Typography>
              <LinearProgress variant="determinate" value={25} color="success" sx={{ mb: 1 }} />
              <Typography variant="caption">245ms - Excellent</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Server Uptime</Typography>
              <LinearProgress variant="determinate" value={99} color="success" sx={{ mb: 1 }} />
              <Typography variant="caption">99.8% - Last 30 days</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Error Rate</Typography>
              <LinearProgress variant="determinate" value={5} color="success" sx={{ mb: 1 }} />
              <Typography variant="caption">0.2% - Very Low</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Reports */}
      <Grid item xs={12}>
        <Card className="settings-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Activity Reports
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h5">{stats.approvedActivities + stats.pendingActivities}</Typography>
                  <Typography variant="body2">Total Activities</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Event sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h5">{stats.totalEvents}</Typography>
                  <Typography variant="body2">Events Organized</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardMembership sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h5">{stats.approvedCertificates}</Typography>
                  <Typography variant="body2">Certificates Issued</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h5">+15%</Typography>
                  <Typography variant="body2">Growth Rate</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1">
          System administration and management dashboard
        </Typography>
      </Paper>

      {/* Admin Content */}
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
          }}
        >
          <Tab icon={<Dashboard />} label="Overview" />
          <Tab icon={<ManageAccounts />} label="Users" />
          <Tab icon={<Settings />} label="System" />
        </Tabs>

        {tabValue === 0 && <DashboardTab />}
        {tabValue === 1 && <UserManagementTab />}
        {tabValue === 2 && <SystemSettingsTab />}
      </Paper>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
