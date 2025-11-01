import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Orchestrates authentication workflows by validating credentials and issuing JWT tokens.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * validateUser
   *
   * Attempts to authenticate a learner by email and password.
   *
   * @param email Student's email address (case-insensitive).
   * @param password Plain-text password supplied in the login request.
   * @returns Resolved sanitized user when valid; otherwise null.
   * @validation Uses bcrypt to compare hashed credentials.
   */
  public async validateUser(
    email: string,
    password: string
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  /**
   * register
   *
   * Creates a new learner account and returns the sanitized user profile.
   *
   * @param registerDto Object containing `name`, `email`, and `password`.
   * @returns Newly created user without the password hash.
   */
  public async register(registerDto: RegisterDto): Promise<AuthenticatedUser> {
    console.log('[AUTH] Registration attempt:', {
      name: registerDto.name,
      email: registerDto.email,
    });

    const createUserPayload: CreateUserDto = {
      name: registerDto.name.trim(),
      email: registerDto.email,
      password: registerDto.password,
    };

    try {
      const result = await this.usersService.createUser(createUserPayload);
      console.log('[AUTH] Registration successful for:', result.email);
      return result;
    } catch (error) {
      console.error('[AUTH] Registration failed:', error);
      throw error;
    }
  }

  /**
   * login
   *
   * Authenticates credentials and issues a signed JWT token along with user info.
   *
   * @param credentialsDto Object containing `email`, `password`, and optional `remember` fields.
   * @returns Access token and sanitized user record.
   * @throws UnauthorizedException When credentials are invalid.
   */
  public async login(
    credentialsDto: LoginDto
  ): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    console.log('[AUTH] Login attempt for:', credentialsDto.email);

    const user = await this.validateUser(
      credentialsDto.email,
      credentialsDto.password
    );

    if (!user) {
      console.error(
        '[AUTH] Login failed - invalid credentials for:',
        credentialsDto.email
      );
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = await this.generateJwt(user, credentialsDto.remember);
    console.log('[AUTH] Login successful for:', user.email);
    return { accessToken: token, user };
  }

  /**
   * generateJwt
   *
   * Produces a signed JSON Web Token capturing the student's identity.
   *
   * @param user Validated user object whose identifier populates the token subject.
   * @param remember If true, issues a longer-lived token (30 days), otherwise uses default expiration (1 hour).
   * @returns Signed JWT string with expiration derived from configuration.
   */
  private async generateJwt(
    user: AuthenticatedUser,
    remember?: boolean
  ): Promise<string> {
    const payload = { sub: user.user_id, email: user.email };
    const secret = this.configService.get<string>('JWT_SECRET');
    const defaultExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    if (!secret) {
      throw new InternalServerErrorException('JWT secret is not configured.');
    }

    const options: JwtSignOptions = { secret };

    // Use 30 days for remember me, otherwise use config default (1 hour)
    if (remember) {
      options.expiresIn = '30d';
    } else if (defaultExpiresIn) {
      options.expiresIn = defaultExpiresIn as JwtSignOptions['expiresIn'];
    }

    return this.jwtService.signAsync(payload, options);
  }

  private sanitizeUser(user: User): AuthenticatedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser as AuthenticatedUser;
  }
}

type AuthenticatedUser = Omit<User, 'password'>;
