import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/ApiService';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const determineRoleFromEmail = (email) => {
    if (email.includes('@student.')) {
      return 'student';
    } else if (email.includes('@faculty.')) {
      return 'faculty';
    } else if (email.includes('@admin.') || email === 'admin@college.edu') {
      return 'admin';
    }
    // Default role based on email domain patterns
    const domain = email.split('@')[1];
    if (domain && domain.includes('student')) {
      return 'student';
    } else if (domain && domain.includes('faculty')) {
      return 'faculty';
    }
    return 'student'; // Default to student
  };

  const getUserProfile = async (userData) => {
    try {
      if (userData.role === 'student' && userData.studentId) {
        return await apiService.getStudentById(userData.studentId);
      } else if (userData.role === 'faculty' && userData.facultyId) {
        return await apiService.getFacultyById(userData.facultyId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Use API service to authenticate
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data.user) {
        const userData = response.data.user;
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        return { success: true, redirectTo: '/app/dashboard', user: userData };
      } else {
        return { success: false, error: response.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      const { email, password, name, confirmPassword } = userData;

      // Validate password match
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Determine role from email
      const role = determineRoleFromEmail(email);

      // Create registration data
      const registrationData = {
        email: email.toLowerCase(),
        password: password,
        name: name,
        role: role
      };

      // Use API service to register
      const response = await apiService.register(registrationData);
      
      if (response.success && response.data.user) {
        const newUser = response.data.user;
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        return { success: true, user: newUser };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
