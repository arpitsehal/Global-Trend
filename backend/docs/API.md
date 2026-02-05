# Task Management API Documentation

## Overview

This is a RESTful API for a Task Management application. The API provides endpoints for user authentication and task management operations.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Endpoints

### Authentication

#### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Validation Rules:**
- `username`: 3-30 characters, required
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

#### Login User
**POST** `/auth/login`

Authenticate a user and return a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Tasks

All task endpoints require authentication.

#### Get All Tasks
**GET** `/tasks`

Retrieve tasks for the authenticated user with filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (default: `createdAt`)
- `sortOrder` (optional): Sort order (`asc` or `desc`, default: `desc`)

**Example Request:**
```
GET /tasks?status=pending&priority=high&page=1&limit=10
```

**Response:**
```json
{
  "tasks": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "user": "64a1b2c3d4e5f6789012345",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 25
  }
}
```

#### Get Single Task
**GET** `/tasks/:id`

Retrieve a specific task by ID.

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "user": "64a1b2c3d4e5f6789012345",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

#### Create Task
**POST** `/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15"
}
```

**Validation Rules:**
- `title`: Required, max 100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, must be one of `pending`, `in-progress`, `completed`
- `priority`: Optional, must be one of `low`, `medium`, `high`
- `dueDate`: Optional, ISO date format

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15T00:00:00.000Z",
  "user": "64a1b2c3d4e5f6789012345",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

#### Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-01-20"
}
```

All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "user": "64a1b2c3d4e5f6789012345",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-02T15:30:00.000Z"
}
```

#### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

#### Get Task Statistics
**GET** `/tasks/stats/overview`

Get statistics about tasks for the authenticated user.

**Response:**
```json
{
  "total": 25,
  "byStatus": {
    "pending": 10,
    "in-progress": 8,
    "completed": 7
  },
  "byPriority": {
    "low": 5,
    "medium": 12,
    "high": 8
  }
}
```

### Health Check

#### Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15-minute window per IP address
- Rate limit headers are included in responses

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet.js for security headers

## Data Models

### User
```json
{
  "_id": "ObjectId",
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (hashed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Task
```json
{
  "_id": "ObjectId",
  "title": "string (max 100 chars)",
  "description": "string (max 500 chars, optional)",
  "status": "string (pending|in-progress|completed)",
  "priority": "string (low|medium|high)",
  "dueDate": "Date (optional)",
  "user": "ObjectId (reference to User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Example Usage

### Using curl

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create a task (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My first task","description":"Task description","priority":"high"}'

# Get all tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Using JavaScript (fetch)

```javascript
// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Create task
const taskResponse = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My first task',
    description: 'Task description',
    priority: 'high'
  })
});

const task = await taskResponse.json();
```
