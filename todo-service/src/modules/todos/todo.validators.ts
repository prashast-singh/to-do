import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(500, 'Content too long'),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    content: z.string().min(1, 'Content is required').max(500, 'Content too long').optional(),
  }),
});

export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>['body'];
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>['body'];
export type TodoParams = z.infer<typeof updateTodoSchema>['params']; 