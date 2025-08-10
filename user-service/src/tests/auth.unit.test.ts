import AuthService from '../modules/auth/auth.service';
import { hashPassword, verifyPassword } from '../modules/auth/password';
import { generateToken, verifyToken } from '../modules/auth/jwt';

describe('Password Utils', () => {
  test('should hash and verify password correctly', async () => {
    const password = 'testpassword123';
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(hash).toHaveLength(60); // bcrypt hash length
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const password = 'testpassword123';
    const wrongPassword = 'wrongpassword';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
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

  test('should generate and verify token correctly', () => {
    const uuid = 'test-uuid-123';
    const email = 'test@example.com';
    
    const token = generateToken(uuid, email);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe(uuid);
    expect(decoded.email).toBe(email);
  });

  test('should reject invalid token', () => {
    expect(() => {
      verifyToken('invalid-token');
    }).toThrow('Invalid token');
  });
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  test('should register new user successfully', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await authService.register(input);
    
    expect(result.user.email).toBe(input.email);
    expect(result.user.uuid).toBeDefined();
    expect(result.token).toBeDefined();
  });

  test('should reject duplicate email registration', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    // First registration should succeed
    await authService.register(input);
    
    // Second registration should fail
    await expect(authService.register(input)).rejects.toThrow('User with this email already exists');
  });

  test('should login existing user successfully', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Register user first
    await authService.register(input);
    
    // Login should succeed
    const result = await authService.login(input);
    
    expect(result.user.email).toBe(input.email);
    expect(result.user.uuid).toBeDefined();
    expect(result.token).toBeDefined();
  });

  test('should reject login with wrong password', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Register user first
    await authService.register(input);
    
    // Login with wrong password should fail
    const wrongInput = { ...input, password: 'wrongpassword' };
    
    await expect(authService.login(wrongInput)).rejects.toThrow('Invalid credentials');
  });

  test('should reject login with non-existent email', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    await expect(authService.login(input)).rejects.toThrow('Invalid credentials');
  });
}); 