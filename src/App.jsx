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


// Harmonious Enhanced Theme Configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff8787',
      dark: '#ff5252',
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
      main: '#ff6b6b',
      light: '#ff8787',
      dark: '#ff5252',
    },
    info: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    background: {
      default: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
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
    '0 1px 2px 0 rgba(37, 99, 235, 0.05)',
    '0 2px 4px 0 rgba(37, 99, 235, 0.06)',
    '0 4px 6px -1px rgba(37, 99, 235, 0.08)',
    '0 6px 8px -1px rgba(37, 99, 235, 0.1)',
    '0 10px 15px -3px rgba(37, 99, 235, 0.1)',
    '0 12px 20px -3px rgba(37, 99, 235, 0.12)',
    '0 16px 25px -5px rgba(37, 99, 235, 0.15)',
    '0 20px 30px -5px rgba(37, 99, 235, 0.18)',
    '0 25px 35px -5px rgba(37, 99, 235, 0.2)',
    '0 30px 40px -5px rgba(37, 99, 235, 0.22)',
    '0 35px 45px -5px rgba(37, 99, 235, 0.25)',
    '0 40px 50px -5px rgba(37, 99, 235, 0.28)',
    '0 45px 55px -5px rgba(37, 99, 235, 0.3)',
    '0 50px 60px -5px rgba(37, 99, 235, 0.32)',
    '0 55px 65px -5px rgba(37, 99, 235, 0.35)',
    '0 60px 70px -5px rgba(37, 99, 235, 0.38)',
    '0 65px 75px -5px rgba(37, 99, 235, 0.4)',
    '0 70px 80px -5px rgba(37, 99, 235, 0.42)',
    '0 75px 85px -5px rgba(37, 99, 235, 0.45)',
    '0 80px 90px -5px rgba(37, 99, 235, 0.48)',
    '0 85px 95px -5px rgba(37, 99, 235, 0.5)',
    '0 90px 100px -5px rgba(37, 99, 235, 0.52)',
    '0 95px 105px -5px rgba(37, 99, 235, 0.55)',
    '0 100px 110px -5px rgba(37, 99, 235, 0.58)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
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
          background: 'linear-gradient(135deg, #2563eb 0%, #ff6b6b 100%)',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #ff5252 100%)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.35)',
            transform: 'translateY(-2px) scale(1.01)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#2563eb',
          color: '#2563eb',
          '&:hover': {
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            transform: 'translateY(-1px)',
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
          border: '1px solid rgba(37, 99, 235, 0.1)',
          boxShadow: '0 4px 20px rgba(100, 116, 139, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #2563eb, #ff6b6b)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            transform: 'translateY(-6px) scale(1.01)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
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
          border: '1px solid rgba(37, 99, 235, 0.1)',
          boxShadow: '0 4px 20px rgba(100, 116, 139, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.12)',
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
          background: 'linear-gradient(135deg, #2563eb 0%, #ff6b6b 100%)',
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
                borderColor: '#2563eb',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 1)',
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563eb',
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
          border: '1px solid rgba(37, 99, 235, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
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
            background: 'rgba(37, 99, 235, 0.08)',
            transform: 'translateY(-1px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #2563eb 0%, #ff6b6b 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
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
            background: 'rgba(37, 99, 235, 0.08)',
            transform: 'translateX(3px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
            borderLeft: '3px solid #2563eb',
          },
        },
      },
    },
  },
});

// Enhanced theme with harmonious shadows
theme.shadows = [
  'none',
  '0 1px 2px 0 rgba(37, 99, 235, 0.05)',
  '0 2px 4px 0 rgba(37, 99, 235, 0.06)',
  '0 4px 6px -1px rgba(37, 99, 235, 0.08)',
  '0 6px 8px -1px rgba(37, 99, 235, 0.1)',
  '0 10px 15px -3px rgba(37, 99, 235, 0.1)',
  '0 12px 20px -3px rgba(37, 99, 235, 0.12)',
  '0 16px 25px -5px rgba(37, 99, 235, 0.15)',
  '0 20px 30px -5px rgba(37, 99, 235, 0.18)',
  '0 25px 35px -5px rgba(37, 99, 235, 0.2)',
  '0 30px 40px -5px rgba(37, 99, 235, 0.22)',
  '0 35px 45px -5px rgba(37, 99, 235, 0.25)',
  '0 40px 50px -5px rgba(37, 99, 235, 0.28)',
  '0 45px 55px -5px rgba(37, 99, 235, 0.3)',
  '0 50px 60px -5px rgba(37, 99, 235, 0.32)',
  '0 55px 65px -5px rgba(37, 99, 235, 0.35)',
  '0 60px 70px -5px rgba(37, 99, 235, 0.38)',
  '0 65px 75px -5px rgba(37, 99, 235, 0.4)',
  '0 70px 80px -5px rgba(37, 99, 235, 0.42)',
  '0 75px 85px -5px rgba(37, 99, 235, 0.45)',
  '0 80px 90px -5px rgba(37, 99, 235, 0.48)',
  '0 85px 95px -5px rgba(37, 99, 235, 0.5)',
  '0 90px 100px -5px rgba(37, 99, 235, 0.52)',
  '0 95px 105px -5px rgba(37, 99, 235, 0.55)',
  '0 100px 110px -5px rgba(37, 99, 235, 0.58)',
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
