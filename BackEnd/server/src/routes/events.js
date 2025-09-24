const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isFaculty } = require('../middleware/auth');
const { createSuccessResponse, createErrorResponse } = require('../utils/response');
const { eventValidation, handleValidationErrors } = require('../utils/validation');

// Helper function to get all events (mock data)
const getAllEvents = async () => {
  return [
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "2025-03-15",
      description: "Annual technology conference featuring latest trends in software development, AI, and machine learning. Join industry experts and fellow students for a day of learning and networking.",
      location: "Main Auditorium",
      organizer: "Computer Science Department",
      type: "conference",
      attendees: 245,
      maxAttendees: 300,
      registrationOpen: true,
      topics: ["AI", "Machine Learning", "Software Development", "Career Development"]
    },
    {
      id: 2,
      title: "AI Workshop: Deep Learning Fundamentals",
      date: "2025-04-20",
      description: "Hands-on workshop covering the fundamentals of deep learning, neural networks, and practical applications. Participants will build their first neural network model.",
      location: "Lab 301",
      organizer: "AI Research Group",
      type: "workshop",
      attendees: 45,
      maxAttendees: 50,
      registrationOpen: true,
      topics: ["Deep Learning", "Neural Networks", "TensorFlow", "Python"]
    },
    {
      id: 3,
      title: "Hackathon 2025: Smart Campus Solutions",
      date: "2025-05-10",
      description: "48-hour hackathon focused on developing innovative solutions for smart campus challenges. Prizes worth ₹50,000 to be won!",
      location: "Innovation Center",
      organizer: "Innovation & Entrepreneurship Cell",
      type: "hackathon",
      attendees: 89,
      maxAttendees: 120,
      registrationOpen: true,
      topics: ["Innovation", "Problem Solving", "Team Work", "Technology"]
    },
    {
      id: 4,
      title: "Career Fair: Tech Industry Meetup",
      date: "2025-06-05",
      description: "Meet representatives from top tech companies including Google, Microsoft, Amazon, and startups. Perfect opportunity for internships and job placements.",
      location: "Campus Ground",
      organizer: "Placement Cell",
      type: "career fair",
      attendees: 312,
      maxAttendees: 400,
      registrationOpen: true,
      topics: ["Career", "Networking", "Industry", "Jobs"]
    },
    {
      id: 5,
      title: "Web Development Bootcamp",
      date: "2025-03-28",
      description: "Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and cloud deployment.",
      location: "Computer Lab 2",
      organizer: "Web Development Club",
      type: "bootcamp",
      attendees: 28,
      maxAttendees: 30,
      registrationOpen: true,
      topics: ["Web Development", "React", "Node.js", "JavaScript"]
    }
  ];
};

// Get all events
router.get('/', [authenticate], async (req, res) => {
  try {
    const events = await getAllEvents();

    return res.status(200).json(createSuccessResponse({
      events,
      count: events.length
    }, 'Events retrieved successfully'));
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve events'));
  }
});

// Get upcoming events
router.get('/upcoming', [authenticate], async (req, res) => {
  try {
    const events = await getAllEvents();
    const upcomingEvents = events.filter(event =>
      new Date(event.date) >= new Date()
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json(createSuccessResponse({
      events: upcomingEvents,
      count: upcomingEvents.length
    }, 'Upcoming events retrieved successfully'));
  } catch (error) {
    console.error('Get upcoming events error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve upcoming events'));
  }
});

// Get event by ID
router.get('/:id', [authenticate], async (req, res) => {
  try {
    const events = await getAllEvents();
    const event = events.find(e => e.id === parseInt(req.params.id));

    if (!event) {
      return res.status(404).json(createErrorResponse('Event not found'));
    }

    return res.status(200).json(createSuccessResponse({
      event
    }, 'Event retrieved successfully'));
  } catch (error) {
    console.error('Get event error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve event'));
  }
});

// Register for an event
router.post('/:id/register', [authenticate], async (req, res) => {
  try {
    const events = await getAllEvents();
    const event = events.find(e => e.id === parseInt(req.params.id));

    if (!event) {
      return res.status(404).json(createErrorResponse('Event not found'));
    }

    if (!event.registrationOpen) {
      return res.status(400).json(createErrorResponse('Registration is closed for this event'));
    }

    if (event.attendees >= event.maxAttendees) {
      return res.status(400).json(createErrorResponse('Event is full'));
    }

    // In a real application, you would update the user's registered events
    // For now, just return success
    event.attendees += 1;

    return res.status(200).json(createSuccessResponse({
      event
    }, 'Successfully registered for the event'));
  } catch (error) {
    console.error('Register for event error:', error);
    return res.status(500).json(createErrorResponse('Failed to register for event'));
  }
});

// Get registered events for current user
router.get('/registered', [authenticate], async (req, res) => {
  try {
    // In a real application, you would fetch the user's registered events from the database
    // For now, return an empty array to prevent crashes
    const registeredEvents = [];

    return res.status(200).json(createSuccessResponse({
      events: registeredEvents,
      count: registeredEvents.length
    }, 'Registered events retrieved successfully'));
  } catch (error) {
    console.error('Get registered events error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve registered events'));
  }
});

// Get events by type
router.get('/type/:type', [authenticate], async (req, res) => {
  try {
    const { type } = req.params;
    const events = await getAllEvents();
    const eventsByType = events.filter(event =>
      event.type === type.toLowerCase()
    );

    return res.status(200).json(createSuccessResponse({
      events: eventsByType,
      count: eventsByType.length
    }, 'Events retrieved successfully'));
  } catch (error) {
    console.error('Get events by type error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve events'));
  }
});

module.exports = router;
