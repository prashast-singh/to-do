import { Request, Response } from 'express';
import TodoService from './todo.service';
import logger from '../../config/logger';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { content } = req.body;
      const userUuid = req.user?.sub;

      if (!userUuid) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        });
        return;
      }

      const todo = await this.todoService.createTodo(content, userUuid);
      
      logger.info({ todoId: todo.id, userUuid }, 'Todo created successfully');
      
      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Create todo failed');
      
      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create todo',
          code: 'CREATE_TODO_ERROR',
        },
      });
    }
  }

  async getUserTodos(req: Request, res: Response): Promise<void> {
    try {
      const userUuid = req.user?.sub;

      if (!userUuid) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        });
        return;
      }

      const todos = await this.todoService.getUserTodos(userUuid);
      
      res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Get todos failed');
      
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch todos',
          code: 'FETCH_TODOS_ERROR',
        },
      });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userUuid = req.user?.sub;

      if (!userUuid) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        });
        return;
      }

      const todo = await this.todoService.updateTodo(Number(id), userUuid, content);
      
      logger.info({ todoId: todo.id, userUuid }, 'Todo updated successfully');
      
      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Update todo failed');
      
      if (error instanceof Error && error.message === 'Todo not found or access denied') {
        res.status(404).json({
          success: false,
          error: {
            message: 'Todo not found or access denied',
            code: 'TODO_NOT_FOUND',
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to update todo',
          code: 'UPDATE_TODO_ERROR',
        },
      });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userUuid = req.user?.sub;

      if (!userUuid) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Unauthorized',
            code: 'UNAUTHORIZED',
          },
        });
        return;
      }

      await this.todoService.deleteTodo(Number(id), userUuid);
      
      logger.info({ todoId: id, userUuid }, 'Todo deleted successfully');
      
      res.status(204).send();
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Delete todo failed');
      
      if (error instanceof Error && error.message === 'Todo not found or access denied') {
        res.status(404).json({
          success: false,
          error: {
            message: 'Todo not found or access denied',
            code: 'TODO_NOT_FOUND',
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to delete todo',
          code: 'DELETE_TODO_ERROR',
        },
      });
    }
  }
}

export default TodoController; 