import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/DataService';

// Custom hook for using the DataService
export const useDataService = (componentName = 'component') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to data changes
  useEffect(() => {
    const handleDataChange = (changeType, data) => {
      // Force re-render when data changes
      if (changeType === 'dataLoaded') {
        setIsLoading(false);
      }
    };

    dataService.subscribe(componentName, handleDataChange);

    // Check if data is already loaded
    if (dataService.isDataLoaded()) {
      setIsLoading(false);
    }

    return () => {
      dataService.unsubscribe(componentName);
    };
  }, [componentName]);

  // Events
  const getAllEvents = useCallback(async () => {
    try {
      return await dataService.getAllEvents();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addEvent = useCallback(async (eventData) => {
    try {
      return await dataService.addEvent(eventData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateEvent = useCallback(async (id, updates) => {
    try {
      return await dataService.updateEvent(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      return await dataService.deleteEvent(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Activities
  const getAllActivities = useCallback(async () => {
    try {
      return await dataService.getAllActivities();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addActivity = useCallback(async (activityData) => {
    try {
      return await dataService.addActivity(activityData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateActivity = useCallback(async (id, updates) => {
    try {
      return await dataService.updateActivity(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const approveActivity = useCallback(async (id, approverName, comment) => {
    try {
      return await dataService.approveActivity(id, approverName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const rejectActivity = useCallback(async (id, rejectorName, comment) => {
    try {
      return await dataService.rejectActivity(id, rejectorName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Certificates
  const getAllCertificates = useCallback(async () => {
    try {
      return await dataService.getAllCertificates();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addCertificate = useCallback(async (certificateData) => {
    try {
      return await dataService.addCertificate(certificateData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateCertificate = useCallback(async (id, updates) => {
    try {
      return await dataService.updateCertificate(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const approveCertificate = useCallback(async (id, approverName, comment) => {
    try {
      return await dataService.approveCertificate(id, approverName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const rejectCertificate = useCallback(async (id, rejectorName, comment) => {
    try {
      return await dataService.rejectCertificate(id, rejectorName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Students
  const getAllStudents = useCallback(async () => {
    try {
      return await dataService.getAllStudents();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getStudentById = useCallback(async (id) => {
    try {
      return await dataService.getStudentById(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateStudent = useCallback(async (id, updates) => {
    try {
      return await dataService.updateStudent(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Faculty
  const getAllFaculty = useCallback(async () => {
    try {
      return await dataService.getAllFaculty();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getFacultyById = useCallback(async (id) => {
    try {
      return await dataService.getFacultyById(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateFaculty = useCallback(async (id, updates) => {
    try {
      return await dataService.updateFaculty(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Utility functions
  const getStatistics = useCallback(async () => {
    try {
      return await dataService.getStatistics();
    } catch (err) {
      setError(err);
      return {};
    }
  }, []);

  const searchEvents = useCallback(async (query) => {
    try {
      return await dataService.searchEvents(query);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const searchActivities = useCallback(async (query) => {
    try {
      return await dataService.searchActivities(query);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getEventsByStatus = useCallback(async (status) => {
    try {
      return await dataService.getEventsByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getActivitiesByStatus = useCallback(async (status) => {
    try {
      return await dataService.getActivitiesByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getCertificatesByStatus = useCallback(async (status) => {
    try {
      return await dataService.getCertificatesByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getEventsByOrganizer = useCallback(async (organizerName) => {
    try {
      return await dataService.getEventsByOrganizer(organizerName);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getActivitiesByStudent = useCallback(async (studentId) => {
    try {
      return await dataService.getActivitiesByStudent(studentId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getCertificatesByStudent = useCallback(async (studentId) => {
    try {
      return await dataService.getCertificatesByStudent(studentId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  // New data getters
  const getLandingData = useCallback(() => {
    try {
      return dataService.getLandingData();
    } catch (err) {
      setError(err);
      return {};
    }
  }, []);

  const getActivityTypes = useCallback(() => {
    try {
      return dataService.getActivityTypes();
    } catch (err) {
      setError(err);
      return {};
    }
  }, []);

  const getMenuItems = useCallback(() => {
    try {
      return dataService.getMenuItems();
    } catch (err) {
      setError(err);
      return {};
    }
  }, []);

  const getAnalytics = useCallback(async () => {
    try {
      const data = await dataService.getAnalytics();
      // Ensure all required arrays exist with fallbacks
      return {
        departmentStats: data.departmentStats || [],
        activityTypes: data.activityTypes || [],
        monthlyActivities: data.monthlyActivities || [],
        topPerformers: data.topPerformers || [],
        skillsAnalysis: data.skillsAnalysis || [],
        ...data
      };
    } catch (err) {
      setError(err);
      // Return safe default structure
      return {
        departmentStats: [],
        activityTypes: [],
        monthlyActivities: [],
        topPerformers: [],
        skillsAnalysis: []
      };
    }
  }, []);

  // Registration operations
  const getAllRegistrations = useCallback(async () => {
    try {
      return await dataService.getAllRegistrations();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getRegistrationsByEvent = useCallback(async (eventId) => {
    try {
      return await dataService.getRegistrationsByEvent(eventId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getRegistrationsByStudent = useCallback(async (studentId) => {
    try {
      return await dataService.getRegistrationsByStudent(studentId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addRegistration = useCallback(async (registrationData) => {
    try {
      return await dataService.addRegistration(registrationData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateRegistration = useCallback(async (registrationId, updates) => {
    try {
      return await dataService.updateRegistration(registrationId, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const cancelRegistration = useCallback(async (registrationId) => {
    try {
      return await dataService.cancelRegistration(registrationId);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const markAttendance = useCallback(async (registrationId, attendanceStatus) => {
    try {
      return await dataService.markAttendance(registrationId, attendanceStatus);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // Events
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Activities
    getAllActivities,
    addActivity,
    updateActivity,
    approveActivity,
    rejectActivity,
    
    // Certificates
    getAllCertificates,
    addCertificate,
    updateCertificate,
    approveCertificate,
    rejectCertificate,
    
    // Students
    getAllStudents,
    getStudentById,
    updateStudent,
    
    // Faculty
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    
    // Utility
    getStatistics,
    searchEvents,
    searchActivities,
    getEventsByStatus,
    getActivitiesByStatus,
    getCertificatesByStatus,
    getEventsByOrganizer,
    getActivitiesByStudent,
    getCertificatesByStudent,
    
    // New data getters
    getLandingData,
    getActivityTypes,
    getMenuItems,
    getAnalytics,
    
    // Registration operations
    getAllRegistrations,
    getRegistrationsByEvent,
    getRegistrationsByStudent,
    addRegistration,
    updateRegistration,
    cancelRegistration,
    markAttendance
  };
};
