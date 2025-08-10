import TodoService from '../modules/todos/todo.service';
import { verifyToken } from '../modules/auth/jwt';

describe('TodoService', () => {
  let todoService: TodoService;
  const testUserUuid = 'test-user-uuid-123';

  beforeEach(() => {
    todoService = new TodoService();
  });

  test('should create todo successfully', async () => {
    const content = 'Test todo content';
    
    const todo = await todoService.createTodo(content, testUserUuid);
    
    expect(todo.content).toBe(content);
    expect(todo.user_uuid).toBe(testUserUuid);
    expect(todo.uuid).toBeDefined();
    expect(todo.id).toBeDefined();
  });

  test('should get user todos successfully', async () => {
    const content1 = 'First todo';
    const content2 = 'Second todo';
    
    // Create two todos
    await todoService.createTodo(content1, testUserUuid);
    await todoService.createTodo(content2, testUserUuid);
    
    const todos = await todoService.getUserTodos(testUserUuid);
    
    expect(todos).toHaveLength(2);
    expect(todos[0].content).toBe(content2); // Should be ordered by createdAt desc
    expect(todos[1].content).toBe(content1);
    expect(todos.every(todo => todo.user_uuid === testUserUuid)).toBe(true);
  });

  test('should update todo successfully', async () => {
    const content = 'Original content';
    const newContent = 'Updated content';
    
    // Create todo first
    const todo = await todoService.createTodo(content, testUserUuid);
    
    // Update todo
    const updatedTodo = await todoService.updateTodo(todo.id, testUserUuid, newContent);
    
    expect(updatedTodo.content).toBe(newContent);
    expect(updatedTodo.id).toBe(todo.id);
    expect(updatedTodo.user_uuid).toBe(testUserUuid);
  });

  test('should reject updating non-existent todo', async () => {
    const nonExistentId = 999;
    
    await expect(
      todoService.updateTodo(nonExistentId, testUserUuid, 'New content')
    ).rejects.toThrow('Todo not found or access denied');
  });

  test('should reject updating todo from different user', async () => {
    const otherUserUuid = 'other-user-uuid-456';
    const content = 'Original content';
    
    // Create todo with test user
    const todo = await todoService.createTodo(content, testUserUuid);
    
    // Try to update with different user
    await expect(
      todoService.updateTodo(todo.id, otherUserUuid, 'New content')
    ).rejects.toThrow('Todo not found or access denied');
  });

  test('should delete todo successfully', async () => {
    const content = 'Todo to delete';
    
    // Create todo first
    const todo = await todoService.createTodo(content, testUserUuid);
    
    // Delete todo
    await expect(
      todoService.deleteTodo(todo.id, testUserUuid)
    ).resolves.toBeDefined();
    
    // Verify todo is deleted
    const todos = await todoService.getUserTodos(testUserUuid);
    expect(todos).toHaveLength(0);
  });

  test('should reject deleting non-existent todo', async () => {
    const nonExistentId = 999;
    
    await expect(
      todoService.deleteTodo(nonExistentId, testUserUuid)
    ).rejects.toThrow('Todo not found or access denied');
  });

  test('should reject deleting todo from different user', async () => {
    const otherUserUuid = 'other-user-uuid-456';
    const content = 'Todo to delete';
    
    // Create todo with test user
    const todo = await todoService.createTodo(content, testUserUuid);
    
    // Try to delete with different user
    await expect(
      todoService.deleteTodo(todo.id, otherUserUuid)
    ).rejects.toThrow('Todo not found or access denied');
  });

  test('should get todo by id successfully', async () => {
    const content = 'Test todo';
    
    // Create todo first
    const createdTodo = await todoService.createTodo(content, testUserUuid);
    
    // Get todo by id
    const todo = await todoService.getTodoById(createdTodo.id, testUserUuid);
    
    expect(todo.content).toBe(content);
    expect(todo.id).toBe(createdTodo.id);
    expect(todo.user_uuid).toBe(testUserUuid);
  });

  test('should reject getting non-existent todo', async () => {
    const nonExistentId = 999;
    
    await expect(
      todoService.getTodoById(nonExistentId, testUserUuid)
    ).rejects.toThrow('Todo not found or access denied');
  });
});

describe('JWT Utils', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key-for-jwt-signing' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should verify valid token', () => {
    const payload = {
      sub: 'test-uuid',
      email: 'test@example.com',
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + 3600, // 1 hour from now
    };
    
    const token = require('jsonwebtoken').sign(payload, process.env.JWT_SECRET);
    
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
  });

  test('should reject invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow('Invalid token');
  });
}); 