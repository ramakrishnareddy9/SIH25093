// DataService.js - Centralized data management for JSON files
// This service simulates database operations by managing JSON data

class DataService {
  constructor() {
    this.data = {
      users: [],
      students: [],
      faculty: [],
      activities: [],
      events: [],
      certificates: [],
      analytics: {},
      landing: {},
      activityTypes: {},
      menuItems: {}
    };
    this.subscribers = new Map();
    this.isLoaded = false;
    this.loadAllData();
  }

  // Load all data from JSON files
  async loadAllData() {
    try {
      // Import all JSON files with individual error handling
      const loadFile = async (path, defaultValue = []) => {
        try {
          const module = await import(path);
          return module.default || defaultValue;
        } catch (error) {
          console.warn(`Failed to load ${path}:`, error);
          return defaultValue;
        }
      };

      const [usersData, studentsData, facultyData, activitiesData, eventsData, certificatesData, analyticsData, landingData, activityTypesData, menuItemsData] = await Promise.all([
        loadFile('../data/users.json', []),
        loadFile('../data/students.json', []),
        loadFile('../data/faculty.json', []),
        loadFile('../data/activities.json', []),
        loadFile('../data/events.json', []),
        loadFile('../data/certificates.json', []),
        loadFile('../data/analytics.json', {}),
        loadFile('../data/landing.json', {}),
        loadFile('../data/activityTypes.json', {}),
        loadFile('../data/menuItems.json', {})
      ]);

      this.data = {
        users: Array.isArray(usersData) ? [...usersData] : [],
        students: Array.isArray(studentsData) ? [...studentsData] : [],
        faculty: Array.isArray(facultyData) ? [...facultyData] : [],
        activities: Array.isArray(activitiesData) ? [...activitiesData] : [],
        events: Array.isArray(eventsData) ? [...eventsData] : [],
        certificates: Array.isArray(certificatesData) ? [...certificatesData] : [],
        analytics: typeof analyticsData === 'object' ? analyticsData : {},
        landing: typeof landingData === 'object' ? landingData : {},
        activityTypes: typeof activityTypesData === 'object' ? activityTypesData : {},
        menuItems: typeof menuItemsData === 'object' ? menuItemsData : {}
      };

      // Load any additional data from localStorage (for persistence simulation)
      this.loadFromStorage();
      
      // Mark as loaded
      this.isLoaded = true;
      
      // Notify all subscribers of data load
      this.notifySubscribers('dataLoaded');
      
      console.log('Data loaded successfully:', this.data);
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty data if loading fails
      this.data = {
        users: [],
        students: [],
        faculty: [],
        activities: [],
        events: [],
        certificates: [],
        analytics: {},
        landing: {},
        activityTypes: {},
        menuItems: {}
      };
      this.isLoaded = true; // Mark as loaded even if there were errors
    }
  }

  // Load additional data from localStorage
  loadFromStorage() {
    Object.keys(this.data).forEach(key => {
      const stored = localStorage.getItem(`${key}_updates`);
      if (stored) {
        const updates = JSON.parse(stored);
        if (key === 'analytics') {
          // Analytics is an object, not an array
          this.data[key] = { ...this.data[key], ...updates };
        } else if (Array.isArray(this.data[key])) {
          // Other data types are arrays
          this.data[key] = [...this.data[key], ...updates];
        }
      }
    });
  }

  // Save data to localStorage (simulates JSON file update)
  saveToStorage() {
    Object.keys(this.data).forEach(key => {
      localStorage.setItem(`${key}_data`, JSON.stringify(this.data[key]));
    });
  }

  // Subscribe to data changes
  subscribe(component, callback) {
    if (!this.subscribers.has(component)) {
      this.subscribers.set(component, []);
    }
    this.subscribers.get(component).push(callback);
  }

  // Unsubscribe from data changes
  unsubscribe(component) {
    this.subscribers.delete(component);
  }

  // Notify all subscribers of changes
  notifySubscribers(changeType, data = null) {
    this.subscribers.forEach((callbacks, component) => {
      callbacks.forEach(callback => {
        callback(changeType, data);
      });
    });
  }

  // EVENTS OPERATIONS
  getAllEvents() {
    return [...this.data.events];
  }

  getEventById(id) {
    return this.data.events.find(event => event.id === id);
  }

  addEvent(eventData) {
    const newEvent = {
      id: `EVT${Date.now()}${Math.random().toString(36).substr(2, 3)}`,
      ...eventData,
      createdDate: new Date().toISOString(),
      status: 'open',
      registrationCount: 0
    };
    
    this.data.events.push(newEvent);
    this.saveToStorage();
    this.notifySubscribers('eventAdded', newEvent);
    return newEvent;
  }

  updateEvent(id, updates) {
    const index = this.data.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.data.events[index] = { ...this.data.events[index], ...updates };
      this.saveToStorage();
      this.notifySubscribers('eventUpdated', this.data.events[index]);
      return this.data.events[index];
    }
    return null;
  }

  deleteEvent(id) {
    const index = this.data.events.findIndex(event => event.id === id);
    if (index !== -1) {
      const deletedEvent = this.data.events.splice(index, 1)[0];
      this.saveToStorage();
      this.notifySubscribers('eventDeleted', deletedEvent);
      return deletedEvent;
    }
    return null;
  }

  // ACTIVITIES OPERATIONS
  getAllActivities() {
    return [...this.data.activities];
  }

  getActivityById(id) {
    return this.data.activities.find(activity => activity.id === id);
  }

  addActivity(activityData) {
    const newActivity = {
      id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 3)}`,
      ...activityData,
      submissionDate: new Date().toISOString(),
      status: 'pending'
    };
    
    this.data.activities.push(newActivity);
    this.saveToStorage();
    this.notifySubscribers('activityAdded', newActivity);
    return newActivity;
  }

  updateActivity(id, updates) {
    const index = this.data.activities.findIndex(activity => activity.id === id);
    if (index !== -1) {
      this.data.activities[index] = { ...this.data.activities[index], ...updates };
      this.saveToStorage();
      this.notifySubscribers('activityUpdated', this.data.activities[index]);
      return this.data.activities[index];
    }
    return null;
  }

  approveActivity(id, approverName, comment = '') {
    return this.updateActivity(id, {
      status: 'approved',
      approvedBy: approverName,
      approvalDate: new Date().toISOString(),
      approvalComment: comment
    });
  }

  rejectActivity(id, rejectorName, comment = '') {
    return this.updateActivity(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectionDate: new Date().toISOString(),
      rejectionComment: comment
    });
  }

  // CERTIFICATES OPERATIONS
  getAllCertificates() {
    return [...this.data.certificates];
  }

  getCertificateById(id) {
    return this.data.certificates.find(cert => cert.id === id);
  }

  addCertificate(certificateData) {
    const newCertificate = {
      id: `CERT${Date.now()}${Math.random().toString(36).substr(2, 3)}`,
      ...certificateData,
      uploadDate: new Date().toISOString(),
      status: 'pending'
    };
    
    this.data.certificates.push(newCertificate);
    this.saveToStorage();
    this.notifySubscribers('certificateAdded', newCertificate);
    return newCertificate;
  }

  updateCertificate(id, updates) {
    const index = this.data.certificates.findIndex(cert => cert.id === id);
    if (index !== -1) {
      this.data.certificates[index] = { ...this.data.certificates[index], ...updates };
      this.saveToStorage();
      this.notifySubscribers('certificateUpdated', this.data.certificates[index]);
      return this.data.certificates[index];
    }
    return null;
  }

  approveCertificate(id, approverName, comment = '') {
    return this.updateCertificate(id, {
      status: 'approved',
      approvedBy: approverName,
      approvalDate: new Date().toISOString(),
      approvalComment: comment
    });
  }

  rejectCertificate(id, rejectorName, comment = '') {
    return this.updateCertificate(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectionDate: new Date().toISOString(),
      rejectionComment: comment
    });
  }

  // STUDENTS OPERATIONS
  getAllStudents() {
    return [...this.data.students];
  }

  getStudentById(id) {
    return this.data.students.find(student => student.id === id);
  }

  updateStudent(id, updates) {
    const index = this.data.students.findIndex(student => student.id === id);
    if (index !== -1) {
      this.data.students[index] = { ...this.data.students[index], ...updates };
      this.saveToStorage();
      this.notifySubscribers('studentUpdated', this.data.students[index]);
      return this.data.students[index];
    }
    return null;
  }

  // FACULTY OPERATIONS
  getAllFaculty() {
    return [...this.data.faculty];
  }

  getFacultyById(id) {
    return this.data.faculty.find(faculty => faculty.id === id);
  }

  updateFaculty(id, updates) {
    const index = this.data.faculty.findIndex(faculty => faculty.id === id);
    if (index !== -1) {
      this.data.faculty[index] = { ...this.data.faculty[index], ...updates };
      this.saveToStorage();
      this.notifySubscribers('facultyUpdated', this.data.faculty[index]);
      return this.data.faculty[index];
    }
    return null;
  }

  // ANALYTICS OPERATIONS
  getAnalytics() {
    return { ...this.data.analytics };
  }

  updateAnalytics(updates) {
    this.data.analytics = { ...this.data.analytics, ...updates };
    this.saveToStorage();
    this.notifySubscribers('analyticsUpdated', this.data.analytics);
    return this.data.analytics;
  }

  // UTILITY METHODS
  getStatistics() {
    return {
      totalEvents: this.data.events.length,
      totalActivities: this.data.activities.length,
      totalCertificates: this.data.certificates.length,
      totalStudents: this.data.students.length,
      totalFaculty: this.data.faculty.length,
      pendingActivities: this.data.activities.filter(a => a.status === 'pending').length,
      approvedActivities: this.data.activities.filter(a => a.status === 'approved').length,
      pendingCertificates: this.data.certificates.filter(c => c.status === 'pending').length,
      approvedCertificates: this.data.certificates.filter(c => c.status === 'approved').length,
      openEvents: this.data.events.filter(e => e.status === 'open').length
    };
  }

  // Search functionality
  searchEvents(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  searchActivities(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.activities.filter(activity =>
      activity.title.toLowerCase().includes(lowerQuery) ||
      activity.description.toLowerCase().includes(lowerQuery) ||
      activity.type.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter methods
  getEventsByStatus(status) {
    return this.data.events.filter(event => event.status === status);
  }

  getActivitiesByStatus(status) {
    return this.data.activities.filter(activity => activity.status === status);
  }

  getCertificatesByStatus(status) {
    return this.data.certificates.filter(cert => cert.status === status);
  }

  getEventsByOrganizer(organizerName) {
    return this.data.events.filter(event => 
      event.organizer.name.toLowerCase().includes(organizerName.toLowerCase()) ||
      event.createdBy?.toLowerCase().includes(organizerName.toLowerCase())
    );
  }

  getActivitiesByStudent(studentId) {
    return this.data.activities.filter(activity => activity.studentId === studentId);
  }

  getCertificatesByStudent(studentId) {
    return this.data.certificates.filter(cert => cert.studentId === studentId);
  }

  // NEW DATA GETTERS
  getLandingData() {
    return { ...this.data.landing };
  }

  getActivityTypes() {
    return { ...this.data.activityTypes };
  }

  getMenuItems() {
    return { ...this.data.menuItems };
  }

  // Check if data is loaded
  isDataLoaded() {
    return this.isLoaded;
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
