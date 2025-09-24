import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Person,
  Assignment,
  Schedule,
  Star,
  Comment,
  Download,
  Upload,
} from '@mui/icons-material';

// Import services and hooks
import { useDataService } from '../../hooks/useDataService';

const FacultyPanel = ({ userRole }) => {
  const dataService = useDataService('FacultyPanel');
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    // Get data from centralized service
    const activitiesData = dataService.getAllActivities();
    const studentsData = dataService.getAllStudents();
    
    setActivities(activitiesData);
    setStudents(studentsData);
  }, []); // Remove dataService dependency to prevent infinite loop

  const pendingActivities = activities.filter(
    (activity) => activity.status === 'pending'
  );
  const approvedActivities = activities.filter(
    (activity) => activity.status === 'approved'
  );
  const rejectedActivities = activities.filter(
    (activity) => activity.status === 'rejected'
  );

  const handleOpenDialog = (activity) => {
    setSelectedActivity(activity);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedActivity(null);
    setApprovalComment('');
  };

  const handleApproveActivity = (activityId, comment = '') => {
    // Use dataService to approve activity
    const approvedActivity = dataService.approveActivity(activityId, 'Dr. Rajesh Kumar', comment);
    if (approvedActivity) {
      // Refresh activities from service
      const updatedActivities = dataService.getAllActivities();
      setActivities(updatedActivities);
    }
    handleCloseDialog();
  };

  const handleRejectActivity = (activityId, comment = '') => {
    // Use dataService to reject activity
    const rejectedActivity = dataService.rejectActivity(activityId, 'Dr. Rajesh Kumar', comment);
    if (rejectedActivity) {
      // Refresh activities from service
      const updatedActivities = dataService.getAllActivities();
      setActivities(updatedActivities);
    }
    handleCloseDialog();
  };

  const getStudentInfo = (studentId) => {
    return students.find((student) => student.id === studentId);
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

  const ActivityCard = ({ activity, showActions = true }) => {
    const student = getStudentInfo(activity.studentId);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Student Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={student?.profileImage}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle2">{student?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {student?.rollNumber} • {student?.department}
              </Typography>
            </Box>
            <Chip
              label={activity.status}
              color={getStatusColor(activity.status)}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>

          {/* Activity Info */}
          <Typography variant="h6" component="div" gutterBottom>
            {getTypeIcon(activity.type)} {activity.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {activity.category} • {activity.type}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {activity.description}
          </Typography>

          {/* Activity Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              📅 {activity.date} • ⏱️ {activity.duration}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📍 {activity.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🏢 {activity.organizer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ⭐ {activity.credits} credits
            </Typography>
          </Box>

          {/* Skills */}
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

          {/* Approval/Rejection Info */}
          {activity.status === 'approved' && activity.approvedBy && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Approved by {activity.approvedBy} on {activity.approvalDate}
              {activity.approvalComment && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Comment: {activity.approvalComment}
                </Typography>
              )}
            </Alert>
          )}
          {activity.status === 'rejected' && activity.rejectedBy && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Rejected by {activity.rejectedBy} on {activity.rejectionDate}
              {activity.rejectionComment && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Reason: {activity.rejectionComment}
                </Typography>
              )}
            </Alert>
          )}
        </CardContent>

        {showActions && (
          <CardActions>
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={() => handleOpenDialog(activity)}
            >
              View Details
            </Button>
            {activity.status === 'pending' && (
              <>
                <Button
                  size="small"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleApproveActivity(activity.id)}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleRejectActivity(activity.id)}
                >
                  Reject
                </Button>
              </>
            )}
          </CardActions>
        )}
      </Card>
    );
  };

  const getActivitiesByTab = () => {
    switch (tabValue) {
      case 0:
        return pendingActivities;
      case 1:
        return approvedActivities;
      case 2:
        return rejectedActivities;
      default:
        return activities;
    }
  };

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Faculty Approval Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve student activities and achievements
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(45deg, #ed6c02 30%, #ff9800 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{pendingActivities.length}</Typography>
                  <Typography variant="body2">Pending Review</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{approvedActivities.length}</Typography>
                  <Typography variant="body2">Approved</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Cancel sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{rejectedActivities.length}</Typography>
                  <Typography variant="body2">Rejected</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{activities.length}</Typography>
                  <Typography variant="body2">Total Activities</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab
              label={
                <Badge badgeContent={pendingActivities.length} color="warning">
                  Pending Review
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={approvedActivities.length} color="success">
                  Approved
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={rejectedActivities.length} color="error">
                  Rejected
                </Badge>
              }
            />
          </Tabs>
        </Box>
      </Paper>

      {/* Activities Grid */}
      <Grid container spacing={3}>
        {getActivitiesByTab().map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity.id}>
            <ActivityCard activity={activity} />
          </Grid>
        ))}
      </Grid>

      {getActivitiesByTab().length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No activities found in this category
          </Typography>
        </Paper>
      )}

      {/* Activity Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Activity Review - {selectedActivity?.title}
        </DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box>
              {/* Student Information */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={getStudentInfo(selectedActivity.studentId)?.profileImage}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {getStudentInfo(selectedActivity.studentId)?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getStudentInfo(selectedActivity.studentId)?.rollNumber} •{' '}
                      {getStudentInfo(selectedActivity.studentId)?.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      GPA: {getStudentInfo(selectedActivity.studentId)?.gpa} •
                      Year: {getStudentInfo(selectedActivity.studentId)?.year}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Activity Details */}
              <Typography variant="h6" gutterBottom>
                Activity Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Title</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.category}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Credits</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.credits}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Duration</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.duration}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Organizer</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedActivity.organizer}
                  </Typography>
                </Grid>
              </Grid>

              {/* Skills */}
              {selectedActivity.skills && selectedActivity.skills.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills Gained
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedActivity.skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Evidence */}
              {selectedActivity.evidence && selectedActivity.evidence.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Evidence/Documents
                  </Typography>
                  <List dense>
                    {selectedActivity.evidence.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar>
                            <Download />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={doc} />
                        <IconButton edge="end">
                          <Download />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Approval Comment */}
              {selectedActivity.status === 'pending' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Comments (Optional)"
                    multiline
                    rows={3}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add any comments or feedback for the student..."
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedActivity?.status === 'pending' && (
            <>
              <Button
                color="error"
                startIcon={<Cancel />}
                onClick={() =>
                  handleRejectActivity(selectedActivity.id, approvalComment)
                }
              >
                Reject
              </Button>
              <Button
                color="success"
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={() =>
                  handleApproveActivity(selectedActivity.id, approvalComment)
                }
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyPanel;
