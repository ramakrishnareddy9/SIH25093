import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ActivityTracker from './components/Activities/ActivityTracker';
import FacultyPanel from './components/Faculty/FacultyPanel';
import Portfolio from './components/Portfolio/Portfolio';
import Analytics from './components/Analytics/Analytics';
import Profile from './components/Profile/Profile';

// Events Components
import EventDiscovery from './components/Events/EventDiscovery';
import EventOrganizerPanel from './components/Events/EventOrganizerPanel';

// Certificates Components
import CertificateManager from './components/Certificates/CertificateManager';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Landing Page
import LandingPage from './components/Landing/LandingPage';

// Enhanced Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    '0px 20px 40px rgba(0,0,0,0.18)',
    '0px 24px 48px rgba(0,0,0,0.2)',
    '0px 28px 56px rgba(0,0,0,0.22)',
    '0px 32px 64px rgba(0,0,0,0.25)',
    '0px 36px 72px rgba(0,0,0,0.28)',
    '0px 40px 80px rgba(0,0,0,0.3)',
    '0px 44px 88px rgba(0,0,0,0.32)',
    '0px 48px 96px rgba(0,0,0,0.35)',
    '0px 52px 104px rgba(0,0,0,0.38)',
    '0px 56px 112px rgba(0,0,0,0.4)',
    '0px 60px 120px rgba(0,0,0,0.42)',
    '0px 64px 128px rgba(0,0,0,0.45)',
    '0px 68px 136px rgba(0,0,0,0.48)',
    '0px 72px 144px rgba(0,0,0,0.5)',
    '0px 76px 152px rgba(0,0,0,0.52)',
    '0px 80px 160px rgba(0,0,0,0.55)',
    '0px 84px 168px rgba(0,0,0,0.58)',
    '0px 88px 176px rgba(0,0,0,0.6)',
    '0px 92px 184px rgba(0,0,0,0.62)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          margin: '0 4px',
        },
      },
    },
  },
});

// Main App Layout Component
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar 
        toggleSidebar={toggleSidebar} 
        userRole={user?.role}
      />
      <Sidebar 
        open={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        userRole={user?.role}
      />
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          mt: 8,
          ml: sidebarOpen ? '270px' : '90px',
          mr: 3,
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 64px)',
          maxWidth: 'calc(100vw - 290px)',
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="activities" 
            element={
              <ProtectedRoute>
                <ActivityTracker userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="events" 
            element={
              <ProtectedRoute>
                <EventDiscovery userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="certificates" 
            element={
              <ProtectedRoute>
                <CertificateManager userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="organizer" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <EventOrganizerPanel userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="faculty" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <FacultyPanel userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="portfolio" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Portfolio userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <Analytics userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/app/*" element={<AppLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
