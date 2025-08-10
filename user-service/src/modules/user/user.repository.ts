import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { user_email: email },
    });
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { uuid },
    });
  }

  async create(email: string, passwordHash: string): Promise<User> {
    return prisma.user.create({
      data: {
        user_email: email,
        User_pwd: passwordHash,
      },
    });
  }

  async updatePassword(uuid: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { uuid },
      data: { User_pwd: passwordHash },
    });
  }
}

export default UserRepository; 