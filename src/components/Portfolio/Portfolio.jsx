import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Download,
  Print,
  Visibility,
  Star,
  School,
  Work,
  EmojiEvents,
  VolunteerActivism,
  Psychology,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';

// Import data
import studentsData from '../../data/students.json';
import activitiesData from '../../data/activities.json';

const Portfolio = ({ userRole }) => {
  const [student, setStudent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const portfolioRef = useRef(null);

  const generatePDF = () => {
    window.print();
  };


  useEffect(() => {
    // Get current student data (first student for demo)
    const currentStudent = studentsData[0];
    setStudent(currentStudent);

    // Get approved activities for the student
    const studentActivities = activitiesData.filter(
      (activity) =>
        activity.studentId === currentStudent.id && activity.status === 'approved'
    );
    setActivities(studentActivities);
  }, []);

  const handleDownloadPDF = () => {
    // This would integrate with jsPDF to generate PDF
    console.log('Downloading PDF...');
    alert('PDF download functionality would be implemented here using jsPDF');
  };

  const handleSharePortfolio = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/portfolio/share/${student?.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Portfolio link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const getActivitiesByType = (type) => {
    return activities.filter((activity) => activity.type === type);
  };

  const getSkillsFromActivities = () => {
    const allSkills = activities.flatMap((activity) => activity.skills || []);
    const skillCount = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(skillCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  };

  const PortfolioHeader = () => (
    <Paper
      sx={{
        p: 4,
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar
            src={student?.profileImage}
            sx={{ width: 120, height: 120, border: '4px solid white' }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h3" gutterBottom>
            {student?.name}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            {student?.department} Student • Year {student?.year}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{student?.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{student?.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{student?.address}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="h5">{student?.gpa}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                GPA
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">{student?.attendance}%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Attendance
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">{activities.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Activities
              </Typography>
            </Box>
            <Box>
              <Typography variant="h5">
                {activities.reduce((sum, activity) => sum + activity.credits, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Credits
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const AcademicSection = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <School sx={{ mr: 2, color: 'primary.main' }} />
        Academic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Current Status
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Roll Number"
                secondary={student?.rollNumber}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Department"
                secondary={student?.department}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Year/Semester"
                secondary={`Year ${student?.year}, Semester ${student?.semester}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="GPA" secondary={student?.gpa} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Progress
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Credits Completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(student?.completedCredits / student?.totalCredits) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {student?.completedCredits} / {student?.totalCredits} credits
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              Attendance
            </Typography>
            <LinearProgress
              variant="determinate"
              value={student?.attendance}
              color="success"
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {student?.attendance}%
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const ActivitiesSection = () => {
    const activityTypes = [
      { type: 'certification', icon: <Star />, label: 'Certifications' },
      { type: 'internship', icon: <Work />, label: 'Internships' },
      { type: 'competition', icon: <EmojiEvents />, label: 'Competitions' },
      { type: 'conference', icon: <School />, label: 'Conferences' },
      { type: 'volunteering', icon: <VolunteerActivism />, label: 'Volunteering' },
      { type: 'leadership', icon: <Psychology />, label: 'Leadership' },
    ];

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEvents sx={{ mr: 2, color: 'primary.main' }} />
          Activities & Achievements
        </Typography>
        {activityTypes.map((typeInfo) => {
          const typeActivities = getActivitiesByType(typeInfo.type);
          if (typeActivities.length === 0) return null;

          return (
            <Box key={typeInfo.type} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
              >
                {typeInfo.icon}
                <span style={{ marginLeft: 8 }}>{typeInfo.label}</span>
                <Chip
                  label={typeActivities.length}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Typography>
              <Grid container spacing={2}>
                {typeActivities.map((activity) => (
                  <Grid item xs={12} md={6} key={activity.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {activity.organizer} • {activity.date}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={`${activity.credits} credits`}
                            size="small"
                            color="primary"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {activity.location}
                          </Typography>
                        </Box>
                        {activity.skills && activity.skills.length > 0 && (
                          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {activity.skills.slice(0, 3).map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Paper>
    );
  };

  const SkillsSection = () => {
    const skills = getSkillsFromActivities();

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 2, color: 'primary.main' }} />
          Skills & Competencies
        </Typography>
        <Grid container spacing={2}>
          {skills.map(([skill, count]) => (
            <Grid item xs={12} sm={6} md={4} key={skill}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {skill}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((count / 5) * 100, 100)}
                    sx={{ flexGrow: 1, mr: 2 }}
                  />
                  <Typography variant="caption">
                    {count} {count === 1 ? 'activity' : 'activities'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const SummarySection = () => {
    const totalCredits = activities.reduce((sum, activity) => sum + activity.credits, 0);
    const activityTypes = [...new Set(activities.map((activity) => activity.type))];

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Portfolio Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Key Highlights
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${activities.length} Verified Activities`}
                  secondary="All activities have been approved by faculty"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEvents color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${totalCredits} Activity Credits Earned`}
                  secondary="Demonstrating active participation in co-curricular activities"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={`${student?.gpa} GPA Maintained`}
                  secondary="Excellent academic performance"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Activity Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activityTypes.map((type) => (
                <Chip
                  key={type}
                  label={`${type}: ${getActivitiesByType(type).length}`}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="page-container">
      {/* Action Bar */}
      <Paper className="header-section" sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h4">Digital Portfolio</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Visibility />}
            onClick={() => setPreviewOpen(true)}
            variant="outlined"
          >
            Preview
          </Button>
          <Button
            startIcon={<Download />}
            onClick={generatePDF}
            variant="outlined"
          >
            Download PDF
          </Button>
        </Box>
      </Paper>

      {/* Portfolio Content */}
      <Box ref={portfolioRef}>
        <PortfolioHeader />
        <AcademicSection />
        <ActivitiesSection />
        <SkillsSection />
        <SummarySection />
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Portfolio Preview
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
            <PortfolioHeader />
            <AcademicSection />
            <ActivitiesSection />
            <SkillsSection />
            <SummarySection />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button onClick={handleDownloadPDF} variant="contained">
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;
