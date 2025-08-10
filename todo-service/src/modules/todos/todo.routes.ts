import { Router } from 'express';
import TodoController from './todo.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { createTodoSchema, updateTodoSchema, deleteTodoSchema } from './todo.validators';

const router = Router();
const todoController = new TodoController();

// All todo routes require authentication
router.use(requireAuth);

// Create todo
router.post('/', validateRequest(createTodoSchema), todoController.createTodo.bind(todoController));

// Get user's todos
router.get('/', todoController.getUserTodos.bind(todoController));

// Update todo
router.patch('/:id', validateRequest(updateTodoSchema), todoController.updateTodo.bind(todoController));

// Delete todo
router.delete('/:id', validateRequest(deleteTodoSchema), todoController.deleteTodo.bind(todoController));

export default router; 