import { PrismaClient, Todo } from '@prisma/client';

const prisma = new PrismaClient();

export class TodoRepository {
  async create(content: string, userUuid: string): Promise<Todo> {
    return prisma.todo.create({
      data: {
        content,
        user_uuid: userUuid,
      },
    });
  }

  async findByUserUuid(userUuid: string): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: { user_uuid: userUuid },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndUserUuid(id: number, userUuid: string): Promise<Todo | null> {
    return prisma.todo.findFirst({
      where: {
        id,
        user_uuid: userUuid,
      },
    });
  }

  async update(id: number, userUuid: string, content: string): Promise<Todo> {
    return prisma.todo.update({
      where: {
        id,
        user_uuid: userUuid,
      },
      data: { content },
    });
  }

  async delete(id: number, userUuid: string): Promise<Todo> {
    return prisma.todo.delete({
      where: {
        id,
        user_uuid: userUuid,
      },
    });
  }
}

export default TodoRepository; 