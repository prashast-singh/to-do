import TodoService from "../modules/todos/todo.service";

describe("TodoService", () => {
  let todoService: TodoService;
  const testUserUuid = "test-user-uuid-123";

  beforeEach(() => {
    todoService = new TodoService();
  });

  test("should create todo successfully", async () => {
    const content = "Test todo content";

    const todo = await todoService.createTodo(content, testUserUuid);

    expect(todo.content).toBe(content);
    expect(todo.user_uuid).toBe(testUserUuid);
    expect(todo.uuid).toBeDefined();
    expect(todo.id).toBeDefined();
  });

  test("should get user todos successfully", async () => {
    const content1 = "First todo";
    const content2 = "Second todo";

    // Create two todos
    await todoService.createTodo(content1, testUserUuid);
    await todoService.createTodo(content2, testUserUuid);

    const todos = await todoService.getUserTodos(testUserUuid);

    expect(todos).toHaveLength(2);
    // Check that both todos exist and belong to the user
    expect(todos.some((todo) => todo.content === content1)).toBe(true);
    expect(todos.some((todo) => todo.content === content2)).toBe(true);
    expect(todos.every((todo) => todo.user_uuid === testUserUuid)).toBe(true);
  });

  test("should update todo successfully", async () => {
    const content = "Original content";
    const newContent = "Updated content";

    // Create todo first
    const todo = await todoService.createTodo(content, testUserUuid);

    // Update todo
    const updatedTodo = await todoService.updateTodo(
      todo.id,
      testUserUuid,
      newContent
    );

    expect(updatedTodo.content).toBe(newContent);
    expect(updatedTodo.id).toBe(todo.id);
    expect(updatedTodo.user_uuid).toBe(testUserUuid);
  });

  test("should reject updating non-existent todo", async () => {
    const nonExistentId = 999;

    await expect(
      todoService.updateTodo(nonExistentId, testUserUuid, "New content")
    ).rejects.toThrow("Todo not found or access denied");
  });

  test("should reject updating todo from different user", async () => {
    const otherUserUuid = "other-user-uuid-456";
    const content = "Original content";

    // Create todo with test user
    const todo = await todoService.createTodo(content, testUserUuid);

    // Try to update with different user
    await expect(
      todoService.updateTodo(todo.id, otherUserUuid, "New content")
    ).rejects.toThrow("Todo not found or access denied");
  });

  test("should delete todo successfully", async () => {
    const content = "Todo to delete";

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

  test("should reject deleting non-existent todo", async () => {
    const nonExistentId = 999;

    await expect(
      todoService.deleteTodo(nonExistentId, testUserUuid)
    ).rejects.toThrow("Todo not found or access denied");
  });

  test("should reject deleting todo from different user", async () => {
    const otherUserUuid = "other-user-uuid-456";
    const content = "Todo to delete";

    // Create todo with test user
    const todo = await todoService.createTodo(content, testUserUuid);

    // Try to delete with different user
    await expect(
      todoService.deleteTodo(todo.id, otherUserUuid)
    ).rejects.toThrow("Todo not found or access denied");
  });

  test("should get todo by id successfully", async () => {
    const content = "Test todo";

    // Create todo first
    const createdTodo = await todoService.createTodo(content, testUserUuid);

    // Get todo by id
    const todo = await todoService.getTodoById(createdTodo.id, testUserUuid);

    expect(todo.content).toBe(content);
    expect(todo.id).toBe(createdTodo.id);
    expect(todo.user_uuid).toBe(testUserUuid);
  });

  test("should reject getting non-existent todo", async () => {
    const nonExistentId = 999;

    await expect(
      todoService.getTodoById(nonExistentId, testUserUuid)
    ).rejects.toThrow("Todo not found or access denied");
  });
});
