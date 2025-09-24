import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  School,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, determineRoleFromEmail } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedRole, setDetectedRole] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Detect role from email
    if (name === 'email' && value) {
      const role = determineRoleFromEmail(value);
      setDetectedRole(role);
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await signup(formData);
      
      if (result.success) {
        // Navigate to app dashboard after successful signup
        navigate('/app/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'student':
        return {
          icon: <Person />,
          label: 'Student Account',
          description: 'Access student dashboard, manage activities, and generate portfolios',
          color: 'primary'
        };
      case 'faculty':
        return {
          icon: <School />,
          label: 'Faculty Account',
          description: 'Review student activities, approve submissions, and access analytics',
          color: 'secondary'
        };
      case 'admin':
        return {
          icon: <AdminPanelSettings />,
          label: 'Admin Account',
          description: 'Full system access, user management, and comprehensive analytics',
          color: 'success'
        };
      default:
        return {
          icon: <Person />,
          label: 'User Account',
          description: 'Standard user access',
          color: 'default'
        };
    }
  };

  const roleInfo = detectedRole ? getRoleInfo(detectedRole) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Grid container maxWidth="lg" spacing={4} alignItems="center">
        {/* Left Side - Welcome Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <School sx={{ fontSize: 48, mr: 2 }} />
              <Typography variant="h3" fontWeight="bold">
                Join Smart Student Hub
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
              Create Your Account Today
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 500 }}>
              Join thousands of students and faculty members who are already using Smart Student Hub 
              to manage their academic journey and achievements.
            </Typography>
            
            {/* Email Domain Guide */}
            <Paper sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                Email Domain Guide
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Students:</strong> Use @student.college.edu
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <School sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Faculty:</strong> Use @faculty.college.edu
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <AdminPanelSettings sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Admin:</strong> Use @admin.college.edu
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Right Side - Signup Form */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              maxWidth: 450,
              mx: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                Fill in your details to get started
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {roleInfo && (
                <Alert 
                  severity="info" 
                  sx={{ mb: 3 }}
                  icon={roleInfo.icon}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {roleInfo.label} Detected
                  </Typography>
                  <Typography variant="body2">
                    {roleInfo.description}
                  </Typography>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  helperText="Use your institutional email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  helperText="Minimum 6 characters"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                    },
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Typography variant="body2" textAlign="center">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
