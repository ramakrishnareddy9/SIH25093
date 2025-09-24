import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tabs,
  Tab,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Pending,
  Cancel,
  Upload,
  Download,
  FilterList,
} from '@mui/icons-material';

// Import services and hooks
import { useDataService } from '../../hooks/useDataService';

const ActivityTracker = ({ userRole }) => {
  const dataService = useDataService('ActivityTracker');
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newActivity, setNewActivity] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    date: '',
    duration: '',
    location: '',
    organizer: '',
    credits: 0,
    skills: [],
  });

  // Get dynamic activity types and categories from service
  const activityTypesData = dataService.getActivityTypes();
  const activityTypes = activityTypesData.activityTypes?.map(type => type.type) || [
    'conference',
    'certification',
    'internship',
    'competition',
    'volunteering',
    'leadership',
    'workshop',
  ];

  const categories = activityTypesData.categories || [
    'Academic',
    'Technical',
    'Leadership',
    'Community Service',
    'Professional',
  ];

  useEffect(() => {
    // Load activities from service based on user role
    if (userRole === 'student') {
      // Show only current student's activities
      const studentActivities = dataService.getActivitiesByStudent('STU001');
      setActivities(studentActivities);
    } else {
      // Show all activities for faculty/admin
      const allActivities = dataService.getAllActivities();
      setActivities(allActivities);
    }
  }, [userRole]); // Remove dataService dependency to prevent infinite loop

  useEffect(() => {
    // Apply filters
    let filtered = activities;

    if (filterType !== 'all') {
      filtered = filtered.filter((activity) => activity.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((activity) => activity.status === filterStatus);
    }

    // Apply tab filter
    if (tabValue === 1) {
      filtered = filtered.filter((activity) => activity.status === 'pending');
    } else if (tabValue === 2) {
      filtered = filtered.filter((activity) => activity.status === 'approved');
    }

    setFilteredActivities(filtered);
  }, [activities, filterType, filterStatus, tabValue]);

  const handleOpenDialog = (activity = null) => {
    if (activity) {
      setSelectedActivity(activity);
      setNewActivity(activity);
    } else {
      setSelectedActivity(null);
      setNewActivity({
        title: '',
        type: '',
        category: '',
        description: '',
        date: '',
        duration: '',
        location: '',
        organizer: '',
        credits: 0,
        skills: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedActivity(null);
  };

  const handleSaveActivity = () => {
    if (selectedActivity) {
      // Update existing activity
      const updatedActivities = activities.map((activity) =>
        activity.id === selectedActivity.id
          ? { ...newActivity, id: selectedActivity.id }
          : activity
      );
      setActivities(updatedActivities);
    } else {
      // Add new activity
      const newId = `ACT${String(activities.length + 1).padStart(3, '0')}`;
      const activityToAdd = {
        ...newActivity,
        id: newId,
        studentId: 'STU001',
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        evidence: [],
      };
      setActivities([...activities, activityToAdd]);
    }
    handleCloseDialog();
  };

  const handleDeleteActivity = (activityId) => {
    const updatedActivities = activities.filter(
      (activity) => activity.id !== activityId
    );
    setActivities(updatedActivities);
  };

  const handleApproveActivity = (activityId) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId
        ? {
            ...activity,
            status: 'approved',
            approvedBy: 'Current Faculty',
            approvalDate: new Date().toISOString().split('T')[0],
          }
        : activity
    );
    setActivities(updatedActivities);
  };

  const handleRejectActivity = (activityId) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === activityId
        ? { ...activity, status: 'rejected' }
        : activity
    );
    setActivities(updatedActivities);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'conference':
        return '🎤';
      case 'certification':
        return '🏆';
      case 'internship':
        return '💼';
      case 'competition':
        return '🏅';
      case 'volunteering':
        return '🤝';
      case 'leadership':
        return '👑';
      case 'workshop':
        return '🔧';
      default:
        return '📋';
    }
  };

  const ActivityCard = ({ activity }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" noWrap>
            {getTypeIcon(activity.type)} {activity.title}
          </Typography>
          <Chip
            label={activity.status}
            color={getStatusColor(activity.status)}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {activity.category} • {activity.type}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {activity.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            📅 {activity.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⭐ {activity.credits} credits
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          📍 {activity.location}
        </Typography>
        {activity.organizer && (
          <Typography variant="body2" color="text.secondary">
            🏢 {activity.organizer}
          </Typography>
        )}
        {activity.skills && activity.skills.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {activity.skills.slice(0, 3).map((skill, index) => (
              <Chip key={index} label={skill} size="small" variant="outlined" />
            ))}
            {activity.skills.length > 3 && (
              <Chip
                label={`+${activity.skills.length - 3} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <IconButton
          size="small"
          onClick={() => handleOpenDialog(activity)}
          color="primary"
        >
          <Visibility />
        </IconButton>
        {userRole === 'student' && activity.status === 'pending' && (
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(activity)}
            color="primary"
          >
            <Edit />
          </IconButton>
        )}
        {userRole === 'faculty' && activity.status === 'pending' && (
          <>
            <IconButton
              size="small"
              onClick={() => handleApproveActivity(activity.id)}
              color="success"
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleRejectActivity(activity.id)}
              color="error"
            >
              <Cancel />
            </IconButton>
          </>
        )}
        {userRole === 'student' && (
          <IconButton
            size="small"
            onClick={() => handleDeleteActivity(activity.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Activity Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === 'student'
            ? 'Manage and track your academic and extracurricular activities'
            : 'Review and approve student activities'}
        </Typography>
      </Paper>

      {/* Tabs and Filters */}
      <Paper className="content-section">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Activities" />
            <Tab label="Pending Approval" />
            <Tab label="Approved" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              label="Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              {activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {filteredActivities.length} activities found
          </Typography>
        </Box>
      </Paper>

      {/* Activities Grid */}
      <Box className="card-grid">
        <Grid container spacing={3}>
        {filteredActivities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <ActivityCard activity={activity} />
          </Grid>
        ))}
        </Grid>
      </Box>

      {/* Add Activity FAB */}
      {userRole === 'student' && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <Add />
        </Fab>
      )}

      {/* Activity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedActivity ? 'View/Edit Activity' : 'Add New Activity'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Activity Title"
                value={newActivity.title}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, title: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newActivity.type}
                  label="Type"
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, type: e.target.value })
                  }
                  disabled={userRole !== 'student'}
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newActivity.category}
                  label="Category"
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, category: e.target.value })
                  }
                  disabled={userRole !== 'student'}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, description: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newActivity.date}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, date: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={newActivity.duration}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, duration: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newActivity.location}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, location: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organizer"
                value={newActivity.organizer}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, organizer: e.target.value })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={newActivity.credits}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    credits: parseInt(e.target.value) || 0,
                  })
                }
                disabled={userRole !== 'student'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {userRole === 'student' && (
            <Button onClick={handleSaveActivity} variant="contained">
              {selectedActivity ? 'Update' : 'Add'} Activity
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityTracker;
