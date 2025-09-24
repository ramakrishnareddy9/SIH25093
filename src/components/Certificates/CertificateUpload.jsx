import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PictureAsPdf,
  Image,
  Description,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const CertificateUpload = ({ open, onClose, onUpload, activityId = null }) => {
  const { user } = useAuth();
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    issuer: '',
    issueDate: '',
    verificationCode: '',
    activityId: activityId,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setUploadData({
      ...uploadData,
      [field]: value,
    });
    if (error) setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload PDF, JPEG, PNG, or WebP files only');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    } else if (fileType.startsWith('image/')) {
      return <Image color="primary" />;
    }
    return <Description color="action" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateForm = () => {
    if (!uploadData.title.trim()) {
      setError('Certificate title is required');
      return false;
    }
    if (!uploadData.issuer.trim()) {
      setError('Issuer name is required');
      return false;
    }
    if (!uploadData.issueDate) {
      setError('Issue date is required');
      return false;
    }
    if (!selectedFile) {
      setError('Please select a certificate file to upload');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    setError('');

    try {
      // Simulate file upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const certificateData = {
        id: `CERT${String(Date.now()).slice(-3)}`,
        studentId: user.studentId || user.id,
        activityId: uploadData.activityId,
        title: uploadData.title,
        fileName: selectedFile.name,
        fileSize: formatFileSize(selectedFile.size),
        fileType: selectedFile.type,
        uploadDate: new Date().toISOString(),
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        approvalComment: null,
        description: uploadData.description,
        issuer: uploadData.issuer,
        issueDate: uploadData.issueDate,
        verificationCode: uploadData.verificationCode,
        thumbnailUrl: `/certificates/thumbnails/${selectedFile.name}_thumb.jpg`,
        fileUrl: `/certificates/${selectedFile.name}`,
      };

      onUpload(certificateData);
      handleClose();
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setUploadData({
      title: '',
      description: '',
      issuer: '',
      issueDate: '',
      verificationCode: '',
      activityId: activityId,
    });
    setSelectedFile(null);
    setError('');
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Upload Certificate</Typography>
          <IconButton onClick={handleClose} disabled={uploading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* File Upload Area */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: dragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />

              {!selectedFile ? (
                <>
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drop your certificate here or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supports PDF, JPEG, PNG, WebP (Max 10MB)
                  </Typography>
                </>
              ) : (
                <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getFileIcon(selectedFile.type)}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(selectedFile.size)}
                        </Typography>
                      </Box>
                      <IconButton onClick={removeFile} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>

          {/* Certificate Details */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Certificate Title"
              value={uploadData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={uploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issuing Organization"
              value={uploadData.issuer}
              onChange={(e) => handleInputChange('issuer', e.target.value)}
              required
              disabled={uploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Issue Date"
              type="date"
              value={uploadData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              disabled={uploading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Verification Code (Optional)"
              value={uploadData.verificationCode}
              onChange={(e) => handleInputChange('verificationCode', e.target.value)}
              disabled={uploading}
              helperText="Certificate ID or verification number"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={uploadData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={uploading}
              helperText="Brief description of the certificate or achievement"
            />
          </Grid>

          {activityId && (
            <Grid item xs={12}>
              <Alert severity="info">
                This certificate will be linked to your selected activity.
              </Alert>
            </Grid>
          )}
        </Grid>

        {uploading && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Uploading certificate...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedFile || uploading}
          startIcon={<CloudUpload />}
        >
          {uploading ? 'Uploading...' : 'Upload Certificate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateUpload;
