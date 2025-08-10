import UserRepository from '../user/user.repository';
import { hashPassword, verifyPassword } from './password';
import { generateToken } from './jwt';
import { RegisterInput, LoginInput } from './auth.validators';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(input: RegisterInput): Promise<{ user: { uuid: string; user_email: string }; token: string }> {
    const { email, password } = input;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create(email, passwordHash);

    // Generate token
    const token = generateToken(user.uuid, user.user_email);

    return {
      user: {
        uuid: user.uuid,
        user_email: user.user_email,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<{ user: { uuid: string; user_email: string }; token: string }> {
    const { email, password } = input;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.User_pwd);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.uuid, user.user_email);

    return {
      user: {
        uuid: user.uuid,
        user_email: user.user_email,
      },
      token,
    };
  }
}

export default AuthService; 