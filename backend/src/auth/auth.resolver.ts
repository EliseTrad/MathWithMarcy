import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse, UserType } from './auth.types';
import { LoginInput, RegisterInput } from './auth.inputs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * GraphQL Resolver for Authentication Operations
 *
 * Handles user registration and login mutations without requiring authentication.
 * These are the only public endpoints in the system - all other operations require a valid JWT token.
 *
 * @class AuthResolver
 */
@ApiTags('Authentication')
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user account
   *
   * Creates a new user with validated credentials and returns the user profile (without password).
   * Email addresses are normalized to lowercase and must be unique.
   * Password must meet security requirements enforced by validation.
   *
   * @mutation register
   * @param {RegisterInput} registerInput - Registration data containing name, email, and password
   * @param {string} registerInput.name - User's full name (2-100 chars, letters/spaces/hyphens/apostrophes only)
   * @param {string} registerInput.email - Unique email address (max 150 chars, valid format)
   * @param {string} registerInput.password - Strong password (8-255 chars, must include uppercase, lowercase, number, special char)
   * @returns {Promise<UserType>} Created user object with user_id, name, email, created_at, updated_at
   * @throws {BadRequestException} When email is already registered or validation fails
   * @throws {InternalServerErrorException} For unexpected errors during registration
   * @authentication Not required (public endpoint)
   * @example
   * mutation {
   *   register(input: {
   *     name: "John Doe"
   *     email: "john@example.com"
   *     password: "SecureP@ss123"
   *   }) {
   *     user_id
   *     name
   *     email
   *   }
   * }
   */
  @Mutation(() => UserType, {
    description: 'Register a new user account',
  })
  async register(
    @Args('input') registerInput: RegisterInput
  ): Promise<UserType> {
    return await this.authService.register(registerInput);
  }

  /**
   * Authenticate user and issue JWT access token
   *
   * Validates credentials and returns a JWT token for subsequent authenticated requests.
   * Token expiration is configurable (default 1 day, or 30 days if remember=true).
   *
   * @mutation login
   * @param {LoginInput} loginInput - Login credentials
   * @param {string} loginInput.email - User's email address
   * @param {string} loginInput.password - User's password
   * @param {boolean} [loginInput.remember] - Extended session (30 days) if true, otherwise standard (1 day)
   * @returns {Promise<AuthResponse>} Object containing accessToken and user profile
   * @returns {string} AuthResponse.accessToken - JWT token to use in Authorization header
   * @returns {UserType} AuthResponse.user - User profile information
   * @throws {UnauthorizedException} When credentials are invalid
   * @throws {InternalServerErrorException} For JWT generation or unexpected errors
   * @authentication Not required (public endpoint)
   * @example
   * mutation {
   *   login(input: {
   *     email: "john@example.com"
   *     password: "SecureP@ss123"
   *     remember: true
   *   }) {
   *     accessToken
   *     user {
   *       user_id
   *       name
   *       email
   *     }
   *   }
   * }
   */
  @Mutation(() => AuthResponse, {
    description: 'Authenticate user and get access token',
  })
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }
}
