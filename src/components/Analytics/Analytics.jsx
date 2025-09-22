import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  School,
  EmojiEvents,
  Star,
  CheckCircle,
  Pending,
} from '@mui/icons-material';

// Import data
import analyticsData from '../../data/analytics.json';
import studentsData from '../../data/students.json';
import activitiesData from '../../data/activities.json';

const Analytics = ({ userRole }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [filteredData, setFilteredData] = useState(analyticsData);

  useEffect(() => {
    // Apply filters to data
    let filtered = { ...analyticsData };
    
    if (selectedDepartment !== 'all') {
      filtered.departmentStats = filtered.departmentStats.filter(
        (dept) => dept.department === selectedDepartment
      );
    }

    setFilteredData(filtered);
  }, [selectedDepartment, selectedTimeframe]);

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
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
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUp sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2">{trend}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const DepartmentOverview = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Department Overview
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell align="right">Students</TableCell>
              <TableCell align="right">Avg GPA</TableCell>
              <TableCell align="right">Attendance</TableCell>
              <TableCell align="right">Activities</TableCell>
              <TableCell align="right">Approval Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.departmentStats.map((dept) => (
              <TableRow key={dept.department}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1, color: 'primary.main' }} />
                    {dept.department}
                  </Box>
                </TableCell>
                <TableCell align="right">{dept.totalStudents}</TableCell>
                <TableCell align="right">{dept.averageGPA}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <LinearProgress
                      variant="determinate"
                      value={dept.averageAttendance}
                      sx={{ width: 60, mr: 1 }}
                    />
                    {dept.averageAttendance}%
                  </Box>
                </TableCell>
                <TableCell align="right">{dept.totalActivities}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${Math.round(
                      (dept.approvedActivities / dept.totalActivities) * 100
                    )}%`}
                    color={
                      dept.approvedActivities / dept.totalActivities > 0.8
                        ? 'success'
                        : dept.approvedActivities / dept.totalActivities > 0.6
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const ActivityTypeChart = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Activity Type Distribution
      </Typography>
      <Grid container spacing={2}>
        {analyticsData.activityTypes.map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type.type}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                    {type.type}
                  </Typography>
                  <Chip label={`${type.percentage}%`} size="small" />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={type.percentage}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {type.count} activities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const TopPerformers = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Top Performing Students
      </Typography>
      <List>
        {analyticsData.topPerformers.map((student, index) => (
          <ListItem key={student.studentId}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32' }}>
                {index + 1}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={student.name}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {student.department} • GPA: {student.gpa}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={`${student.totalActivities} activities`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${student.totalCredits} credits`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  const SkillsAnalysis = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Popular Skills
      </Typography>
      <Grid container spacing={2}>
        {analyticsData.skillsAnalysis.map((skill) => (
          <Grid item xs={12} sm={6} md={4} key={skill.skill}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {skill.skill}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress
                  variant="determinate"
                  value={(skill.count / 25) * 100}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Typography variant="caption">
                  {skill.count}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const MonthlyTrends = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Activity Trends
      </Typography>
      <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 1 }}>
        {analyticsData.monthlyActivities.map((month) => (
          <Box
            key={month.month}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: `${(month.activities / 50) * 200}px`,
                bgcolor: 'primary.main',
                borderRadius: '4px 4px 0 0',
                mb: 1,
                minHeight: '20px',
              }}
            />
            <Typography variant="caption" sx={{ writingMode: 'vertical-lr', textAlign: 'center' }}>
              {month.month.split(' ')[0]}
            </Typography>
            <Typography variant="caption" color="primary">
              {month.activities}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );

  // Calculate overall stats
  const totalStudents = analyticsData.departmentStats.reduce(
    (sum, dept) => sum + dept.totalStudents,
    0
  );
  const totalActivities = analyticsData.departmentStats.reduce(
    (sum, dept) => sum + dept.totalActivities,
    0
  );
  const totalApproved = analyticsData.departmentStats.reduce(
    (sum, dept) => sum + dept.approvedActivities,
    0
  );
  const totalPending = analyticsData.departmentStats.reduce(
    (sum, dept) => sum + dept.pendingActivities,
    0
  );

  return (
    <Box className="page-container">
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Analytics & Reporting
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Comprehensive insights into student activities and institutional performance
        </Typography>
        
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              label="Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {analyticsData.departmentStats.map((dept) => (
                <MenuItem key={dept.department} value={dept.department}>
                  {dept.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={selectedTimeframe}
              label="Timeframe"
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="lastSemester">Last Semester</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={<People />}
            color="#1976d2"
            subtitle="Across all departments"
            trend="+5% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Activities"
            value={totalActivities}
            icon={<Assignment />}
            color="#2e7d32"
            subtitle="All submissions"
            trend="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Approved"
            value={totalApproved}
            icon={<CheckCircle />}
            color="#ed6c02"
            subtitle="Faculty approved"
            trend={`${Math.round((totalApproved / totalActivities) * 100)}% approval rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Review"
            value={totalPending}
            icon={<Pending />}
            color="#9c27b0"
            subtitle="Awaiting approval"
            trend="Avg 2 days review time"
          />
        </Grid>
      </Grid>

      {/* Charts and Analysis */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DepartmentOverview />
        </Grid>
        <Grid item xs={12} md={8}>
          <ActivityTypeChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopPerformers />
        </Grid>
        <Grid item xs={12} md={8}>
          <MonthlyTrends />
        </Grid>
        <Grid item xs={12} md={4}>
          <SkillsAnalysis />
        </Grid>
      </Grid>

      {/* Export Options */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Reports
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Generate reports for NAAC, AICTE, NIRF, or internal evaluations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Chip
            label="NAAC Report"
            clickable
            color="primary"
            variant="outlined"
          />
          <Chip
            label="AICTE Report"
            clickable
            color="primary"
            variant="outlined"
          />
          <Chip
            label="NIRF Report"
            clickable
            color="primary"
            variant="outlined"
          />
          <Chip
            label="Department Report"
            clickable
            color="primary"
            variant="outlined"
          />
          <Chip
            label="Student Report"
            clickable
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
