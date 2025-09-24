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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Alert,
  Badge,
} from '@mui/material';
import {
  Add,
  Visibility,
  Download,
  CheckCircle,
  Cancel,
  Pending,
  PictureAsPdf,
  Image,
  Description,
  Delete,
  Edit,
  CloudUpload,
} from '@mui/icons-material';

// Import components and services
import CertificateUpload from './CertificateUpload';
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const CertificateManager = ({ userRole }) => {
  const { user } = useAuth();
  const dataService = useDataService('CertificateManager');
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    // Load certificates from service based on user role
    if (userRole === 'student') {
      const studentCerts = dataService.getCertificatesByStudent(user.studentId || user.id);
      setCertificates(studentCerts);
    } else {
      // Faculty and admin can see all certificates
      const allCertificates = dataService.getAllCertificates();
      setCertificates(allCertificates);
    }
  }, [userRole, user]); // Remove dataService dependency to prevent infinite loop

  useEffect(() => {
    // Apply tab filters
    let filtered = certificates;
    
    if (tabValue === 1) {
      filtered = certificates.filter(cert => cert.status === 'pending');
    } else if (tabValue === 2) {
      filtered = certificates.filter(cert => cert.status === 'approved');
    } else if (tabValue === 3) {
      filtered = certificates.filter(cert => cert.status === 'rejected');
    }

    setFilteredCertificates(filtered);
  }, [certificates, tabValue]);

  const handleUploadCertificate = (certificateData) => {
    setCertificates([certificateData, ...certificates]);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setViewDialogOpen(true);
  };

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
    setViewDialogOpen(false);
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
    setViewDialogOpen(false);
    setApprovalComment('');
  };

  const handleDeleteCertificate = (certificateId) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== certificateId);
    setCertificates(updatedCertificates);
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
    const studentsData = dataService.getAllStudents();
    return studentsData.find(student => student.id === studentId);
  };

  const CertificateCard = ({ certificate }) => {
    const student = getStudentInfo(certificate.studentId);
    
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          maxWidth: '100%',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Student info for faculty/admin view */}
          {userRole !== 'student' && student && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={student.profileImage}
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {student.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="caption" display="block">
                  {student.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {student.rollNumber}
                </Typography>
              </Box>
              <Chip
                label={certificate.status}
                color={getStatusColor(certificate.status)}
                size="small"
                sx={{ ml: 'auto' }}
              />
            </Box>
          )}

          {/* Certificate info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {getFileIcon(certificate.fileType)}
            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Typography variant="h6" component="div" noWrap>
                {certificate.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {certificate.issuer}
              </Typography>
            </Box>
            {userRole === 'student' && (
              <Chip
                label={certificate.status}
                color={getStatusColor(certificate.status)}
                size="small"
              />
            )}
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {certificate.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              📅 Issued: {new Date(certificate.issueDate).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              📄 {certificate.fileSize}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            ⬆️ Uploaded: {new Date(certificate.uploadDate).toLocaleDateString()}
          </Typography>

          {certificate.verificationCode && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              🔍 Code: {certificate.verificationCode}
            </Typography>
          )}

          {/* Approval/Rejection info */}
          {certificate.status === 'approved' && certificate.approvedBy && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="caption">
                Approved by {certificate.approvedBy}
                {certificate.approvalComment && (
                  <><br />"{certificate.approvalComment}"</>
                )}
              </Typography>
            </Alert>
          )}

          {certificate.status === 'rejected' && certificate.rejectedBy && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="caption">
                Rejected by {certificate.rejectedBy}
                {certificate.rejectionComment && (
                  <><br />"{certificate.rejectionComment}"</>
                )}
              </Typography>
            </Alert>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            startIcon={<Visibility />}
            onClick={() => handleViewCertificate(certificate)}
          >
            View
          </Button>
          <Button
            size="small"
            startIcon={<Download />}
            onClick={() => window.open(certificate.fileUrl, '_blank')}
          >
            Download
          </Button>
          
          {userRole !== 'student' && certificate.status === 'pending' && (
            <>
              <Button
                size="small"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleApproveCertificate(certificate.id)}
              >
                Approve
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleRejectCertificate(certificate.id)}
              >
                Reject
              </Button>
            </>
          )}

          {userRole === 'student' && certificate.status === 'pending' && (
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleDeleteCertificate(certificate.id)}
            >
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  const pendingCount = certificates.filter(cert => cert.status === 'pending').length;
  const approvedCount = certificates.filter(cert => cert.status === 'approved').length;
  const rejectedCount = certificates.filter(cert => cert.status === 'rejected').length;

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Certificate Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === 'student' 
            ? 'Upload and manage your certificates and achievements'
            : 'Review and approve student certificates'
          }
        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper className="content-section">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Certificates" />
            <Tab 
              label={
                <Badge badgeContent={pendingCount} color="warning">
                  Pending
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={approvedCount} color="success">
                  Approved
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={rejectedCount} color="error">
                  Rejected
                </Badge>
              } 
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredCertificates.length} certificates found
          </Typography>
        </Box>
      </Paper>

      {/* Certificates Grid */}
      <Box sx={{ px: 1 }}>
        <Grid container spacing={3}>
          {filteredCertificates.map((certificate) => (
            <Grid item xs={12} sm={6} md={4} key={certificate.id}>
              <CertificateCard certificate={certificate} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {filteredCertificates.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No certificates found
          </Typography>
          {userRole === 'student' && (
            <Typography variant="body2" color="text.secondary">
              Upload your first certificate to get started!
            </Typography>
          )}
        </Paper>
      )}

      {/* Upload FAB for students */}
      {userRole === 'student' && (
        <Fab
          color="primary"
          aria-label="upload certificate"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setUploadDialogOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Upload Dialog */}
      <CertificateUpload
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUploadCertificate}
      />

      {/* View Certificate Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Certificate Details
        </DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Title</Typography>
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
                  <Typography variant="subtitle2">File Size</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedCertificate.fileSize}
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

              {/* Faculty approval section */}
              {userRole !== 'student' && selectedCertificate.status === 'pending' && (
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Comments (Optional)"
                    multiline
                    rows={3}
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    placeholder="Add any comments or feedback..."
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            startIcon={<Download />}
            onClick={() => window.open(selectedCertificate?.fileUrl, '_blank')}
          >
            Download
          </Button>
          {userRole !== 'student' && selectedCertificate?.status === 'pending' && (
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
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificateManager;
