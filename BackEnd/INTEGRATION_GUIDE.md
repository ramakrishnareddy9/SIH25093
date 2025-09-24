# Frontend-Backend Integration Guide

## Overview
This guide documents the complete integration between the React frontend and Express.js backend for the Smart Student Hub application.

## Architecture

### Frontend (React + Vite)
- **Port**: 3000
- **Framework**: React 18 with Material-UI
- **Build Tool**: Vite
- **State Management**: React Context API
- **Routing**: React Router v6

### Backend (Express.js)
- **Port**: 5000
- **Framework**: Express.js with MongoDB
- **Authentication**: JWT tokens
- **Database**: MongoDB with Mongoose

## Key Integration Components

### 1. API Service Layer (`/client/src/services/`)
- **`api.js`**: Base API service with request/response handling
- **`authService.js`**: Authentication-specific API calls
- **`userService.js`**: User management API calls
- **`courseService.js`**: Course-related API calls
- **`activityService.js`**: Activity management API calls
- **`certificateService.js`**: Certificate generation API calls

### 2. Authentication Flow
```javascript
// Login Process
1. User submits credentials → Frontend AuthContext
2. AuthContext → authService.login()
3. authService → API call to /api/auth/login
4. Backend validates credentials → Returns JWT token
5. Frontend stores token → Updates auth state
```

### 3. Configuration Files

#### Frontend Environment (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Student Hub
VITE_APP_VERSION=1.0.0
```

#### Backend Environment (`.env`)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
JWT_ACCESS_SECRET=4f8b9d7c6e2a1f0b3d5c7a8e1f9b6d4a
```

#### Vite Proxy Configuration (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## API Endpoints

### Authentication Routes (`/api/auth/`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation

### User Routes (`/api/users/`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /profile/picture` - Upload profile picture

### Course Routes (`/api/courses/`)
- `GET /` - Get all courses
- `GET /:id` - Get course by ID
- `POST /` - Create new course (faculty/admin)
- `PUT /:id` - Update course (faculty/admin)
- `DELETE /:id` - Delete course (faculty/admin)

## Features Implemented

### ✅ Completed Features
1. **API Service Layer**: Complete service layer for all API calls
2. **Authentication Integration**: JWT-based auth with token storage
3. **CORS Configuration**: Proper cross-origin setup
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Offline Support**: Fallback to local data when offline
6. **Connection Status**: Visual indicator for online/offline status
7. **Development Scripts**: Easy startup scripts for both servers

### 🔄 Hybrid Mode (Online/Offline)
The application supports both online and offline modes:
- **Online**: Uses backend APIs for all operations
- **Offline**: Falls back to local JSON data files
- **Auto-detection**: Automatically switches based on network status

## Development Workflow

### Starting the Application
```bash
# Option 1: Use the provided scripts
.\start-dev.bat          # Windows Batch
.\start-dev.ps1          # PowerShell

# Option 2: Manual startup
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Base**: http://localhost:5000/api

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **CORS Protection**: Configured for specific origins
3. **Input Validation**: Server-side validation using express-validator
4. **Password Hashing**: bcryptjs for secure password storage
5. **Rate Limiting**: Protection against brute force attacks

## Error Handling

### Frontend Error Handling
```javascript
// API Service automatically handles:
- Network errors
- HTTP status codes
- Token expiration
- Server errors

// User-friendly error messages displayed in UI
```

### Backend Error Handling
```javascript
// Centralized error handling middleware
- Validation errors
- Authentication errors  
- Database errors
- Server errors
```

## Testing the Integration

### 1. Registration Flow
1. Navigate to `/signup`
2. Fill in user details
3. Submit form
4. Check network tab for API call to `/api/auth/register`
5. Verify user is redirected to dashboard

### 2. Login Flow
1. Navigate to `/login`
2. Use demo credentials or registered user
3. Submit form
4. Check network tab for API call to `/api/auth/login`
5. Verify JWT token is stored in localStorage
6. Verify user is redirected to dashboard

### 3. Protected Routes
1. Try accessing `/app/dashboard` without login
2. Should redirect to login page
3. After login, should access dashboard successfully

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CORS_ORIGIN` in backend `.env`
   - Ensure frontend URL matches CORS configuration

2. **JWT Token Issues**
   - Verify `JWT_ACCESS_SECRET` is set in backend `.env`
   - Check token storage in browser localStorage

3. **Database Connection**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in backend `.env`

4. **Port Conflicts**
   - Frontend: Default port 3000
   - Backend: Default port 5000
   - Change ports in respective config files if needed

### Debug Mode
Enable debug logging by setting:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## Next Steps

### Recommended Enhancements
1. **Real-time Features**: WebSocket integration for live updates
2. **File Upload**: Enhanced file handling for documents/images
3. **Push Notifications**: Browser notifications for important events
4. **PWA Features**: Service worker for offline functionality
5. **Testing**: Unit and integration tests for both frontend and backend

## Support

For issues or questions:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure both servers are running
4. Check network connectivity between frontend and backend

---

**Last Updated**: September 22, 2025
**Version**: 1.0.0
