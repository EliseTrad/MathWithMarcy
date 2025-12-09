import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAnswer } from './user-answer.entity';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersResolver } from './user-answers.resolver';

/**
 * UserAnswersModule - User Answer Tracking Module
 *
 * Responsibilities:
 * - Track user answer submissions
 * - Calculate user statistics and performance metrics
 * - Filter and retrieve user answer history
 * - CRUD operations for user answers
 *
 * Architecture:
 * - Registers UserAnswer entity for repository access
 * - Self-contained module with no external dependencies (besides TypeORM)
 * - Uses JWT guard for user-specific data access
 *
 * Best Practices:
 * - Encapsulates answer tracking logic separately from questions
 * - Repository pattern for data access
 * - DTOs for filtering and statistics responses
 * - Service layer handles all business logic and calculations
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserAnswer])],
  controllers: [],
  providers: [UserAnswersService, UserAnswersResolver],
})
export class UserAnswersModule {}
