// ApiService.js - Centralized API service for backend communication
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.subscribers = new Map();
    this.isLoaded = false;
    this.authToken = null;
    
    // Load auth token from localStorage if available
    this.loadAuthToken();
  }

  // Load authentication token from localStorage
  loadAuthToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authToken = token;
    }
  }

  // Set authentication token
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  // Generic API request method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
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

  // AUTHENTICATION METHODS
  async login(credentials) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.success && response.data.token) {
        this.setAuthToken(response.data.token);
        this.notifySubscribers('userLoggedIn', response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setAuthToken(null);
      this.notifySubscribers('userLoggedOut');
    }
  }

  // EVENTS METHODS
  async getAllEvents() {
    try {
      const response = await this.makeRequest('/events');
      return response.data || [];
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  }

  async getEventById(id) {
    try {
      const response = await this.makeRequest(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get event error:', error);
      return null;
    }
  }

  async addEvent(eventData) {
    try {
      const response = await this.makeRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      
      if (response.success) {
        this.notifySubscribers('eventAdded', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Add event error:', error);
      throw error;
    }
  }

  async updateEvent(id, updates) {
    try {
      const response = await this.makeRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success) {
        this.notifySubscribers('eventUpdated', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      const response = await this.makeRequest(`/events/${id}`, {
        method: 'DELETE',
      });
      
      if (response.success) {
        this.notifySubscribers('eventDeleted', { id });
      }
      
      return response.data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }

  // ACTIVITIES METHODS
  async getAllActivities() {
    try {
      const response = await this.makeRequest('/activities');
      return response.data || [];
    } catch (error) {
      console.error('Get activities error:', error);
      return [];
    }
  }

  async getActivityById(id) {
    try {
      const response = await this.makeRequest(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get activity error:', error);
      return null;
    }
  }

  async addActivity(activityData) {
    try {
      const response = await this.makeRequest('/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
      });
      
      if (response.success) {
        this.notifySubscribers('activityAdded', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Add activity error:', error);
      throw error;
    }
  }

  async updateActivity(id, updates) {
    try {
      const response = await this.makeRequest(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success) {
        this.notifySubscribers('activityUpdated', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  }

  async approveActivity(id, approverName, comment = '') {
    return this.updateActivity(id, {
      status: 'approved',
      approvedBy: approverName,
      approvalDate: new Date().toISOString(),
      approvalComment: comment
    });
  }

  async rejectActivity(id, rejectorName, comment = '') {
    return this.updateActivity(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectionDate: new Date().toISOString(),
      rejectionComment: comment
    });
  }

  // STUDENTS METHODS
  async getAllStudents() {
    try {
      const response = await this.makeRequest('/students');
      return response.data?.students || [];
    } catch (error) {
      console.error('Get students error:', error);
      return [];
    }
  }

  async getStudentById(id) {
    try {
      const response = await this.makeRequest(`/students/${id}`);
      return response.data?.student;
    } catch (error) {
      console.error('Get student error:', error);
      return null;
    }
  }

  async updateStudent(id, updates) {
    try {
      const response = await this.makeRequest(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success) {
        this.notifySubscribers('studentUpdated', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  // FACULTY METHODS
  async getAllFaculty() {
    try {
      const response = await this.makeRequest('/faculty');
      return response.data?.faculty || [];
    } catch (error) {
      console.error('Get faculty error:', error);
      return [];
    }
  }

  async getFacultyById(id) {
    try {
      const response = await this.makeRequest(`/faculty/${id}`);
      return response.data?.faculty;
    } catch (error) {
      console.error('Get faculty error:', error);
      return null;
    }
  }

  async updateFaculty(id, updates) {
    try {
      const response = await this.makeRequest(`/faculty/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success) {
        this.notifySubscribers('facultyUpdated', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update faculty error:', error);
      throw error;
    }
  }

  // CERTIFICATES METHODS
  async getAllCertificates() {
    try {
      const response = await this.makeRequest('/certificates');
      return response.data || [];
    } catch (error) {
      console.error('Get certificates error:', error);
      return [];
    }
  }

  async getCertificateById(id) {
    try {
      const response = await this.makeRequest(`/certificates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get certificate error:', error);
      return null;
    }
  }

  async addCertificate(certificateData) {
    try {
      const response = await this.makeRequest('/certificates', {
        method: 'POST',
        body: JSON.stringify(certificateData),
      });
      
      if (response.success) {
        this.notifySubscribers('certificateAdded', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Add certificate error:', error);
      throw error;
    }
  }

  async updateCertificate(id, updates) {
    try {
      const response = await this.makeRequest(`/certificates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success) {
        this.notifySubscribers('certificateUpdated', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update certificate error:', error);
      throw error;
    }
  }

  async approveCertificate(id, approverName, comment = '') {
    return this.updateCertificate(id, {
      status: 'approved',
      approvedBy: approverName,
      approvalDate: new Date().toISOString(),
      approvalComment: comment
    });
  }

  async rejectCertificate(id, rejectorName, comment = '') {
    return this.updateCertificate(id, {
      status: 'rejected',
      rejectedBy: rejectorName,
      rejectionDate: new Date().toISOString(),
      rejectionComment: comment
    });
  }

  // ANALYTICS METHODS
  async getAnalytics() {
    try {
      const response = await this.makeRequest('/analytics');
      return response.data || {};
    } catch (error) {
      console.error('Get analytics error:', error);
      return {};
    }
  }

  // UTILITY METHODS
  async getStatistics() {
    try {
      const [events, activities, certificates, students, faculty] = await Promise.all([
        this.getAllEvents(),
        this.getAllActivities(),
        this.getAllCertificates(),
        this.getAllStudents(),
        this.getAllFaculty()
      ]);

      return {
        totalEvents: events.length,
        totalActivities: activities.length,
        totalCertificates: certificates.length,
        totalStudents: students.length,
        totalFaculty: faculty.length,
        pendingActivities: activities.filter(a => a.status === 'pending').length,
        approvedActivities: activities.filter(a => a.status === 'approved').length,
        pendingCertificates: certificates.filter(c => c.status === 'pending').length,
        approvedCertificates: certificates.filter(c => c.status === 'approved').length,
        openEvents: events.filter(e => e.status === 'open').length
      };
    } catch (error) {
      console.error('Get statistics error:', error);
      return {};
    }
  }

  // Search functionality
  async searchEvents(query) {
    try {
      const response = await this.makeRequest(`/events/search?q=${encodeURIComponent(query)}`);
      return response.data || [];
    } catch (error) {
      // Fallback to client-side search if backend doesn't support search
      const events = await this.getAllEvents();
      const lowerQuery = query.toLowerCase();
      return events.filter(event =>
        event.title?.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
  }

  async searchActivities(query) {
    try {
      const response = await this.makeRequest(`/activities/search?q=${encodeURIComponent(query)}`);
      return response.data || [];
    } catch (error) {
      // Fallback to client-side search if backend doesn't support search
      const activities = await this.getAllActivities();
      const lowerQuery = query.toLowerCase();
      return activities.filter(activity =>
        activity.title?.toLowerCase().includes(lowerQuery) ||
        activity.description?.toLowerCase().includes(lowerQuery) ||
        activity.type?.toLowerCase().includes(lowerQuery)
      );
    }
  }

  // Filter methods
  async getEventsByStatus(status) {
    const events = await this.getAllEvents();
    return events.filter(event => event.status === status);
  }

  async getActivitiesByStatus(status) {
    const activities = await this.getAllActivities();
    return activities.filter(activity => activity.status === status);
  }

  async getCertificatesByStatus(status) {
    const certificates = await this.getAllCertificates();
    return certificates.filter(cert => cert.status === status);
  }

  async getEventsByOrganizer(organizerName) {
    const events = await this.getAllEvents();
    return events.filter(event => 
      event.organizer?.name?.toLowerCase().includes(organizerName.toLowerCase()) ||
      event.createdBy?.toLowerCase().includes(organizerName.toLowerCase())
    );
  }

  async getActivitiesByStudent(studentId) {
    try {
      const response = await this.makeRequest(`/students/${studentId}/activities`);
      return response.data || [];
    } catch (error) {
      console.error('Get student activities error:', error);
      return [];
    }
  }

  async getCertificatesByStudent(studentId) {
    try {
      const response = await this.makeRequest(`/students/${studentId}/certificates`);
      return response.data || [];
    } catch (error) {
      console.error('Get student certificates error:', error);
      return [];
    }
  }

  // Mock data getters for compatibility (can be removed once all components are updated)
  getLandingData() {
    return {
      heroTitle: "Smart Student Hub",
      heroSubtitle: "Empowering students with intelligent learning solutions",
      features: [
        "Track Academic Progress",
        "Manage Certificates",
        "Join Events & Activities",
        "Connect with Faculty"
      ]
    };
  }

  getActivityTypes() {
    return {
      assignment: "Assignment",
      quiz: "Quiz",
      lab: "Lab Work",
      exam: "Examination",
      presentation: "Presentation",
      review: "Code Review",
      research: "Research",
      project: "Project"
    };
  }

  getMenuItems() {
    return {
      student: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { id: 'events', label: 'Events', path: '/events' },
        { id: 'activities', label: 'Activities', path: '/activities' },
        { id: 'certificates', label: 'Certificates', path: '/certificates' },
        { id: 'profile', label: 'Profile', path: '/profile' }
      ],
      faculty: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
        { id: 'students', label: 'Students', path: '/students' },
        { id: 'events', label: 'Events', path: '/events' },
        { id: 'activities', label: 'Activities', path: '/activities' },
        { id: 'analytics', label: 'Analytics', path: '/analytics' }
      ]
    };
  }

  // Check if data is loaded (for compatibility)
  isDataLoaded() {
    return true; // API service is always "loaded"
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
