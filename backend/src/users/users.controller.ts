import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

/**
 * Controller handling user profile management endpoints.
 * All routes here require JWT authentication.
 * Registration and login are handled by AuthController.
 */
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users
   * Retrieves all registered users.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return { users };
  }

  /**
   * GET /users/:id
   * Retrieves a specific user by ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    const user = await this.usersService.getUserById(userId);
    return { user };
  }

  /**
   * PATCH /users
   * Updates the authenticated user's profile.
   */
  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userId = this.extractUserIdFromRequest(request);
    const user = await this.usersService.updateUser(userId, updateUserDto);
    return { message: 'Profile updated successfully.', user };
  }

  /**
   * PATCH /users/password
   * Changes the authenticated user's password.
   */
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const userId = this.extractUserIdFromRequest(request);
    await this.usersService.changePassword(userId, changePasswordDto);
    return { message: 'Password updated successfully.' };
  }

  /**
   * DELETE /users
   * Deletes the authenticated user's account.
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() request: Request) {
    const userId = this.extractUserIdFromRequest(request);
    await this.usersService.deleteUser(userId);
    return { message: 'Account deleted successfully.' };
  }

  /**
   * Extracts user ID from JWT payload attached to request by AuthGuard.
   */
  private extractUserIdFromRequest(request: Request): number {
    const user = request.user as Record<string, unknown>;

    let userId: number | undefined;

    if ('user_id' in user) {
      userId = user['user_id'] as number;
    } else if ('id' in user) {
      userId = user['id'] as number;
    } else if ('sub' in user) {
      userId = user['sub'] as number;
    }

    if (typeof userId !== 'number' || userId <= 0) {
      throw new UnauthorizedException('Authentication context is invalid.');
    }

    return userId;
  }
}
