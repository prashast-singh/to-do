import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up database before tests
  await prisma.todo.deleteMany();
});

afterAll(async () => {
  // Clean up database after tests
  await prisma.todo.deleteMany();
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up after each test
  await prisma.todo.deleteMany();
}); 