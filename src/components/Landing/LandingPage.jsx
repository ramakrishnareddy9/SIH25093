import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Fab,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  School,
  TrendingUp,
  Security,
  Speed,
  CheckCircle,
  Star,
  ArrowForward,
  PlayArrow,
  Dashboard,
  Assignment,
  EmojiEvents,
  Analytics,
  CardMembership,
  Folder,
  Group,
  CloudUpload,
  Verified,
  AutoAwesome,
  Rocket,
  Psychology,
} from '@mui/icons-material';

// Import services and hooks
import { useDataService } from '../../hooks/useDataService';

const LandingPage = () => {
  const navigate = useNavigate();
  const dataService = useDataService('LandingPage');
  const [animateCards, setAnimateCards] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [landingData, setLandingData] = useState({ features: [], stats: [], testimonials: [] });

  useEffect(() => {
    // Load landing page data from service
    const data = dataService.getLandingData();
    setLandingData(data);
  }, []); // Remove dataService dependency to prevent infinite loop

  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % (landingData.features?.length || 6));
    }, 3000);
    return () => clearInterval(interval);
  }, [landingData.features]);

  // Memoize icon mapping to prevent recreation on every render
  const iconMap = useMemo(() => ({
    Dashboard: <Dashboard />,
    Assignment: <Assignment />,
    EmojiEvents: <EmojiEvents />,
    CardMembership: <CardMembership />,
    Folder: <Folder />,
    Analytics: <Analytics />,
    Group: <Group />,
    School: <School />,
    Verified: <Verified />,
    Security: <Security />
  }), []);

  // Memoize processed data to prevent recreation on every render
  const { features, stats, testimonials } = useMemo(() => {
    const processedFeatures = landingData.features?.map(feature => ({
      ...feature,
      icon: iconMap[feature.icon] || <Dashboard />
    })) || [];

    const processedStats = landingData.stats?.map(stat => ({
      ...stat,
      icon: iconMap[stat.icon] || <Group />
    })) || [];

    const processedTestimonials = landingData.testimonials || [];

    return {
      features: processedFeatures,
      stats: processedStats,
      testimonials: processedTestimonials
    };
  }, [landingData, iconMap]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2563eb 0%, #ff6b6b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.2) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      {/* Navigation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ fontSize: 32, color: 'white', mr: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Smart Student Hub
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #059669 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(245, 158, 11, 0.4)'
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 15, pb: 8, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="fade-in">
              <Chip
                label="🚀 Next-Gen Education Platform"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2
                }}
              >
                Empower Your
                <br />
                Academic Journey
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                The ultimate platform for managing student activities, achievements, 
                and digital portfolios with AI-powered insights and blockchain verification.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  startIcon={<Rocket />}
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 30px rgba(245, 158, 11, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #d97706 0%, #059669 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 35px rgba(245, 158, 11, 0.35)'
                    }
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: '#FFD700', fontSize: 20 }} />
                  ))}
                  <Typography sx={{ color: 'white', ml: 1, fontWeight: 600 }}>
                    4.9/5
                  </Typography>
                </Box>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Trusted by 10,000+ students
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              className="scale-in"
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -20,
                  left: -20,
                  right: -20,
                  bottom: -20,
                  background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  borderRadius: '30px',
                  backdropFilter: 'blur(20px)',
                  zIndex: -1
                }
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students collaborating"
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                className={animateCards ? 'slide-in' : ''}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <Box sx={{ color: '#10b981', mb: 2 }}>
                  {React.cloneElement(stat.icon, { fontSize: 'large' })}
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 10, background: 'rgba(255, 255, 255, 0.05)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: 600, mx: 'auto' }}
            >
              Everything you need to manage, track, and showcase your academic achievements
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className={animateCards ? 'fade-in' : ''}
                  sx={{
                    height: '100%',
                    background: currentFeature === index 
                      ? `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`
                      : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: currentFeature === index 
                      ? `2px solid ${feature.color}50`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.5s ease',
                    transform: currentFeature === index ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: 'translateY(-10px) scale(1.02)',
                      background: `linear-gradient(135deg, ${feature.color}30 0%, ${feature.color}15 100%)`,
                      border: `2px solid ${feature.color}70`
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `${feature.color}20`,
                        mx: 'auto'
                      }}
                    >
                      {React.cloneElement(feature.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ color: 'white', fontWeight: 600, mb: 2, textAlign: 'center' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            What People Say
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                className="hover-lift"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={testimonial.avatar}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 10, background: 'rgba(0, 0, 0, 0.2)' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to Transform Your Academic Journey?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}
            >
              Join thousands of students and institutions already using Smart Student Hub
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #059669 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)'
                }
              }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 32, color: 'white', mr: 1 }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                  Smart Student Hub
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Empowering education through digital innovation and intelligent automation.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  sx={{ color: 'rgba(255, 255, 255, 0.7)', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  sx={{ color: 'rgba(255, 255, 255, 0.7)', justifyContent: 'flex-start' }}
                  onClick={() => navigate('/signup')}
                >
                  Create Account
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
            &copy; 2024 Smart Student Hub. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d97706 0%, #059669 100%)',
            transform: 'scale(1.05)'
          }
        }}
        onClick={() => navigate('/signup')}
      >
        <AutoAwesome />
      </Fab>
    </Box>
  );
};

export default LandingPage;
