import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  CalendarToday,
  People,
  Star,
  Verified,
  Business,
  School,
  AccountBalance,
  EmojiEvents,
  Build,
  Computer,
  Science,
  AttachMoney,
  Schedule,
  Group,
  CheckCircle,
  Add,
} from '@mui/icons-material';

// Import services and hooks
import { useAuth } from '../../context/AuthContext';
import { useDataService } from '../../hooks/useDataService';

const EventDiscovery = ({ userRole }) => {
  const { user } = useAuth();
  const dataService = useDataService('EventDiscovery');
  
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    venue: '',
    capacity: '',
    fee: '',
  });

  // Get all events from centralized data service
  const events = dataService.getAllEvents();

  useEffect(() => {
    // Load registered events from centralized service
    if (user?.id) {
      const userRegistrations = dataService.getRegistrationsByStudent(user.id);
      setRegisteredEvents(userRegistrations);
    }
  }, [user, dataService]);

  useEffect(() => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Apply tab filter
    if (tabValue === 1) {
      filtered = filtered.filter(event => event.featured);
    } else if (tabValue === 2) {
      filtered = filtered.filter(event => registeredEvents.some(reg => reg.eventId === event.id));
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedType, tabValue, registeredEvents]);

  const handleEventRegistration = (eventId) => {
    const newRegistration = {
      eventId,
      userId: user.id,
      registrationDate: new Date().toISOString(),
      status: 'confirmed'
    };
    
    // Add registration through centralized service
    const registrationData = {
      eventId: selectedEvent.id,
      studentId: user.id,
      studentName: user.name || 'Student',
      studentEmail: user.email || 'student@college.edu',
      department: user.department || 'Computer Science',
      year: user.year || 3,
      amount: selectedEvent.fees?.student || 0,
      paymentStatus: selectedEvent.fees?.student > 0 ? 'pending' : 'paid'
    };
    
    const addedRegistration = dataService.addRegistration(registrationData);
    if (addedRegistration) {
      const updatedRegistrations = [...registeredEvents, addedRegistration];
      setRegisteredEvents(updatedRegistrations);
    }
    
    setRegistrationDialogOpen(false);
    alert('Successfully registered for the event!');
  };

  const handleCreateEvent = () => {
    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      category: newEvent.category,
      organizer: {
        name: user?.name || 'Faculty Name',
        type: 'university',
        verificationStatus: 'verified',
        contactEmail: user?.email || 'faculty@university.edu',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        website: 'https://university.edu'
      },
      venue: {
        name: newEvent.venue,
        address: newEvent.venue,
        type: 'physical',
        capacity: parseInt(newEvent.capacity) || 100
      },
      dates: {
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString(),
        registrationDeadline: new Date(newEvent.startDate).toISOString()
      },
      fees: {
        student: parseInt(newEvent.fee) || 0,
        professional: parseInt(newEvent.fee) * 2 || 0,
        currency: 'INR'
      },
      tags: [newEvent.type, newEvent.category, 'University Event'],
      requirements: ['Valid student ID', 'Registration required'],
      benefits: [
        'Certificate of participation',
        'Networking opportunities',
        'Learning experience'
      ],
      maxParticipants: parseInt(newEvent.capacity) || 100,
      createdBy: user?.name || 'Faculty'
    };
    
    // Use data service to add event (this updates the centralized data)
    const createdEvent = dataService.addEvent(eventData);
    
    if (createdEvent) {
      setEventDialogOpen(false);
      setNewEvent({
        title: '',
        description: '',
        type: '',
        category: '',
        startDate: '',
        endDate: '',
        venue: '',
        capacity: '',
        fee: '',
      });
      
      // Show success message
      alert(`Event "${createdEvent.title}" created successfully! All users can now view and register for this event.`);
    }
  };

  const getOrganizerIcon = (type) => {
    switch (type) {
      case 'university':
        return <School />;
      case 'company':
        return <Business />;
      case 'organization':
        return <AccountBalance />;
      default:
        return <Group />;
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'conference':
        return <People />;
      case 'hackathon':
        return <Computer />;
      case 'workshop':
        return <Build />;
      case 'competition':
        return <EmojiEvents />;
      case 'certification':
        return <CheckCircle />;
      default:
        return <CalendarToday />;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'conference':
        return 'primary';
      case 'hackathon':
        return 'secondary';
      case 'workshop':
        return 'success';
      case 'competition':
        return 'warning';
      case 'certification':
        return 'info';
      default:
        return 'default';
    }
  };

  const isEventRegistered = (eventId) => {
    return registeredEvents.some(reg => reg.eventId === eventId);
  };

  const isRegistrationOpen = (event) => {
    const now = new Date();
    const deadline = new Date(event.dates.registrationDeadline);
    return now < deadline && event.registrationCount < event.maxParticipants;
  };

  const EventCard = ({ event }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        position: 'relative',
      }}
    >
      {event.featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          icon={<Star />}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Event Type and Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            icon={getEventTypeIcon(event.type)}
            label={event.type}
            color={getEventTypeColor(event.type)}
            size="small"
            sx={{ mr: 1 }}
          />
          {isEventRegistered(event.id) && (
            <Chip
              label="Registered"
              color="success"
              size="small"
              icon={<CheckCircle />}
            />
          )}
        </Box>

        {/* Event Title */}
        <Typography variant="h6" component="div" gutterBottom>
          {event.title}
        </Typography>

        {/* Organizer */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={event.organizer.logo}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {getOrganizerIcon(event.organizer.type)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              {event.organizer.name}
              {event.organizer.verificationStatus === 'verified' && (
                <Verified color="primary" sx={{ ml: 0.5, fontSize: 16 }} />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.organizer.type}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description.length > 150
            ? `${event.description.substring(0, 150)}...`
            : event.description
          }
        </Typography>

        {/* Event Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(event.dates.startDate).toLocaleDateString()} - {new Date(event.dates.endDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.venue.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              ₹{event.fees.student} (Students) / ₹{event.fees.professional} (Professionals)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {event.registrationCount}/{event.maxParticipants} registered
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {event.tags.slice(0, 3).map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
          {event.tags.length > 3 && (
            <Chip label={`+${event.tags.length - 3} more`} size="small" variant="outlined" />
          )}
        </Box>

        {/* Registration Status */}
        {!isRegistrationOpen(event) && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {event.registrationCount >= event.maxParticipants
              ? 'Event is full'
              : 'Registration closed'
            }
          </Alert>
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={() => {
            setSelectedEvent(event);
            setDetailsDialogOpen(true);
          }}
        >
          View Details
        </Button>
        {isRegistrationOpen(event) && !isEventRegistered(event.id) && (
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setSelectedEvent(event);
              setRegistrationDialogOpen(true);
            }}
          >
            Register
          </Button>
        )}
        {isEventRegistered(event.id) && (
          <Button size="small" color="success" disabled>
            Registered
          </Button>
        )}
      </CardActions>
    </Card>
  );

  const categories = [...new Set(events.map(event => event.category))];
  const types = [...new Set(events.map(event => event.type))];
  const registeredCount = registeredEvents.length;
  const featuredCount = events.filter(event => event.featured).length;

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      {/* Header */}
      <Paper className="header-section">
        <Typography variant="h4" gutterBottom>
          Event Discovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and participate in conferences, workshops, hackathons, and competitions from universities and companies
        </Typography>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                {types.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredEvents.length} events found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Events" />
            <Tab 
              label={
                <Badge badgeContent={featuredCount} color="primary">
                  Featured
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={registeredCount} color="success">
                  My Events
                </Badge>
              } 
            />
          </Tabs>
        </Box>
      </Paper>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} lg={4} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {filteredEvents.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Paper>
      )}

      {/* Event Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              {/* Organizer Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={selectedEvent.organizer.logo}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {getOrganizerIcon(selectedEvent.organizer.type)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    {selectedEvent.organizer.name}
                    {selectedEvent.organizer.verificationStatus === 'verified' && (
                      <Verified color="primary" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.organizer.type} • {selectedEvent.organizer.website}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>

              {/* Event Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Event Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><CalendarToday /></ListItemIcon>
                      <ListItemText
                        primary="Dates"
                        secondary={`${new Date(selectedEvent.dates.startDate).toLocaleDateString()} - ${new Date(selectedEvent.dates.endDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LocationOn /></ListItemIcon>
                      <ListItemText
                        primary="Venue"
                        secondary={`${selectedEvent.venue.name}, ${selectedEvent.venue.address}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><People /></ListItemIcon>
                      <ListItemText
                        primary="Capacity"
                        secondary={`${selectedEvent.registrationCount}/${selectedEvent.maxParticipants} registered`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Registration</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Schedule /></ListItemIcon>
                      <ListItemText
                        primary="Deadline"
                        secondary={new Date(selectedEvent.dates.registrationDeadline).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AttachMoney /></ListItemIcon>
                      <ListItemText
                        primary="Fees"
                        secondary={`Students: ₹${selectedEvent.fees.student}, Professionals: ₹${selectedEvent.fees.professional}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {/* Benefits */}
              <Typography variant="subtitle2" gutterBottom>Benefits</Typography>
              <List dense sx={{ mb: 2 }}>
                {selectedEvent.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>

              {/* Requirements */}
              <Typography variant="subtitle2" gutterBottom>Requirements</Typography>
              <List dense sx={{ mb: 2 }}>
                {selectedEvent.requirements.map((requirement, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${requirement}`} />
                  </ListItem>
                ))}
              </List>

              {/* Tags */}
              <Typography variant="subtitle2" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedEvent.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedEvent && isRegistrationOpen(selectedEvent) && !isEventRegistered(selectedEvent.id) && (
            <Button
              variant="contained"
              onClick={() => {
                setDetailsDialogOpen(false);
                setRegistrationDialogOpen(true);
              }}
            >
              Register Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog
        open={registrationDialogOpen}
        onClose={() => setRegistrationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Register for Event</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Organized by {selectedEvent.organizer.name}
              </Typography>
              
              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                Registration fee: ₹{selectedEvent.fees.student} (Student rate)
              </Alert>

              <Typography variant="body2">
                By registering, you confirm that you meet all the requirements and agree to the event terms and conditions.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegistrationDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleEventRegistration(selectedEvent.id)}
          >
            Confirm Registration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Faculty */}
      {userRole === 'faculty' && (
        <Fab
          color="primary"
          aria-label="add event"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setEventDialogOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Event Creation Dialog */}
      <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Event Title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Description" 
                multiline 
                rows={3} 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="seminar">Seminar</MenuItem>
                  <MenuItem value="competition">Competition</MenuItem>
                  <MenuItem value="hackathon">Hackathon</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select 
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                >
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Start Date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="End Date" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Venue" 
                value={newEvent.venue}
                onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Capacity" 
                type="number" 
                value={newEvent.capacity}
                onChange={(e) => setNewEvent({...newEvent, capacity: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Registration Fee (INR)" 
                type="number" 
                value={newEvent.fee}
                onChange={(e) => setNewEvent({...newEvent, fee: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEvent}>Create Event</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDiscovery;
