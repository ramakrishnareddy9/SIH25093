// DataService.js - Wrapper service that delegates to ApiService for backend communication
// This maintains compatibility with existing components while using the new API service

import apiService from './ApiService.js';

class DataService {
  constructor() {
    this.apiService = apiService;
    this.subscribers = new Map();
    this.isLoaded = true; // Always loaded since we're using API calls
  }

  // Compatibility methods - no longer needed with API service
  loadFromStorage() {
    // No-op for API service
  }

  saveToStorage() {
    // No-op for API service
  }

  // Subscribe to data changes - delegate to API service
  subscribe(component, callback) {
    return this.apiService.subscribe(component, callback);
  }

  // Unsubscribe from data changes - delegate to API service
  unsubscribe(component) {
    return this.apiService.unsubscribe(component);
  }

  // Notify all subscribers of changes - delegate to API service
  notifySubscribers(changeType, data = null) {
    return this.apiService.notifySubscribers(changeType, data);
  }

  // EVENTS OPERATIONS - delegate to API service
  async getAllEvents() {
    return await this.apiService.getAllEvents();
  }

  async getEventById(id) {
    return await this.apiService.getEventById(id);
  }

  async addEvent(eventData) {
    return await this.apiService.addEvent(eventData);
  }

  async updateEvent(id, updates) {
    return await this.apiService.updateEvent(id, updates);
  }

  async deleteEvent(id) {
    return await this.apiService.deleteEvent(id);
  }

  // ACTIVITIES OPERATIONS - delegate to API service
  async getAllActivities() {
    return await this.apiService.getAllActivities();
  }

  async getActivityById(id) {
    return await this.apiService.getActivityById(id);
  }

  async addActivity(activityData) {
    return await this.apiService.addActivity(activityData);
  }

  async updateActivity(id, updates) {
    return await this.apiService.updateActivity(id, updates);
  }

  async approveActivity(id, approverName, comment = '') {
    return await this.apiService.approveActivity(id, approverName, comment);
  }

  async rejectActivity(id, rejectorName, comment = '') {
    return await this.apiService.rejectActivity(id, rejectorName, comment);
  }

  // CERTIFICATES OPERATIONS - delegate to API service
  async getAllCertificates() {
    return await this.apiService.getAllCertificates();
  }

  async getCertificateById(id) {
    return await this.apiService.getCertificateById(id);
  }

  async addCertificate(certificateData) {
    return await this.apiService.addCertificate(certificateData);
  }

  async updateCertificate(id, updates) {
    return await this.apiService.updateCertificate(id, updates);
  }

  async approveCertificate(id, approverName, comment = '') {
    return await this.apiService.approveCertificate(id, approverName, comment);
  }

  async rejectCertificate(id, rejectorName, comment = '') {
    return await this.apiService.rejectCertificate(id, rejectorName, comment);
  }

  // STUDENTS OPERATIONS - delegate to API service
  async getAllStudents() {
    return await this.apiService.getAllStudents();
  }

  async getStudentById(id) {
    return await this.apiService.getStudentById(id);
  }

  async updateStudent(id, updates) {
    return await this.apiService.updateStudent(id, updates);
  }

  // FACULTY OPERATIONS - delegate to API service
  async getAllFaculty() {
    return await this.apiService.getAllFaculty();
  }

  async getFacultyById(id) {
    return await this.apiService.getFacultyById(id);
  }

  async updateFaculty(id, updates) {
    return await this.apiService.updateFaculty(id, updates);
  }

  // ANALYTICS OPERATIONS - delegate to API service
  async getAnalytics() {
    return await this.apiService.getAnalytics();
  }

  // UTILITY METHODS - delegate to API service
  async getStatistics() {
    return await this.apiService.getStatistics();
  }

  // Search functionality - delegate to API service
  async searchEvents(query) {
    return await this.apiService.searchEvents(query);
  }

  async searchActivities(query) {
    return await this.apiService.searchActivities(query);
  }

  // Filter methods - delegate to API service
  async getEventsByStatus(status) {
    return await this.apiService.getEventsByStatus(status);
  }

  async getActivitiesByStatus(status) {
    return await this.apiService.getActivitiesByStatus(status);
  }

  async getCertificatesByStatus(status) {
    return await this.apiService.getCertificatesByStatus(status);
  }

  async getEventsByOrganizer(organizerName) {
    return await this.apiService.getEventsByOrganizer(organizerName);
  }

  async getActivitiesByStudent(studentId) {
    return await this.apiService.getActivitiesByStudent(studentId);
  }

  async getCertificatesByStudent(studentId) {
    return await this.apiService.getCertificatesByStudent(studentId);
  }

  // DATA GETTERS - delegate to API service
  getLandingData() {
    return this.apiService.getLandingData();
  }

  getActivityTypes() {
    return this.apiService.getActivityTypes();
  }

  getMenuItems() {
    return this.apiService.getMenuItems();
  }

  // REGISTRATION OPERATIONS - these may need to be added to backend API
  async getAllRegistrations() {
    // For now, return empty array until backend implements registrations
    return [];
  }

  async getRegistrationsByEvent(eventId) {
    // For now, return empty array until backend implements registrations
    return [];
  }

  async getRegistrationsByStudent(studentId) {
    // For now, return empty array until backend implements registrations
    return [];
  }

  async addRegistration(registrationData) {
    // For now, simulate registration until backend implements it
    console.warn('Registration functionality not yet implemented in backend API');
    return null;
  }

  async updateRegistration(registrationId, updates) {
    // For now, simulate update until backend implements it
    console.warn('Registration update functionality not yet implemented in backend API');
    return null;
  }

  async cancelRegistration(registrationId) {
    // For now, simulate cancellation until backend implements it
    console.warn('Registration cancellation functionality not yet implemented in backend API');
    return null;
  }

  async markAttendance(registrationId, attendanceStatus) {
    // For now, simulate attendance marking until backend implements it
    console.warn('Attendance marking functionality not yet implemented in backend API');
    return null;
  }

  // Check if data is loaded
  isDataLoaded() {
    return this.isLoaded;
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
