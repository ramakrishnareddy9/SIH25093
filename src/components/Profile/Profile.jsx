import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  School,
  Person,
  Security,
  Notifications,
  Download,
  Upload,
} from '@mui/icons-material';

// Import data
import studentsData from '../../data/students.json';
import activitiesData from '../../data/activities.json';

const Profile = ({ userRole }) => {
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [activities, setActivities] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Get current student data (first student for demo)
    const currentStudent = studentsData[0];
    setStudent(currentStudent);
    setEditedStudent(currentStudent);

    // Get student activities
    const studentActivities = activitiesData.filter(
      (activity) => activity.studentId === currentStudent.id
    );
    setActivities(studentActivities);
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setEditedStudent(student); // Reset changes
    }
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setStudent(editedStudent);
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field, value) => {
    setEditedStudent({
      ...editedStudent,
      [field]: value,
    });
  };

  const PersonalInfoTab = () => (
    <Box>
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={editedStudent?.profileImage}
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                />
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <PhotoCamera />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" gutterBottom>
                {editedStudent?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {editedStudent?.rollNumber}
              </Typography>
              <Chip
                label={`Year ${editedStudent?.year} Student`}
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  startIcon={editMode ? <Save /> : <Edit />}
                  onClick={editMode ? handleSave : handleEditToggle}
                  variant={editMode ? 'contained' : 'outlined'}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {editMode && (
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleEditToggle}
                    sx={{ ml: 1 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={editedStudent?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Roll Number"
                    value={editedStudent?.rollNumber || ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={editedStudent?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editedStudent?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={editedStudent?.department || ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={editedStudent?.year || ''}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={editedStudent?.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Blood Group"
                    value={editedStudent?.bloodGroup || ''}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={editedStudent?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Parent Contact"
                    value={editedStudent?.parentContact || ''}
                    onChange={(e) => handleInputChange('parentContact', e.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const AcademicInfoTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Academic Performance
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <School color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Current GPA"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h4" color="primary" sx={{ mr: 2 }}>
                        {student?.gpa}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(student?.gpa / 10) * 100}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Attendance"
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="h4" color="success.main" sx={{ mr: 2 }}>
                        {student?.attendance}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={student?.attendance}
                        color="success"
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Credit Progress
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Credits Completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(student?.completedCredits / student?.totalCredits) * 100}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2">
                {student?.completedCredits} / {student?.totalCredits} credits
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Activity Credits Earned
            </Typography>
            <Typography variant="h4" color="primary">
              {activities
                .filter((activity) => activity.status === 'approved')
                .reduce((sum, activity) => sum + activity.credits, 0)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activities Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary">
                    {activities.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Activities
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="success.main">
                    {activities.filter((activity) => activity.status === 'approved').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approved
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="warning.main">
                    {activities.filter((activity) => activity.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color="secondary.main">
                    {[...new Set(activities.map((activity) => activity.type))].length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activity Types
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const SettingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
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
                <Button variant="outlined" size="small">
                  Change
                </Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText
                  primary="Notification Preferences"
                  secondary="Manage email and push notifications"
                />
                <Button variant="outlined" size="small">
                  Configure
                </Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Download />
                </ListItemIcon>
                <ListItemText
                  primary="Export Data"
                  secondary="Download your complete profile data"
                />
                <Button variant="outlined" size="small">
                  Export
                </Button>
              </ListItem>
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
                  secondary="Control who can see your profile"
                />
                <Chip label="Public" color="success" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Activity Sharing"
                  secondary="Allow activities to be shared in reports"
                />
                <Chip label="Enabled" color="primary" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Portfolio Access"
                  secondary="Who can access your digital portfolio"
                />
                <Chip label="Faculty Only" color="warning" size="small" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              These actions cannot be undone. Please proceed with caution.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error">
                Deactivate Account
              </Button>
              <Button variant="outlined" color="error">
                Delete All Data
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Profile Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information, academic details, and account settings
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper className="content-section">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Personal Info" icon={<Person />} />
            <Tab label="Academic Info" icon={<School />} />
            <Tab label="Settings" icon={<Security />} />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <PersonalInfoTab />}
          {tabValue === 1 && <AcademicInfoTab />}
          {tabValue === 2 && <SettingsTab />}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
