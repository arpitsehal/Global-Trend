# Task Management Application

A full-stack task management web application built with React, Node.js, Express, and MongoDB. This application allows users to create, view, update, and delete tasks with authentication, filtering, and search capabilities.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Register, login, and secure JWT-based authentication
- ✅ **Task CRUD Operations** - Create, read, update, and delete tasks
- ✅ **Task Management** - Set title, description, status, priority, and due dates
- ✅ **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- ✅ **Search & Filtering** - Filter tasks by status, priority, and search terms
- ✅ **Dashboard** - Overview with task statistics and recent tasks
- ✅ **Pagination** - Efficient handling of large task lists

### Bonus Features Implemented
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔍 **Advanced Filtering** - Multi-criteria task filtering
- 📊 **Task Statistics** - Visual overview of task distribution
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🧪 **Testing** - Comprehensive unit and integration tests
- 📚 **API Documentation** - Complete REST API documentation
- 🚀 **Deployment Ready** - Production-ready configuration

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Notification system
- **Lucide React** - Beautiful icons
- **Date-fns** - Date manipulation utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion testing
- **React Testing Library** - React component testing
- **Concurrently** - Run multiple scripts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn** (v1.22 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend and backend)
npm run install-all
```

Or install manually:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note:** Replace `your-super-secret-jwt-key-change-this-in-production` with a secure random string for production.

### 4. Database Setup

#### Option A: Local MongoDB

Ensure MongoDB is running on your system:

```bash
# Start MongoDB (varies by installation)
mongod
```

#### Option B: MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster-url/taskmanagement?retryWrites=true&w=majority
```

### 5. Run the Application

#### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

#### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
task-management-app/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── tests/           # Backend tests
│   ├── docs/            # API documentation
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── __tests__/   # Frontend tests
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── package.json         # Root package.json
└── README.md
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

The application includes comprehensive tests for:

- **Backend**: Authentication endpoints, task CRUD operations, validation
- **Frontend**: Component rendering, user interactions, authentication flow

## 📚 API Documentation

Complete API documentation is available at:
- **Backend**: `backend/docs/API.md`
- **Interactive**: Access http://localhost:5000/api/health for health check

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

## 🎯 Usage Guide

### 1. Registration and Login

1. Visit http://localhost:3000
2. Click "Sign Up" to create a new account
3. Fill in username, email, and password
4. Login with your credentials

### 2. Managing Tasks

#### Create a Task
1. Click "Add Task" in the navigation
2. Fill in task details:
   - Title (required)
   - Description (optional)
   - Status (pending/in-progress/completed)
   - Priority (low/medium/high)
   - Due date (optional)
3. Click "Create Task"

#### View and Filter Tasks
1. Navigate to "Tasks" in the navigation
2. Use the search bar to find specific tasks
3. Apply filters for status and priority
4. Navigate through pages using pagination

#### Update a Task
1. Click the edit icon (✏️) next to any task
2. Modify the desired fields
3. Click "Update Task"

#### Delete a Task
1. Click the delete icon (🗑️) next to any task
2. Confirm the deletion in the popup

### 3. Dashboard

The dashboard provides:
- Task statistics overview
- Recent tasks list
- Quick actions for common operations
- Priority breakdown

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/taskmanagement  # Database URL
JWT_SECRET=your-secret-key                  # JWT signing secret
NODE_ENV=development                        # Environment mode
```

### Customization

#### Tailwind CSS Configuration

Modify `frontend/tailwind.config.js` to customize:
- Color scheme
- Typography
- Breakpoints
- Custom utilities

#### API Configuration

Update `frontend/src/contexts/AuthContext.js` to modify:
- API base URL
- Token storage strategy
- Request/response interceptors

## 🚀 Deployment

### Production Build

#### Frontend

```bash
cd frontend
npm run build
```

#### Backend

```bash
cd backend
npm start
```

### Environment Setup for Production

1. Set `NODE_ENV=production` in backend/.env
2. Use a secure JWT_SECRET
3. Configure proper CORS origins
4. Set up MongoDB with authentication
5. Use HTTPS in production

### Docker Deployment (Optional)

Create `Dockerfile` for containerized deployment:

```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [API Documentation](backend/docs/API.md)
2. Review the troubleshooting section below
3. Create an issue in the repository

## 🔍 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running on your system

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::3000
```
**Solution**: Kill the process using the port or change the port in environment variables

#### JWT Token Issues
```bash
Error: Invalid token
```
**Solution**: Clear browser localStorage and login again

#### CORS Errors
**Solution**: Ensure frontend URL is added to CORS origins in backend server.js

### Development Tips

1. Use `npm run dev` for development with hot reload
2. Check browser console for frontend errors
3. Check terminal for backend errors
4. Use MongoDB Compass for database visualization
5. Test API endpoints with Postman or curl

## 📊 Performance Considerations

- Database indexes are set up for efficient queries
- Pagination prevents loading large datasets
- React components are optimized with proper state management
- Images and assets are optimized for web
- API responses include only necessary data

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting
- Security headers with Helmet
- SQL injection prevention (NoSQL injection)

---

