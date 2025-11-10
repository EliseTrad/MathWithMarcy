import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

const BCRYPT_SALT_ROUNDS = 10;

type SanitizedUser = Omit<User, 'password'>;

/**
 * Service responsible for user management business logic.
 * Handles user CRUD operations with proper error handling and data sanitization.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  /**
   * Creates a new user account.
   * Business logic: checks for duplicate emails and hashes passwords.
   *
   * @param createUserDto - Validated user creation data (validation happens in DTO)
   * @returns Promise that resolves to sanitized user object without password
   * @throws BadRequestException if email already exists
   * @throws InternalServerErrorException for database errors
   */
  async createUser(createUserDto: CreateUserDto): Promise<SanitizedUser> {
    try {
      // Business logic: Check for duplicate email
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        console.error('[USERS] Email already exists:', createUserDto.email);
        throw new BadRequestException('Email is already registered.');
      }

      // Business logic: Hash password
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        BCRYPT_SALT_ROUNDS
      );

      // Create and save user
      const user = this.usersRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);
      console.log('[USERS] User created successfully:', savedUser.email);

      return this.sanitizeUser(savedUser);
    } catch (error) {
      console.error('[USERS] Error creating user:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.'
      );
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns Promise that resolves to array of sanitized user objects
   * @throws InternalServerErrorException for database errors
   */
  async getAllUsers(): Promise<SanitizedUser[]> {
    try {
      const users = await this.usersRepository.find();
      const sanitizedUsers = [];
      for (const user of users) {
        sanitizedUsers.push(this.sanitizeUser(user));
      }
      return sanitizedUsers;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to retrieve users at this time.'
      );
    }
  }

  /**
   * Retrieves a single user by ID.
   *
   * @param userId - User ID to lookup
   * @returns Promise that resolves to sanitized user object
   * @throws NotFoundException if user doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async getUserById(userId: number): Promise<SanitizedUser> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        console.error('[USERS] getUserById - user not found:', { userId });
        throw new NotFoundException('User not found.');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Expected error already logged above
        throw error;
      }

      throw new InternalServerErrorException(
        'Unable to retrieve the requested user.'
      );
    }
  }

  /**
   * Updates user profile information.
   * Business logic: checks for email conflicts with other users.
   *
   * @param userId - User ID to update
   * @param updateUserDto - Validated update data (validation happens in DTO)
   * @returns Promise that resolves to updated sanitized user object
   * @throws BadRequestException if email already in use by another user
   * @throws NotFoundException if user doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<SanitizedUser> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        console.error('[USERS] updateUser - user not found:', { userId });
        throw new NotFoundException('User not found.');
      }

      let hasChanges = false;

      // Business logic: Check for email conflicts
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const emailOwner = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (emailOwner && emailOwner.user_id !== userId) {
          throw new BadRequestException(
            'Email is already registered to another account.'
          );
        }

        user.email = updateUserDto.email;
        hasChanges = true;
      }

      // Update name if provided
      if (updateUserDto.name && updateUserDto.name !== user.name) {
        user.name = updateUserDto.name;
        hasChanges = true;
      }

      // Only save if there are changes
      if (!hasChanges) {
        return this.sanitizeUser(user);
      }

      const updatedUser = await this.usersRepository.save(user);
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        // Expected validation error
        throw error;
      }
      console.error(error);

      throw new InternalServerErrorException(
        'Unable to update user information.'
      );
    }
  }

  /**
   * Changes user password.
   * Business logic: verifies current password and ensures new password is different.
   *
   * @param userId - User ID
   * @param changePasswordDto - Validated password data (validation happens in DTO)
   * @returns Promise that resolves when password is successfully changed
   * @throws UnauthorizedException if current password is incorrect
   * @throws BadRequestException if new password matches current password
   * @throws NotFoundException if user doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        console.error('[USERS] changePassword - user not found:', { userId });
        throw new NotFoundException('User not found.');
      }

      // Business logic: Verify current password
      const currentMatches = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password
      );

      if (!currentMatches) {
        console.error('[USERS] changePassword - incorrect current password:', {
          userId,
        });
        throw new UnauthorizedException('Current password is incorrect.');
      }

      // Business logic: Ensure new password is different
      const newMatchesExisting = await bcrypt.compare(
        changePasswordDto.newPassword,
        user.password
      );

      if (newMatchesExisting) {
        console.error('[USERS] changePassword - new password matches old:', {
          userId,
        });
        throw new BadRequestException(
          'New password must differ from the current password.'
        );
      }

      // Business logic: Hash new password
      user.password = await bcrypt.hash(
        changePasswordDto.newPassword,
        BCRYPT_SALT_ROUNDS
      );

      await this.usersRepository.save(user);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        // Expected validation/auth errors
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Unable to change password at this time.'
      );
    }
  }

  /**
   * Deletes a user account.
   *
   * @param userId - User ID to delete
   * @returns Promise that resolves when user is successfully deleted
   * @throws NotFoundException if user doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        console.error('[USERS] deleteUser - user not found:', { userId });
        throw new NotFoundException('User not found.');
      }

      await this.usersRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Already logged above
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Unable to delete user at this time.'
      );
    }
  }

  /**
   * Finds a user by email address.
   * Used internally for authentication workflows.
   *
   * @param email - Email address to lookup
   * @returns Promise that resolves to user entity with password, or null if not found
   * @throws InternalServerErrorException for database errors
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return null;
    }

    try {
      const user = await this.usersRepository.findOne({
        where: { email: normalizedEmail },
      });

      return user ?? null;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to lookup user by email.');
    }
  }

  /**
   * Removes password field from user object for safe API responses.
   *
   * @param user - User entity with password
   * @returns User object without password field
   */
  private sanitizeUser(user: User): SanitizedUser {
    const { password, ...safeUser } = user;
    return safeUser as SanitizedUser;
  }
}
