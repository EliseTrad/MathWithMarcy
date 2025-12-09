import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Question } from './question.entity';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { UserAnswer } from '../user-answers/user-answer.entity';

/**
 * QuestionsModule - Question Management Module
 *
 * Responsibilities:
 * - Question CRUD operations
 * - Answer submission and validation
 * - Question filtering by topic and difficulty
 * - Question randomization
 *
 * Architecture:
 * - Registers both Question and UserAnswer entities for repository access
 * - Self-contained module with no exports (used only internally)
 * - Uses JWT guard for protected endpoints
 *
 * Best Practices:
 * - Thin controller delegates to service for all business logic
 * - DTOs for comprehensive input validation
 * - Repository pattern for data access
 * - Proper separation between question management and answer tracking
 */
@Module({
  imports: [TypeOrmModule.forFeature([Question, UserAnswer])],
  controllers: [],
  providers: [QuestionsService, QuestionsResolver],
})
export class QuestionsModule {}
