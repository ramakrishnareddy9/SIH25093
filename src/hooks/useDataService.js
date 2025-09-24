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
  const getAllEvents = useCallback(() => {
    try {
      return dataService.getAllEvents();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addEvent = useCallback((eventData) => {
    try {
      return dataService.addEvent(eventData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateEvent = useCallback((id, updates) => {
    try {
      return dataService.updateEvent(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const deleteEvent = useCallback((id) => {
    try {
      return dataService.deleteEvent(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Activities
  const getAllActivities = useCallback(() => {
    try {
      return dataService.getAllActivities();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addActivity = useCallback((activityData) => {
    try {
      return dataService.addActivity(activityData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateActivity = useCallback((id, updates) => {
    try {
      return dataService.updateActivity(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const approveActivity = useCallback((id, approverName, comment) => {
    try {
      return dataService.approveActivity(id, approverName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const rejectActivity = useCallback((id, rejectorName, comment) => {
    try {
      return dataService.rejectActivity(id, rejectorName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Certificates
  const getAllCertificates = useCallback(() => {
    try {
      return dataService.getAllCertificates();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addCertificate = useCallback((certificateData) => {
    try {
      return dataService.addCertificate(certificateData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateCertificate = useCallback((id, updates) => {
    try {
      return dataService.updateCertificate(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const approveCertificate = useCallback((id, approverName, comment) => {
    try {
      return dataService.approveCertificate(id, approverName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const rejectCertificate = useCallback((id, rejectorName, comment) => {
    try {
      return dataService.rejectCertificate(id, rejectorName, comment);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Students
  const getAllStudents = useCallback(() => {
    try {
      return dataService.getAllStudents();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getStudentById = useCallback((id) => {
    try {
      return dataService.getStudentById(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateStudent = useCallback((id, updates) => {
    try {
      return dataService.updateStudent(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Faculty
  const getAllFaculty = useCallback(() => {
    try {
      return dataService.getAllFaculty();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getFacultyById = useCallback((id) => {
    try {
      return dataService.getFacultyById(id);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateFaculty = useCallback((id, updates) => {
    try {
      return dataService.updateFaculty(id, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  // Utility functions
  const getStatistics = useCallback(() => {
    try {
      return dataService.getStatistics();
    } catch (err) {
      setError(err);
      return {};
    }
  }, []);

  const searchEvents = useCallback((query) => {
    try {
      return dataService.searchEvents(query);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const searchActivities = useCallback((query) => {
    try {
      return dataService.searchActivities(query);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getEventsByStatus = useCallback((status) => {
    try {
      return dataService.getEventsByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getActivitiesByStatus = useCallback((status) => {
    try {
      return dataService.getActivitiesByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getCertificatesByStatus = useCallback((status) => {
    try {
      return dataService.getCertificatesByStatus(status);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getEventsByOrganizer = useCallback((organizerName) => {
    try {
      return dataService.getEventsByOrganizer(organizerName);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getActivitiesByStudent = useCallback((studentId) => {
    try {
      return dataService.getActivitiesByStudent(studentId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getCertificatesByStudent = useCallback((studentId) => {
    try {
      return dataService.getCertificatesByStudent(studentId);
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

  const getAnalytics = useCallback(() => {
    try {
      const data = dataService.getAnalytics();
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
  const getAllRegistrations = useCallback(() => {
    try {
      return dataService.getAllRegistrations();
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getRegistrationsByEvent = useCallback((eventId) => {
    try {
      return dataService.getRegistrationsByEvent(eventId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const getRegistrationsByStudent = useCallback((studentId) => {
    try {
      return dataService.getRegistrationsByStudent(studentId);
    } catch (err) {
      setError(err);
      return [];
    }
  }, []);

  const addRegistration = useCallback((registrationData) => {
    try {
      return dataService.addRegistration(registrationData);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateRegistration = useCallback((registrationId, updates) => {
    try {
      return dataService.updateRegistration(registrationId, updates);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const cancelRegistration = useCallback((registrationId) => {
    try {
      return dataService.cancelRegistration(registrationId);
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const markAttendance = useCallback((registrationId, attendanceStatus) => {
    try {
      return dataService.markAttendance(registrationId, attendanceStatus);
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
