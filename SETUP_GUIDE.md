# Smart Student Hub - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### 1. Environment Setup

#### Backend Environment Variables
Create `BackEnd/server/.env` file with the following content:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://db_sih:12345@cluster1.uepik1b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
MONGODB_URI_TEST=mongodb://localhost:27017/eduflow_test
DB_NAME=eduflow
JWT_ACCESS_SECRET=4f8b9d7c6e2a1f0b3d5c7a8e1f9b6d4a
JWT_REFRESH_SECRET=4f8b9d7c6e2a1f0b3d5c7a8e1f9b6d4a_refresh
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
JWT_RESET_PASSWORD_EXPIRATION=10m
JWT_VERIFY_EMAIL_EXPIRATION=24h
JWT_ISSUER=smart-student-hub
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=noreply@smartstudenthub.com
EMAIL_PASSWORD=dummy_password_for_dev
EMAIL_FROM=Smart Student Hub <noreply@smartstudenthub.com>
SUPPORT_EMAIL=support@smartstudenthub.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
XSS_PROTECTION=true
NO_CACHE=true
LOG_LEVEL=info
SESSION_SECRET=4f8b9d7c6e2a1f0b3d5c7a8e1f9b6d4a_session
API_DOCS_PATH=/api-docs
UPLOAD_DIR=C:/Users/GANESH/Desktop/ganeshuploads
PDF_OUTPUT_DIR=C:/Users/GANESH/Desktop/ganesh/eduflow/server/pdfs
CLOUD_STORAGE=false
```

#### Frontend Environment Variables
Create `FrontEnd/.env` file with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Student Hub
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
```

### 2. Installation

#### Backend Setup
```bash
cd BackEnd/server
npm install
npm run dev
```

#### Frontend Setup
```bash
cd FrontEnd
npm install
npm run dev
```

### 3. Using the Development Script
Run the automated setup script:
```bash
# Windows
start-dev.bat
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users & Students
- `GET /api/users` - Get all users
- `GET /api/students` - Get all students
- `PUT /api/students/:id` - Update student

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Upload certificate
- `PUT /api/certificates/:id` - Update certificate

### Analytics
- `GET /api/analytics` - Get analytics data

## 🔧 Configuration Changes Made

### Backend Improvements
1. ✅ Enhanced MongoDB connection with cloud-optimized settings
2. ✅ Added comprehensive error handling for database connections
3. ✅ Improved connection timeout and retry logic
4. ✅ Added graceful shutdown handling

### Frontend Improvements
1. ✅ Added Vite proxy configuration for API calls
2. ✅ Environment variable support for API base URL
3. ✅ Enhanced build configuration with sourcemaps
4. ✅ Development logging for API service

### Development Experience
1. ✅ Created automated development startup script
2. ✅ Added environment variable examples
3. ✅ Improved CORS configuration
4. ✅ Enhanced error messages and debugging

## 🌐 URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/api

## 🔒 Security Features
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation
- Account lockout after failed attempts

## 📊 Database Schema
- **Users**: Comprehensive user profiles with achievements, education, projects
- **Activities**: Extracurricular activity tracking
- **Events**: Event management system
- **Certificates**: Digital certificate verification
- **Analytics**: Performance tracking

## 🚨 Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**: Check your MONGODB_URI in .env file
2. **CORS Errors**: Ensure CLIENT_URL matches your frontend URL
3. **Port Conflicts**: Change PORT in backend .env if 5000 is occupied
4. **Missing Dependencies**: Run `npm install` in both directories

### Environment Variables Missing
If you see validation errors, ensure all required environment variables are set in your .env files.
