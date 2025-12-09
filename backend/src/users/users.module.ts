import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './user.entity';

/**
 * UsersModule - User Management Module
 *
 * Responsibilities:
 * - User CRUD operations
 * - Profile management
 * - Password changes
 * - User data retrieval for authentication
 *
 * Architecture:
 * - Uses TypeOrmModule.forFeature to register User entity repository
 * - Uses forwardRef to resolve circular dependency with AuthModule
 * - Exports UsersService for use in AuthModule and other modules
 *
 * Best Practices:
 * - Clean separation: controller (HTTP layer), service (business logic), entity (data model)
 * - Repository pattern via TypeORM injection
 * - Service exports for cross-module usage
 * - DTOs for input validation and data transfer
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
