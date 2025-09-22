import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';
import studentsData from '../data/students.json';
import facultyData from '../data/faculty.json';

const AuthContext = createContext();

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

  const getUserProfile = (userData) => {
    if (userData.role === 'student' && userData.studentId) {
      return studentsData.find(student => student.id === userData.studentId);
    } else if (userData.role === 'faculty' && userData.facultyId) {
      return facultyData.find(faculty => faculty.id === userData.facultyId);
    }
    return null;
  };

  const login = async (email, password) => {
    try {
      // Find user in the users data
      const foundUser = usersData.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (foundUser && foundUser.isActive) {
        // Simulate login success
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: email,
          role: foundUser.role,
          studentId: foundUser.studentId,
          profile: foundUser.profile
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true, redirectTo: '/app/dashboard', user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (userData) => {
    try {
      const { email, password, name, confirmPassword } = userData;

      // Validate password match
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Check if user already exists
      const existingUser = usersData.find(
        user => user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Determine role from email
      const role = determineRoleFromEmail(email);

      // Create new user object
      const newUser = {
        id: `USR${String(usersData.length + 1).padStart(3, '0')}`,
        email: email.toLowerCase(),
        password: password, // In production, this should be hashed
        role: role,
        name: name,
        isActive: true,
        lastLogin: new Date().toISOString(),
        studentId: role === 'student' ? `STU${String(usersData.length + 1).padStart(3, '0')}` : null,
        facultyId: role === 'faculty' ? `FAC${String(usersData.length + 1).padStart(3, '0')}` : null
      };

      // In a real application, you would save this to a database
      // For now, we'll just simulate successful registration
      
      const userDataWithProfile = {
        ...newUser,
        profile: null // New users won't have profile data initially
      };

      setUser(userDataWithProfile);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(userDataWithProfile));
      
      return { success: true, user: userDataWithProfile };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
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
    determineRoleFromEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
