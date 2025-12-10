import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserType } from './users.types';
import { ChangePasswordInput, UpdateUserInput } from './users.inputs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * GraphQL Resolver for User Profile Operations
 *
 * Handles all user profile management operations including viewing, updating, password changes, and account deletion.
 * All operations in this resolver require authentication via JWT token.
 *
 * @class UsersResolver
 * @authentication Required for all operations
 */
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current authenticated user's profile
   *
   * Returns the complete profile information for the user making the request.
   * User identity is extracted from the JWT token in the Authorization header.
   *
   * @query me
   * @param {object} user - Current user context extracted from JWT token (automatically injected by @CurrentUser decorator)
   * @param {number|string} user.id - User's unique identifier
   * @param {string} user.email - User's email address
   * @returns {Promise<UserType>} Complete user profile including user_id, name, email, created_at, updated_at
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {NotFoundException} When user from token no longer exists
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * query {
   *   me {
   *     user_id
   *     name
   *     email
   *     created_at
   *     updated_at
   *   }
   * }
   */
  @Query(() => UserType, {
    description: 'Get the current authenticated user profile',
  })
  @UseGuards(GqlAuthGuard)
  async me(
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<UserType> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    const userEntity = await this.usersService.getUserById(userId);

    return {
      user_id: userEntity.user_id,
      name: userEntity.name,
      email: userEntity.email,
      created_at: userEntity.created_at,
      updated_at: userEntity.updated_at,
    };
  }

  /**
   * Update current user's profile information
   *
   * Allows updating name and/or email. All fields are optional - only provided fields will be updated.
   * Email must be unique across all users. No changes made if all fields are identical to current values.
   *
   * @mutation updateUser
   * @param {UpdateUserInput} input - Fields to update (all optional)
   * @param {string} [input.name] - New name (1-100 chars)
   * @param {string} [input.email] - New email (max 150 chars, valid format, must be unique)
   * @param {object} user - Current user context from JWT token
   * @returns {Promise<UserType>} Updated user profile
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When new email is already in use by another account
   * @throws {NotFoundException} When user no longer exists
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * mutation {
   *   updateUser(input: {
   *     name: "Jane Doe"
   *     email: "jane@example.com"
   *   }) {
   *     user_id
   *     name
   *     email
   *     updated_at
   *   }
   * }
   */
  @Mutation(() => UserType, {
    description: 'Update user profile (name and/or email)',
  })
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<UserType> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    const updated = await this.usersService.updateUser(userId, input);

    return {
      user_id: updated.user_id,
      name: updated.name,
      email: updated.email,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  /**
   * Change current user's password
   *
   * Validates current password before allowing change. New password must meet security requirements
   * and be different from current password.
   *
   * @mutation changePassword
   * @param {ChangePasswordInput} input - Password change data
   * @param {string} input.currentPassword - User's current password (8-255 chars)
   * @param {string} input.newPassword - New password (8-255 chars, must include uppercase, lowercase, number, special char)
   * @param {object} user - Current user context from JWT token
   * @returns {Promise<boolean>} True when password successfully changed
   * @throws {UnauthorizedException} When JWT token is invalid or current password is incorrect
   * @throws {BadRequestException} When new password is same as current password or validation fails
   * @throws {NotFoundException} When user no longer exists
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * mutation {
   *   changePassword(input: {
   *     currentPassword: "OldP@ss123"
   *     newPassword: "NewP@ss456"
   *   })
   * }
   */
  @Mutation(() => Boolean, {
    description: 'Change user password',
  })
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<boolean> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    await this.usersService.changePassword(userId, input);
    return true;
  }

  /**
   * Delete current user's account permanently
   *
   * Permanently removes the user account and all associated data from the database.
   * This action is irreversible. Related user answers may be affected by cascading rules.
   *
   * @mutation deleteUser
   * @param {object} user - Current user context from JWT token
   * @returns {Promise<boolean>} True when account successfully deleted
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {NotFoundException} When user no longer exists
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @warning This operation is irreversible and will delete all user data
   * @example
   * mutation {
   *   deleteUser
   * }
   */
  @Mutation(() => Boolean, {
    description: 'Delete user account',
  })
  @UseGuards(GqlAuthGuard)
  async deleteUser(
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<boolean> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    await this.usersService.deleteUser(userId);
    return true;
  }
}
