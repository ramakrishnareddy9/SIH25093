import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Assignment,
  CheckCircle,
  Pending,
  Star,
  CalendarToday,
  Person,
  Notifications,
  AdminPanelSettings,
  SupervisorAccount,
  Assessment,
  Security,
} from '@mui/icons-material';

// Import services and hooks
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const Dashboard = ({ userRole }) => {
  const { user } = useAuth();
  const dataService = useDataService('Dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    // Get data from centralized service
    const studentsData = dataService.getAllStudents();
    const facultyData = dataService.getAllFaculty();
    const activitiesData = dataService.getAllActivities();
    const stats = dataService.getStatistics();
    
    // Store analytics data for use in student dashboard
    window.dashboardAnalytics = {
      activityTypes: [
        { type: 'certification', count: 60 },
        { type: 'internship', count: 35 },
        { type: 'competition', count: 40 },
        { type: 'conference', count: 45 },
        { type: 'volunteering', count: 30 },
        { type: 'leadership', count: 25 }
      ]
    };

    if (userRole === 'admin') {
      // Admin dashboard - system-wide statistics
      setCurrentUser({
        name: 'System Administrator',
        role: 'admin',
        department: 'Administration',
        profileImage: null
      });

      // System-wide statistics
      const pendingActivities = dataService.getActivitiesByStatus('pending');
      const approvedActivities = dataService.getActivitiesByStatus('approved');
      const rejectedActivities = dataService.getActivitiesByStatus('rejected');
      
      setUserActivities(activitiesData.slice(0, 10)); // Recent system activities
      
      setDashboardStats({
        totalUsers: studentsData.length + facultyData.length,
        totalStudents: studentsData.length,
        totalFaculty: facultyData.length,
        totalActivities: stats.totalActivities,
        pendingActivities: pendingActivities.length,
        approvedActivities: approvedActivities.length,
        rejectedActivities: rejectedActivities.length,
        systemUptime: '99.8%',
      });
    } else if (userRole === 'faculty') {
      // Get faculty data - use first faculty for demo or find by user ID
      const faculty = facultyData[0] || {
        name: 'Faculty Member',
        department: 'Computer Science',
        designation: 'Professor',
        experience: 10,
        specialization: ['Computer Science']
      };
      setCurrentUser(faculty);

      // Get activities that need faculty review
      const pendingActivities = dataService.getActivitiesByStatus('pending');
      const approvedByFaculty = dataService.getActivitiesByStatus('approved');
      
      setUserActivities(pendingActivities);
      
      setDashboardStats({
        totalStudents: studentsData.length,
        pendingReviews: pendingActivities.length,
        approvedActivities: approvedByFaculty.length,
        totalCourses: faculty.courses?.length || 3,
      });
    } else {
      // Student dashboard - use first student for demo or find by user ID
      const student = studentsData[0] || {
        name: 'Student',
        department: 'Computer Science',
        year: 3,
        rollNumber: 'CS001',
        gpa: 8.5,
        attendance: 90,
        completedCredits: 120,
        totalCredits: 160
      };
      setCurrentUser(student);

      const activities = dataService.getActivitiesByStudent(student.id);
      setUserActivities(activities);

      const approvedActivities = activities.filter(
        (activity) => activity.status === 'approved'
      ).length;
      const pendingActivities = activities.filter(
        (activity) => activity.status === 'pending'
      ).length;
      const totalCredits = activities
        .filter((activity) => activity.status === 'approved')
        .reduce((sum, activity) => sum + activity.credits, 0);

      setDashboardStats({
        totalActivities: activities.length,
        approvedActivities,
        pendingActivities,
        totalCredits,
      });
    }
  }, [userRole]); // Remove dataService dependency to prevent infinite loop

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      className="glass hover-lift"
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            background: 'rgba(255, 255, 255, 0.2)',
            mr: 2 
          }}>
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const RecentActivity = ({ activity }) => (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor:
              activity.status === 'approved'
                ? 'success.main'
                : activity.status === 'pending'
                ? 'warning.main'
                : 'error.main',
          }}
        >
          {activity.status === 'approved' ? (
            <CheckCircle />
          ) : activity.status === 'pending' ? (
            <Pending />
          ) : (
            <Assignment />
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={activity.title}
        secondary={`${activity.type} • ${activity.date}`}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip
          label={activity.status}
          size="small"
          color={
            activity.status === 'approved'
              ? 'success'
              : activity.status === 'pending'
              ? 'warning'
              : 'error'
          }
        />
      </Box>
    </ListItem>
  );

  if (!currentUser) {
    return <Typography>Loading...</Typography>;
  }

  // Admin Dashboard
  if (userRole === 'admin') {
    return (
      <Box className="fade-in page-container" sx={{ p: 3 }}>
        {/* Admin Welcome Section */}
        <Paper
          className="scale-in header-section"
          sx={{
            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}
              >
                <AdminPanelSettings fontSize="large" />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                System Administration Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Smart Student Hub Management Console
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    System Status
                  </Typography>
                  <Typography variant="h6">Online</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Uptime
                  </Typography>
                  <Typography variant="h6">{dashboardStats.systemUptime}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Users
                  </Typography>
                  <Typography variant="h6">{dashboardStats.totalUsers}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Admin Stats Cards */}
        <Box className="stats-section">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3} className="slide-in">
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers}
                icon={<Person />}
                color="#667eea"
                subtitle={`${dashboardStats.totalStudents} Students, ${dashboardStats.totalFaculty} Faculty`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Activities"
                value={dashboardStats.totalActivities}
                icon={<Assignment />}
                color="#764ba2"
                subtitle="System-wide submissions"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Reviews"
                value={dashboardStats.pendingActivities}
                icon={<Pending />}
                color="#f59e0b"
                subtitle="Awaiting approval"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved Activities"
                value={dashboardStats.approvedActivities}
                icon={<CheckCircle />}
                color="#10b981"
                subtitle="Successfully verified"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Admin Content */}
        <Box className="section-container">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent System Activities
                </Typography>
                <List>
                  {userActivities.slice(0, 8).map((activity) => (
                    <RecentActivity key={activity.id} activity={activity} />
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Administrative Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SupervisorAccount sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2">User Management</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Manage students, faculty, and admin accounts
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Assessment sx={{ mr: 1, color: 'secondary.main' }} />
                      <Typography variant="subtitle2">System Analytics</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      View detailed system reports and analytics
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Security sx={{ mr: 1, color: 'warning.main' }} />
                      <Typography variant="subtitle2">System Settings</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Configure system parameters and security
                    </Typography>
                  </Card>
                </Box>
              </Paper>

              {/* System Health Status */}
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  System Health
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Server Performance
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    color="success"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    95% - Excellent
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Database Health
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={88}
                    color="success"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    88% - Good
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Storage Usage
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    color="warning"
                    sx={{ height: 8, borderRadius: 4, mt: 1 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    65% - Moderate
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  // Faculty Dashboard
  if (userRole === 'faculty') {
    return (
      <Box className="fade-in page-container" sx={{ p: 3 }}>
        {/* Faculty Welcome Section */}
        <Paper
          className="scale-in header-section"
          sx={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={currentUser.profileImage}
                sx={{ width: 80, height: 80 }}
              >
                {currentUser.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Welcome, Dr. {currentUser.name}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {currentUser.department} • {currentUser.designation || 'Professor'}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Experience
                  </Typography>
                  <Typography variant="h6">{currentUser.experience || '10+ years'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Specialization
                  </Typography>
                  <Typography variant="h6">{currentUser.specialization || 'Computer Science'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Students
                  </Typography>
                  <Typography variant="h6">{dashboardStats.totalStudents}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Faculty Stats Cards */}
        <Box className="stats-section">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} className="slide-in">
              <StatCard
                title="Total Students"
                value={dashboardStats.totalStudents}
                icon={<Person />}
                color="#1976d2"
                subtitle="Under guidance"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Reviews"
                value={dashboardStats.pendingReviews}
                icon={<Pending />}
                color="#ed6c02"
                subtitle="Awaiting approval"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved Activities"
                value={dashboardStats.approvedActivities}
                icon={<CheckCircle />}
                color="#2e7d32"
                subtitle="This semester"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Courses Teaching"
                value={dashboardStats.totalCourses}
                icon={<School />}
                color="#9c27b0"
                subtitle="Current semester"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Faculty Content */}
        <Box className="section-container">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity Reviews
                </Typography>
                <List>
                  {userActivities.slice(0, 5).map((activity) => (
                    <RecentActivity key={activity.id} activity={activity} />
                  ))}
                </List>
                {userActivities.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No pending activities to review
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Faculty Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Typography variant="subtitle2">Review Activities</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approve or reject student activities
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Typography variant="subtitle2">Validate Certificates</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verify certificates from your events
                    </Typography>
                  </Card>
                  <Card
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Typography variant="subtitle2">View Students</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your students' progress
                    </Typography>
                  </Card>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  // Student Dashboard
  return (
    <Box className="fade-in page-container" sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper
        className="scale-in header-section"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={currentUser.profileImage}
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              Welcome back, {currentUser.name}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {currentUser.department} • Year {currentUser.year} •{' '}
              {currentUser.rollNumber}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  GPA
                </Typography>
                <Typography variant="h6">{currentUser.gpa}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Attendance
                </Typography>
                <Typography variant="h6">{currentUser.attendance}%</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Credits
                </Typography>
                <Typography variant="h6">
                  {currentUser.completedCredits}/{currentUser.totalCredits}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Box className="stats-section">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} className="slide-in">
          <StatCard
            title="Total Activities"
            value={dashboardStats.totalActivities}
            icon={<Assignment />}
            color="#1976d2"
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={dashboardStats.approvedActivities}
            icon={<CheckCircle />}
            color="#2e7d32"
            subtitle="Verified activities"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={dashboardStats.pendingActivities}
            icon={<Pending />}
            color="#ed6c02"
            subtitle="Awaiting approval"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Credits Earned"
            value={dashboardStats.totalCredits}
            icon={<Star />}
            color="#9c27b0"
            subtitle="Activity credits"
          />
        </Grid>
        </Grid>
      </Box>

      {/* Progress Section */}
      <Box className="section-container">
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Academic Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Credits Completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  (currentUser.completedCredits / currentUser.totalCredits) * 100
                }
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentUser.completedCredits} / {currentUser.totalCredits} credits
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Attendance
              </Typography>
              <LinearProgress
                variant="determinate"
                value={currentUser.attendance}
                color="success"
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentUser.attendance}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {window.dashboardAnalytics?.activityTypes?.slice(0, 6).map((type) => (
                <Chip
                  key={type.type}
                  label={`${type.type}: ${type.count}`}
                  variant="outlined"
                  size="small"
                />
              )) || []}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {userActivities.slice(0, 5).map((activity) => (
                <RecentActivity key={activity.id} activity={activity} />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Typography variant="subtitle2">Add New Activity</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload certificates and documents
                </Typography>
              </Card>
              <Card
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Typography variant="subtitle2">View Portfolio</Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate and download your portfolio
                </Typography>
              </Card>
              <Card
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Typography variant="subtitle2">Update Profile</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your personal information
                </Typography>
              </Card>
            </Box>
          </Paper>
        </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
