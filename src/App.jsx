import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import modern utility styles
import './styles/modern-utils.css';

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
import EventDiscovery from './components/Events/EventDiscovery';
import EventOrganizerPanel from './components/Events/EventOrganizerPanel';
import ComprehensiveFacultyPanel from './components/Faculty/ComprehensiveFacultyPanel';
import CertificateManager from './components/Certificates/CertificateManager';
import Settings from './components/Settings/Settings';
import AdminPanel from './components/Admin/AdminPanel';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Landing Page
import LandingPage from './components/Landing/LandingPage';


// Modern Enhanced Theme Configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8fa5f3',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9575cd',
      dark: '#5e35b1',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          fontSize: '0.95rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            transform: 'translateY(-3px) scale(1.02)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#667eea',
          color: '#667eea',
          '&:hover': {
            borderColor: '#5a6fd8',
            backgroundColor: 'rgba(102, 126, 234, 0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 600,
          fontSize: '0.875rem',
          height: 36,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        filled: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#667eea',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          margin: '0 8px',
          minHeight: 48,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.08)',
            transform: 'translateY(-2px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.08)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderLeft: '4px solid #667eea',
          },
        },
      },
    },
  },
});

// Add custom theme extensions
theme.shadows = [
  'none',
  '0 2px 4px rgba(102, 126, 234, 0.05)',
  '0 4px 8px rgba(102, 126, 234, 0.08)',
  '0 8px 16px rgba(102, 126, 234, 0.1)',
  '0 12px 24px rgba(102, 126, 234, 0.12)',
  '0 16px 32px rgba(102, 126, 234, 0.15)',
  '0 20px 40px rgba(102, 126, 234, 0.18)',
  '0 24px 48px rgba(102, 126, 234, 0.2)',
  '0 28px 56px rgba(102, 126, 234, 0.22)',
  '0 32px 64px rgba(102, 126, 234, 0.25)',
  '0 36px 72px rgba(102, 126, 234, 0.28)',
  '0 40px 80px rgba(102, 126, 234, 0.3)',
  '0 44px 88px rgba(102, 126, 234, 0.32)',
  '0 48px 96px rgba(102, 126, 234, 0.35)',
  '0 52px 104px rgba(102, 126, 234, 0.38)',
  '0 56px 112px rgba(102, 126, 234, 0.4)',
  '0 60px 120px rgba(102, 126, 234, 0.42)',
  '0 64px 128px rgba(102, 126, 234, 0.45)',
  '0 68px 136px rgba(102, 126, 234, 0.48)',
  '0 72px 144px rgba(102, 126, 234, 0.5)',
  '0 76px 152px rgba(102, 126, 234, 0.52)',
  '0 80px 160px rgba(102, 126, 234, 0.55)',
  '0 84px 168px rgba(102, 126, 234, 0.58)',
  '0 88px 176px rgba(102, 126, 234, 0.6)',
  '0 92px 184px rgba(102, 126, 234, 0.62)',
];

// Route wrapper components to access user context
const DashboardRoute = () => {
  const { user } = useAuth();
  // All users get their respective dashboards, admin panel is separate
  return <Dashboard userRole={user?.role} />;
};

const ProfileRoute = () => {
  const { user } = useAuth();
  return <Profile userRole={user?.role} />;
};

const ActivitiesRoute = () => {
  const { user } = useAuth();
  return <ActivityTracker userRole={user?.role} />;
};

const EventsRoute = () => {
  const { user } = useAuth();
  return <EventDiscovery userRole={user?.role} />;
};

const CertificatesRoute = () => {
  const { user } = useAuth();
  return <CertificateManager userRole={user?.role} />;
};

const PortfolioRoute = () => {
  const { user } = useAuth();
  return <Portfolio userRole={user?.role} />;
};

const FacultyPanelRoute = () => {
  const { user } = useAuth();
  return <EventOrganizerPanel userRole={user?.role} />;
};

const SettingsRoute = () => {
  const { user } = useAuth();
  return <Settings userRole={user?.role} />;
};

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
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          p: 0,
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
                <ComprehensiveFacultyPanel userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="faculty" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <EventOrganizerPanel userRole={user?.role} />
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
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <Settings userRole={user?.role} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
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
            <Route path="/app/*" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
