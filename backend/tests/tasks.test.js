const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Task Endpoints', () => {
  let token;
  let user;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/taskmanagement_test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clear collections before each test
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create and login a test user
    user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        priority: 'high',
        dueDate: '2024-12-31'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body.status).toBe(taskData.status);
      expect(response.body.priority).toBe(taskData.priority);
      expect(response.body.user).toBe(user._id.toString());
    });

    it('should create task with minimal required fields', async () => {
      const taskData = {
        title: 'Minimal Task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body.status).toBe('pending'); // Default value
      expect(response.body.priority).toBe('medium'); // Default value
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        status: 'invalid-status',
        priority: 'invalid-priority'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should reject request without authentication', async () => {
      const taskData = {
        title: 'Test Task'
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high', user: user._id },
        { title: 'Task 2', status: 'in-progress', priority: 'medium', user: user._id },
        { title: 'Task 3', status: 'completed', priority: 'low', user: user._id }
      ];

      await Task.insertMany(tasks);
    });

    it('should get all tasks for authenticated user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(3);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].status).toBe('pending');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].priority).toBe('high');
    });

    it('should search tasks by title', async () => {
      const response = await request(app)
        .get('/api/tasks?search=Task 1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].title).toBe('Task 1');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.tasks).toHaveLength(2);
      expect(response.body.pagination.current).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Test Task',
        description: 'Test description',
        status: 'pending',
        priority: 'high',
        user: user._id
      });
      await task.save();
    });

    it('should get a specific task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body._id).toBe(task._id.toString());
      expect(response.body.title).toBe(task.title);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should not allow access to another user\'s task', async () => {
      // Create another user
      const otherUser = new User({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password123'
      });
      await otherUser.save();

      // Login as other user
      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'other@example.com',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      // Try to access first user's task
      await request(app)
        .get(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Original Task',
        description: 'Original description',
        status: 'pending',
        priority: 'medium',
        user: user._id
      });
      await task.save();
    });

    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
      expect(response.body.priority).toBe(updateData.priority);
      expect(response.body.description).toBe(task.description); // Unchanged
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { title: 'Updated Task' };

      await request(app)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let task;

    beforeEach(async () => {
      task = new Task({
        title: 'Task to Delete',
        user: user._id
      });
      await task.save();
    });

    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('GET /api/tasks/stats/overview', () => {
    beforeEach(async () => {
      // Create test tasks with different statuses and priorities
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high', user: user._id },
        { title: 'Task 2', status: 'pending', priority: 'medium', user: user._id },
        { title: 'Task 3', status: 'in-progress', priority: 'high', user: user._id },
        { title: 'Task 4', status: 'completed', priority: 'low', user: user._id }
      ];

      await Task.insertMany(tasks);
    });

    it('should return task statistics', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.total).toBe(4);
      expect(response.body.byStatus.pending).toBe(2);
      expect(response.body.byStatus['in-progress']).toBe(1);
      expect(response.body.byStatus.completed).toBe(1);
      expect(response.body.byPriority.high).toBe(2);
      expect(response.body.byPriority.medium).toBe(1);
      expect(response.body.byPriority.low).toBe(1);
    });
  });
});
