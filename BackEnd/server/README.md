# EduFlow - Server

This is the backend API for the EduFlow online learning platform, built with Node.js, Express, and MongoDB. This backend provides a robust, secure, and scalable API for the EduFlow e-learning platform.

## 🚀 Features

- **Enhanced Security**
  - JWT-based authentication with refresh tokens
  - Role-based access control (RBAC)
  - Rate limiting and request validation
  - Helmet.js for secure HTTP headers
  - CSRF protection
  - XSS protection
  - SQL/NoSQL injection prevention
  - Secure session management

- **Robust Architecture**
  - MVC pattern
  - Middleware-based request processing
  - Environment-based configuration
  - Centralized error handling
  - Request validation
  - API versioning

- **Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Role-based authorization (admin/student)
  - Email & password login with bcrypt encryption
  - "Remember me" functionality with extended token expiry

- **Course Management**
  - Course CRUD operations
  - Module and lesson management
  - Media upload and storage
  - Pagination and filtering
  - Search functionality

- **User Management**
  - User profiles and preferences
  - Avatar upload and management
  - Role management
  - Student enrollment tracking

- **Progress Tracking**
  - Course completion status
  - Lesson progress
  - Quiz results
  - Certificate generation

- **Certificate System**
  - Automatic certificate generation
  - Certificate verification endpoints
  - Certificate PDF data endpoints
  - Certificate management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/google` - Login with Google
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/admin` - Get all courses (admin only)
- `GET /api/courses/enrolled` - Get user's enrolled courses
- `GET /api/courses/:id` - Get a single course
- `POST /api/courses` - Create a new course (admin only)
- `PUT /api/courses/:id` - Update a course (admin only)
- `DELETE /api/courses/:id` - Delete a course (admin only)
- `POST /api/courses/enroll/:id` - Enroll in a course
- `PUT /api/courses/complete/:id` - Mark a course as completed
- `PUT /api/courses/progress/:id` - Update course progress
- `POST /api/courses/quiz/:courseId/:quizId` - Submit quiz result

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/avatar` - Upload user avatar
- `DELETE /api/users/avatar` - Remove user avatar
- `GET /api/users/student/dashboard-stats` - Get student dashboard stats
- `GET /api/users/admin/dashboard-stats` - Get admin dashboard stats
- `GET /api/users/certificates` - Get user certificates
- `GET /api/users/recent-students` - Get recent students (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

### Certificates
- `GET /api/certificates/verify/:id` - Verify a certificate
- `GET /api/certificates/:id` - Get certificate details

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt, Firebase Admin SDK
- **Validation**: Joi, express-validator
- **Security**: Helmet, xss-clean, express-mongo-sanitize, hpp
- **Logging**: Winston
- **File Upload**: multer, Cloudinary
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Development**: Nodemon, ESLint, Prettier
- **Containerization**: Docker

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB (v5.0+)
- npm (v8.0+)
- Firebase project (for Google auth)
- Cloudinary account (for file storage)

### ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/eduflow
MONGODB_URI_TEST=mongodb://localhost:27017/eduflow_test

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@eduflow.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Firebase Admin (for Google Auth)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
```

### 🛠️ Installation

1. Clone the repository and navigate to the server directory:
   ```bash
   git clone https://github.com/yourusername/eduflow.git
   cd eduflow/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY="your_private_key"
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=your_client_cert_url
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. For production
   ```bash
   npm start
   ```

## Database Models

### User
- Basic info (name, email, password)
- Role (admin/student)
- Enrolled courses with progress
- Profile settings and preferences
- Certificates earned

### Course
- Basic info (title, description, thumbnail)
- Instructor information
- Modules and lessons
- Learning points
- Categories and metadata

### Category
- Name
- Courses count
- Description

### Module
- Title
- Description
- Lessons
- Order

### Lesson
- Title
- Type (video, quiz, text)
- Content
- Duration
- Order

### Certificate
- Course ID
- Student ID
- Issue date
- Certificate number
- Verification status

## Development

### Folder Structure
```
server/
├── src/
│   ├── middleware/     # Express middleware
│   │   ├── auth.js     # Authentication middleware
│   │   └── upload.js   # File upload middleware
│   │
│   ├── models/         # Mongoose models
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Category.js
│   │
│   ├── routes/         # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── users.js
│   │   └── categories.js
│   │
│   ├── seeders/        # Database seed scripts
│   │   ├── coursesSeeder.js
│   │   └── usersSeeder.js
│   │
│   └── index.js        # Express app setup
│
├── .env                # Environment variables
└── package.json        # Dependencies and scripts
```

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Run database seeders 