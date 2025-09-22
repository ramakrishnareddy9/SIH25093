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
} from '@mui/icons-material';

// Import data
import studentsData from '../../data/students.json';
import activitiesData from '../../data/activities.json';
import analyticsData from '../../data/analytics.json';

const Dashboard = ({ userRole }) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentActivities, setStudentActivities] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    // Simulate current logged-in student (first student for demo)
    const student = studentsData[0];
    setCurrentStudent(student);

    // Get activities for current student
    const activities = activitiesData.filter(
      (activity) => activity.studentId === student.id
    );
    setStudentActivities(activities);

    // Calculate dashboard stats
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
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(45deg, ${color} 30%, ${color}90 90%)`,
        color: 'white',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
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
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {activity.type} • {activity.date}
            </Typography>
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
              sx={{ mt: 0.5 }}
            />
          </Box>
        }
      />
    </ListItem>
  );

  if (!currentStudent) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="fade-in page-container">
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
              src={currentStudent.profileImage}
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              Welcome back, {currentStudent.name}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {currentStudent.department} • Year {currentStudent.year} •{' '}
              {currentStudent.rollNumber}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  GPA
                </Typography>
                <Typography variant="h6">{currentStudent.gpa}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Attendance
                </Typography>
                <Typography variant="h6">{currentStudent.attendance}%</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Credits
                </Typography>
                <Typography variant="h6">
                  {currentStudent.completedCredits}/{currentStudent.totalCredits}
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
                  (currentStudent.completedCredits / currentStudent.totalCredits) * 100
                }
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentStudent.completedCredits} / {currentStudent.totalCredits} credits
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Attendance
              </Typography>
              <LinearProgress
                variant="determinate"
                value={currentStudent.attendance}
                color="success"
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {currentStudent.attendance}%
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
              {analyticsData.activityTypes.slice(0, 6).map((type) => (
                <Chip
                  key={type.type}
                  label={`${type.type}: ${type.count}`}
                  variant="outlined"
                  size="small"
                />
              ))}
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
              {studentActivities.slice(0, 5).map((activity) => (
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
