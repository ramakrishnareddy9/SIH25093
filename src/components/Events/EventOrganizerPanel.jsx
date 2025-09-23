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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Fab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  People,
  Event,
  Verified,
  Download,
  PictureAsPdf,
  Image,
  Description,
  PersonAdd,
  Assignment,
} from '@mui/icons-material';

// Import services and hooks
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const EventOrganizerPanel = ({ userRole }) => {
  const { user } = useAuth();
  const dataService = useDataService('EventOrganizerPanel');
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [approvalComment, setApprovalComment] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    venue: '',
    capacity: '',
    fee: '',
  });

  // Registration data - would come from a registrations service in real implementation
  const [registrations, setRegistrations] = useState([]);

  // Get data from centralized service
  const events = dataService.getEventsByOrganizer(user?.name || '');
  const certificates = dataService.getCertificatesByStatus('pending');

  const handleApproveCertificate = (certificateId, comment = '') => {
    dataService.approveCertificate(certificateId, user?.name || 'Faculty', comment);
    setCertificateDialogOpen(false);
    setApprovalComment('');
  };

  const handleRejectCertificate = (certificateId, comment = '') => {
    dataService.rejectCertificate(certificateId, user?.name || 'Faculty', comment);
    setCertificateDialogOpen(false);
    setApprovalComment('');
  };

  const handleCreateEvent = () => {
    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      category: newEvent.category,
      organizer: {
        name: user?.name || 'Faculty Name',
        type: 'university',
        verificationStatus: 'verified',
        contactEmail: user?.email || 'faculty@university.edu',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        website: 'https://university.edu'
      },
      venue: {
        name: newEvent.venue,
        address: newEvent.venue,
        type: 'physical',
        capacity: parseInt(newEvent.capacity) || 100
      },
      dates: {
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString(),
        registrationDeadline: new Date(newEvent.startDate).toISOString()
      },
      fees: {
        student: parseInt(newEvent.fee) || 0,
        professional: parseInt(newEvent.fee) * 2 || 0,
        currency: 'INR'
      },
      tags: [newEvent.type, newEvent.category, 'University Event'],
      requirements: ['Valid student ID', 'Registration required'],
      benefits: [
        'Certificate of participation',
        'Networking opportunities',
        'Learning experience'
      ],
      maxParticipants: parseInt(newEvent.capacity) || 100,
      createdBy: user?.name || 'Faculty'
    };
    
    // Use data service to add event (this updates the centralized data)
    const createdEvent = dataService.addEvent(eventData);
    
    if (createdEvent) {
      setEventDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        venue: '',
        capacity: '',
        fee: '',
      });
      
      // Show success message
      alert(`Event "${createdEvent.title}" created successfully! All users (students, faculty, admin) can now view this event.`);
    }
  };

  const getEventRegistrations = (eventId) => {
    return registrations.filter(reg => reg.eventId === eventId);
  };

  const getRegisteredStudents = (eventId) => {
    const eventRegs = getEventRegistrations(eventId);
    return eventRegs.map(reg => {
      const student = dataService.getStudentById(reg.studentId);
      return { ...student, registrationDate: reg.registrationDate, status: reg.status };
    });
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

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return <PictureAsPdf color="error" />;
    if (fileType?.startsWith('image/')) return <Image color="primary" />;
    return <Description color="action" />;
  };

  const getStudentInfo = (studentId) => {
    return dataService.getStudentById(studentId);
  };

  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved');
  const rejectedCertificates = certificates.filter(cert => cert.status === 'rejected');
  const pendingCertificatesCount = pendingCertificates.length;

  // Event Management Tab
  const EventManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">My Events</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setEventDialogOpen(true)}
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => {
          const registeredCount = getEventRegistrations(event.id).length;
          return (
            <Grid item xs={12} md={6} key={event.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {event.title}
                    </Typography>
                    <Chip
                      label={event.status || 'open'}
                      color={event.status === 'open' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {event.type} • {event.category}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {event.description?.substring(0, 100)}...
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      📅 {new Date(event.dates?.startDate || event.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      👥 {registeredCount}/{event.venue?.capacity || event.maxParticipants || 100}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(event.tags || [event.type, event.category]).filter(Boolean).slice(0, 3).map((tag, index) => (
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
                  <Button 
                    size="small" 
                    startIcon={<People />}
                    onClick={() => {
                      setSelectedEvent(event);
                      setRegistrationDialogOpen(true);
                    }}
                  >
                    Registrations ({registeredCount})
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {events.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Create your first event to start managing participants and certificates
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setEventDialogOpen(true)}
            sx={{ mt: 2 }}
          >
            Create Event
          </Button>
        </Paper>
      )}
    </Box>
  );

  // Certificate Validation Tab
  const CertificateVerificationTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Certificate Verification
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Verify certificates for events you have organized
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
          Event management and certificate validation for faculty members
        </Typography>
        {pendingCertificatesCount > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            You have {pendingCertificatesCount} certificate(s) pending verification
          </Alert>
        )}
      </Paper>

      {/* Content */}
      <Paper className="content-section">
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
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
          <Tab icon={<Event />} label="My Events" />
          <Tab 
            icon={
              <Badge badgeContent={pendingCertificatesCount} color="error">
                <Verified />
              </Badge>
            } 
            label="Certificate Validation" 
          />
        </Tabs>

        {tabValue === 0 && <EventManagementTab />}
        {tabValue === 1 && <CertificateVerificationTab />}
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add event"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setEventDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Event Creation Dialog */}
      <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Event Title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline 
                rows={3} 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
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
                <Select 
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                >
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Start Date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="End Date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Venue" 
                value={newEvent.venue}
                onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Capacity" 
                type="number" 
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Registration Fee (INR)" 
                type="number" 
                value={newEvent.fee}
                onChange={(e) => setNewEvent({...newEvent, fee: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEvent}>Create Event</Button>
        </DialogActions>
      </Dialog>

      {/* Registration Management Dialog */}
      <Dialog open={registrationDialogOpen} onClose={() => setRegistrationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Event Registrations - {selectedEvent?.title}</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registered participants for this event
              </Typography>
              
              <List>
                {getRegisteredStudents(selectedEvent.id).map((student, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar src={student?.profileImage}>
                        {student?.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student?.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {student?.rollNumber} • {student?.department}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Registered: {new Date(student?.registrationDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={student?.status}
                      color={getStatusColor(student?.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>

              {getRegisteredStudents(selectedEvent.id).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No registrations yet for this event
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegistrationDialogOpen(false)}>Close</Button>
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

export default EventOrganizerPanel;
