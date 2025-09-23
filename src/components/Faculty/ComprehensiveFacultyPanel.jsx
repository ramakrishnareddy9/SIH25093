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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Add,
  Edit,
  Delete,
  Event,
  Verified,
  People,
  PictureAsPdf,
  Image,
  Description,
} from '@mui/icons-material';

// Import services and hooks
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const ComprehensiveFacultyPanel = ({ userRole }) => {
  const { user } = useAuth();
  const dataService = useDataService('ComprehensiveFacultyPanel');
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    // Get data from centralized service
    const activitiesData = dataService.getAllActivities();
    const studentsData = dataService.getAllStudents();
    const eventsData = dataService.getAllEvents();
    const certificatesData = dataService.getAllCertificates();
    
    setActivities(activitiesData);
    setStudents(studentsData);
    setEvents(eventsData);
    
    // Filter certificates for this faculty
    const facultyCertificates = certificatesData.filter(cert => {
      const relatedEvent = eventsData.find(event => 
        cert.title.toLowerCase().includes(event.title.toLowerCase().split(' ')[0]) ||
        cert.issuer === event.organizer.name
      );
      return relatedEvent && (
        cert.issuer.toLowerCase().includes('university') ||
        cert.issuer.toLowerCase().includes('academic') ||
        cert.approvedBy === user?.name
      );
    });
    setCertificates(facultyCertificates);
  }, [user]); // Remove dataService dependency to prevent infinite loop

  const pendingActivities = activities.filter(activity => activity.status === 'pending');
  const approvedActivities = activities.filter(activity => activity.status === 'approved');
  const rejectedActivities = activities.filter(activity => activity.status === 'rejected');
  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Activity Management Functions
  const handleApproveActivity = (activityId, comment = '') => {
    // Use dataService to approve activity
    const approvedActivity = dataService.approveActivity(activityId, user?.name || 'Dr. Faculty', comment);
    if (approvedActivity) {
      // Refresh activities from service
      const updatedActivities = dataService.getAllActivities();
      setActivities(updatedActivities);
    }
    setActivityDialogOpen(false);
    setApprovalComment('');
  };

  const handleRejectActivity = (activityId, comment = '') => {
    // Use dataService to reject activity
    const rejectedActivity = dataService.rejectActivity(activityId, user?.name || 'Dr. Faculty', comment);
    if (rejectedActivity) {
      // Refresh activities from service
      const updatedActivities = dataService.getAllActivities();
      setActivities(updatedActivities);
    }
    setActivityDialogOpen(false);
    setApprovalComment('');
  };

  // Certificate Management Functions
  const handleApproveCertificate = (certificateId, comment = '') => {
    // Use dataService to approve certificate
    const approvedCertificate = dataService.approveCertificate(certificateId, user?.name || 'Dr. Faculty', comment);
    if (approvedCertificate) {
      // Refresh certificates from service
      const updatedCertificates = dataService.getAllCertificates();
      // Re-filter for faculty certificates
      const facultyCertificates = updatedCertificates.filter(cert => {
        const eventsData = dataService.getAllEvents();
        const relatedEvent = eventsData.find(event => 
          cert.title.toLowerCase().includes(event.title.toLowerCase().split(' ')[0]) ||
          cert.issuer === event.organizer.name
        );
        return relatedEvent && (
          cert.issuer.toLowerCase().includes('university') ||
          cert.issuer.toLowerCase().includes('academic') ||
          cert.approvedBy === user?.name
        );
      });
      setCertificates(facultyCertificates);
    }
    setCertificateDialogOpen(false);
    setApprovalComment('');
  };

  const handleRejectCertificate = (certificateId, comment = '') => {
    // Use dataService to reject certificate
    const rejectedCertificate = dataService.rejectCertificate(certificateId, user?.name || 'Dr. Faculty', comment);
    if (rejectedCertificate) {
      // Refresh certificates from service
      const updatedCertificates = dataService.getAllCertificates();
      // Re-filter for faculty certificates
      const facultyCertificates = updatedCertificates.filter(cert => {
        const eventsData = dataService.getAllEvents();
        const relatedEvent = eventsData.find(event => 
          cert.title.toLowerCase().includes(event.title.toLowerCase().split(' ')[0]) ||
          cert.issuer === event.organizer.name
        );
        return relatedEvent && (
          cert.issuer.toLowerCase().includes('university') ||
          cert.issuer.toLowerCase().includes('academic') ||
          cert.approvedBy === user?.name
        );
      });
      setCertificates(facultyCertificates);
    }
    setCertificateDialogOpen(false);
    setApprovalComment('');
  };

  // Utility Functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <PictureAsPdf color="error" />;
    if (fileType?.startsWith('image/')) return <Image color="primary" />;
    return <Description color="action" />;
  };

  const getStudentInfo = (studentId) => {
    return studentsData.find(student => student.id === studentId);
  };

  // Activity Review Tab
  const ActivityReviewTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Student Activity Reviews</Typography>
        <Typography variant="body2" color="text.secondary">
          {pendingActivities.length} activities pending review
        </Typography>
      </Box>

      {/* Activity Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {pendingActivities.length}
              </Typography>
              <Typography color="text.secondary">Pending Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {approvedActivities.length}
              </Typography>
              <Typography color="text.secondary">Approved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {rejectedActivities.length}
              </Typography>
              <Typography color="text.secondary">Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activities List */}
      <Grid container spacing={2}>
        {pendingActivities.map((activity) => {
          const student = getStudentInfo(activity.studentId);
          return (
            <Grid item xs={12} md={6} key={activity.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={student?.profileImage} sx={{ mr: 2 }}>
                      {student?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{activity.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student?.name} • {student?.rollNumber}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {activity.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong> {activity.date}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Credits:</strong> {activity.credits}
                  </Typography>
                  
                  <Chip
                    label={activity.status}
                    color={getStatusColor(activity.status)}
                    size="small"
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setActivityDialogOpen(true);
                    }}
                  >
                    Review
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {pendingActivities.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No pending activities to review
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All student activities have been reviewed
          </Typography>
        </Paper>
      )}
    </Box>
  );

  // Event Management Tab
  const EventManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Event Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setEventDialogOpen(true)}
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {events.slice(0, 6).map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.type} • {event.category}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {event.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    📅 {new Date(event.dates.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    👥 {event.venue.capacity} capacity
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Visibility />}>
                  View Details
                </Button>
                <Button size="small" startIcon={<Edit />}>
                  Edit
                </Button>
                <Button size="small" startIcon={<People />}>
                  Participants
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Certificate Validation Tab
  const CertificateValidationTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Certificate Validation
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Verify certificates from events you have organized
      </Typography>

      {/* Certificate Statistics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {pendingCertificates.length}
              </Typography>
              <Typography color="text.secondary">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {approvedCertificates.length}
              </Typography>
              <Typography color="text.secondary">Approved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {certificates.length}
              </Typography>
              <Typography color="text.secondary">Total</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Certificates Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Certificate</TableCell>
              <TableCell>Issuer</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((certificate) => {
              const student = getStudentInfo(certificate.studentId);
              return (
                <TableRow key={certificate.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={student?.profileImage} sx={{ width: 32, height: 32, mr: 2 }}>
                        {student?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {student?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student?.rollNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getFileIcon(certificate.fileType)}
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {certificate.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {certificate.fileSize}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{certificate.issuer}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(certificate.uploadDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={certificate.status}
                      color={getStatusColor(certificate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedCertificate(certificate);
                        setCertificateDialogOpen(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => window.open(certificate.fileUrl, '_blank')}
                    >
                      <Download />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {certificates.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No certificates to validate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Certificates from your events will appear here for validation
          </Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Faculty Panel
        </Typography>
        <Typography variant="body1">
          Comprehensive faculty management dashboard for activities, events, and certificates
        </Typography>
        {(pendingActivities.length > 0 || pendingCertificates.length > 0) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You have {pendingActivities.length} activities and {pendingCertificates.length} certificates pending review
          </Alert>
        )}
      </Paper>

      {/* Content */}
      <Paper className="content-section">
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
          <Tab 
            icon={
              <Badge badgeContent={pendingActivities.length} color="error">
                <Assignment />
              </Badge>
            } 
            label="Activity Reviews" 
          />
          <Tab icon={<Event />} label="Event Management" />
          <Tab 
            icon={
              <Badge badgeContent={pendingCertificates.length} color="error">
                <Verified />
              </Badge>
            } 
            label="Certificate Validation" 
          />
        </Tabs>

        {tabValue === 0 && <ActivityReviewTab />}
        {tabValue === 1 && <EventManagementTab />}
        {tabValue === 2 && <CertificateValidationTab />}
      </Paper>

      {/* Activity Review Dialog */}
      <Dialog open={activityDialogOpen} onClose={() => setActivityDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Activity</DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Activity Title</Typography>
                  <Typography variant="body2" gutterBottom>{selectedActivity.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography variant="body2" gutterBottom>{selectedActivity.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Date</Typography>
                  <Typography variant="body2" gutterBottom>{selectedActivity.date}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Credits</Typography>
                  <Typography variant="body2" gutterBottom>{selectedActivity.credits}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2" gutterBottom>{selectedActivity.description}</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Review Comments (Optional)"
                  multiline
                  rows={3}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Add any comments about this activity..."
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleRejectActivity(selectedActivity?.id, approvalComment)}
          >
            Reject
          </Button>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={() => handleApproveActivity(selectedActivity?.id, approvalComment)}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Creation Dialog */}
      <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Event creation interface - Faculty can create and manage events
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Event Title" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="seminar">Seminar</MenuItem>
                  <MenuItem value="competition">Competition</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select defaultValue="">
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Venue" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Capacity" type="number" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Registration Fee" type="number" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Event</Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Validation Dialog */}
      <Dialog open={certificateDialogOpen} onClose={() => setCertificateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Certificate Validation</DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Box>
              {/* Student Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={getStudentInfo(selectedCertificate.studentId)?.profileImage}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {getStudentInfo(selectedCertificate.studentId)?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {getStudentInfo(selectedCertificate.studentId)?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getStudentInfo(selectedCertificate.studentId)?.rollNumber} • {getStudentInfo(selectedCertificate.studentId)?.department}
                  </Typography>
                </Box>
              </Box>

              {/* Certificate Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Certificate Title</Typography>
                  <Typography variant="body2" gutterBottom>{selectedCertificate.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Issuer</Typography>
                  <Typography variant="body2" gutterBottom>{selectedCertificate.issuer}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Issue Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Upload Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(selectedCertificate.uploadDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body2" gutterBottom>{selectedCertificate.description}</Typography>
                </Grid>
                {selectedCertificate.verificationCode && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Verification Code</Typography>
                    <Typography variant="body2" gutterBottom>{selectedCertificate.verificationCode}</Typography>
                  </Grid>
                )}
              </Grid>

              {/* Validation Comments */}
              {selectedCertificate.status === 'pending' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Validation Comments (Optional)"
                    multiline
                    rows={3}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add any comments about the certificate validation..."
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificateDialogOpen(false)}>Close</Button>
          <Button
            startIcon={<Download />}
            onClick={() => window.open(selectedCertificate?.fileUrl, '_blank')}
          >
            Download
          </Button>
          {selectedCertificate?.status === 'pending' && (
            <>
              <Button
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleRejectCertificate(selectedCertificate.id, approvalComment)}
              >
                Reject
              </Button>
              <Button
                color="success"
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={() => handleApproveCertificate(selectedCertificate.id, approvalComment)}
              >
                Validate & Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComprehensiveFacultyPanel;
