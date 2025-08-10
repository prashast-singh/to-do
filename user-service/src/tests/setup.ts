import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up database before tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean up database after tests
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

afterEach(async () => {
  // Clean up after each test
  await prisma.user.deleteMany();
}); 