import TodoRepository from './todo.repository';

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async createTodo(content: string, userUuid: string) {
    return this.todoRepository.create(content, userUuid);
  }

  async getUserTodos(userUuid: string) {
    return this.todoRepository.findByUserUuid(userUuid);
  }

  async updateTodo(id: number, userUuid: string, content: string) {
    const todo = await this.todoRepository.findByIdAndUserUuid(id, userUuid);
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    return this.todoRepository.update(id, userUuid, content);
  }

  async deleteTodo(id: number, userUuid: string) {
    const todo = await this.todoRepository.findByIdAndUserUuid(id, userUuid);
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    return this.todoRepository.delete(id, userUuid);
  }

  async getTodoById(id: number, userUuid: string) {
    const todo = await this.todoRepository.findByIdAndUserUuid(id, userUuid);
    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    return todo;
  }
}

export default TodoService; 