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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Alert,
  Badge,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Upload,
  PictureAsPdf,
  Image,
  Description,
} from '@mui/icons-material';

// Import data
import eventsData from '../../data/events.json';
import certificatesData from '../../data/certificates.json';
import studentsData from '../../data/students.json';
import { useAuth } from '../../context/AuthContext';

const EventOrganizerPanel = ({ userRole }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  // Mock organizer data - in real app, this would come from user profile
  const organizerInfo = {
    id: 'ORG001',
    name: user?.role === 'faculty' ? 'Academic Institution' : 'Tech Corporation',
    type: user?.role === 'faculty' ? 'university' : 'company',
    verificationStatus: 'verified',
    contactEmail: user?.email || 'contact@organization.com',
    website: 'https://organization.com'
  };

  useEffect(() => {
    // Filter events by organizer (mock - in real app, filter by actual organizer ID)
    const organizerEvents = eventsData.filter(event => 
      event.organizer.type === organizerInfo.type
    );
    setEvents(organizerEvents);

    // Filter certificates that need verification from this organizer
    const organizerCertificates = certificatesData.filter(cert => {
      // Find the related activity/event
      const relatedEvent = eventsData.find(event => 
        cert.title.toLowerCase().includes(event.title.toLowerCase().split(' ')[0]) ||
        cert.issuer === event.organizer.name
      );
      return relatedEvent && relatedEvent.organizer.type === organizerInfo.type;
    });
    setCertificates(organizerCertificates);
  }, [organizerInfo.type]);

  const handleApproveCertificate = (certificateId, comment = '') => {
    const updatedCertificates = certificates.map(cert =>
      cert.id === certificateId
        ? {
            ...cert,
            status: 'approved',
            approvedBy: user.name,
            approvalDate: new Date().toISOString(),
            approvalComment: comment,
          }
        : cert
    );
    setCertificates(updatedCertificates);
    setCertificateDialogOpen(false);
    setApprovalComment('');
  };

  const handleRejectCertificate = (certificateId, comment = '') => {
    const updatedCertificates = certificates.map(cert =>
      cert.id === certificateId
        ? {
            ...cert,
            status: 'rejected',
            rejectedBy: user.name,
            rejectionDate: new Date().toISOString(),
            rejectionComment: comment,
          }
        : cert
    );
    setCertificates(updatedCertificates);
    setCertificateDialogOpen(false);
    setApprovalComment('');
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
    if (fileType === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    } else if (fileType?.startsWith('image/')) {
      return <Image color="primary" />;
    }
    return <Description color="action" />;
  };

  const getStudentInfo = (studentId) => {
    return studentsData.find(student => student.id === studentId);
  };

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
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {event.title}
                  </Typography>
                  <Chip
                    label={event.status}
                    color={event.status === 'open' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

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
                    👥 {event.registrationCount}/{event.maxParticipants}
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

  const CertificateVerificationTab = () => {
    const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
    const approvedCertificates = certificates.filter(cert => cert.status === 'approved');
    const rejectedCertificates = certificates.filter(cert => cert.status === 'rejected');

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Certificate Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Verify certificates issued by your organization for events and activities
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h4">{pendingCertificates.length}</Typography>
                <Typography variant="body2">Pending Verification</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h4">{approvedCertificates.length}</Typography>
                <Typography variant="body2">Verified</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
              <CardContent>
                <Typography variant="h4">{rejectedCertificates.length}</Typography>
                <Typography variant="body2">Rejected</Typography>
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
                        <Avatar
                          src={student?.profileImage}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {student?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{student?.name}</Typography>
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
                          <Typography variant="body2">{certificate.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {certificate.fileSize}
                          </Typography>
                        </Box>
                      </Box>
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
                      {certificate.status === 'pending' && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproveCertificate(certificate.id)}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectCertificate(certificate.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
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
              No certificates to verify
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Certificates from your events will appear here for verification
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  const pendingCertificatesCount = certificates.filter(cert => cert.status === 'pending').length;

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
            {organizerInfo.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
              {organizerInfo.name}
              <Verified color="primary" sx={{ ml: 1 }} />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Event Organizer Panel - {organizerInfo.type}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage your events and verify certificates issued to participants
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Badge badgeContent={events.length} color="primary">
                  My Events
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={pendingCertificatesCount} color="warning">
                  Certificate Verification
                </Badge>
              } 
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <EventManagementTab />}
          {tabValue === 1 && <CertificateVerificationTab />}
        </Box>
      </Paper>

      {/* Create Event Dialog */}
      <Dialog
        open={eventDialogOpen}
        onClose={() => setEventDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            This is a demo interface. In a real application, you would have a comprehensive event creation form here.
          </Alert>
          <Typography variant="body2">
            Event creation form would include fields for:
          </Typography>
          <List dense>
            <ListItem>• Event title and description</ListItem>
            <ListItem>• Event type and category</ListItem>
            <ListItem>• Dates and venue information</ListItem>
            <ListItem>• Registration fees and requirements</ListItem>
            <ListItem>• Benefits and agenda</ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create Event</Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Verification Dialog */}
      <Dialog
        open={certificateDialogOpen}
        onClose={() => setCertificateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Certificate Verification</DialogTitle>
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
                  <Typography variant="body2" gutterBottom>
                    {selectedCertificate.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Issuer</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedCertificate.issuer}
                  </Typography>
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
                  <Typography variant="body2" gutterBottom>
                    {selectedCertificate.description}
                  </Typography>
                </Grid>
                {selectedCertificate.verificationCode && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Verification Code</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedCertificate.verificationCode}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* Verification Comments */}
              {selectedCertificate.status === 'pending' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Verification Comments (Optional)"
                    multiline
                    rows={3}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add any comments about the certificate verification..."
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
                Verify & Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventOrganizerPanel;
