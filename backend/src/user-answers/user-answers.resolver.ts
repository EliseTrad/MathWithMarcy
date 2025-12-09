import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { UserStatisticsType } from './user-answers.types';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

/**
 * GraphQL Resolver for User Answer and Statistics Operations
 *
 * Provides access to user performance statistics including accuracy rates,
 * topic breakdowns, and difficulty-level analytics.
 * All operations require authentication via JWT token.
 *
 * @class UserAnswersResolver
 * @authentication Required for all operations
 */
@Resolver()
export class UserAnswersResolver {
  constructor(private readonly userAnswersService: UserAnswersService) {}

  /**
   * Get comprehensive statistics for the current authenticated user
   *
   * Returns detailed performance metrics including:
   * - Overall accuracy and total questions answered
   * - Performance breakdown by topic (Geometry, Algebra, Arithmetic, Word Problems)
   * - Performance breakdown by difficulty (Easy, Medium, Hard)
   * - Nested statistics showing topic performance at each difficulty level
   *
   * @query myStatistics
   * @param {object} user - Current user context from JWT token
   * @param {number|string} user.id - User's unique identifier
   * @param {string} user.email - User's email address
   * @returns {Promise<UserStatisticsType>} Comprehensive statistics object
   * @returns {number} UserStatisticsType.totalAnswered - Total questions answered by user
   * @returns {number} UserStatisticsType.correctAnswers - Total correct answers
   * @returns {number} UserStatisticsType.accuracy - Accuracy percentage (0-100)
   * @returns {object} UserStatisticsType.topics - Statistics grouped by topic
   * @returns {object} UserStatisticsType.topics.geometry - Geometry topic stats with difficulty breakdown
   * @returns {object} UserStatisticsType.topics.algebra - Algebra topic stats with difficulty breakdown
   * @returns {object} UserStatisticsType.topics.arithmetic - Arithmetic topic stats with difficulty breakdown
   * @returns {object} UserStatisticsType.topics.wordProblem - Word problem stats with difficulty breakdown
   * @returns {object} UserStatisticsType.difficulties - Statistics grouped by difficulty level
   * @returns {object} UserStatisticsType.difficulties.easy - Easy difficulty stats
   * @returns {object} UserStatisticsType.difficulties.medium - Medium difficulty stats
   * @returns {object} UserStatisticsType.difficulties.hard - Hard difficulty stats
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * query {
   *   myStatistics {
   *     totalAnswered
   *     correctAnswers
   *     accuracy
   *     topics {
   *       algebra {
   *         answered
   *         correct
   *         byDifficulty {
   *           easy { answered correct }
   *           medium { answered correct }
   *           hard { answered correct }
   *         }
   *       }
   *     }
   *     difficulties {
   *       easy { answered correct }
   *       medium { answered correct }
   *       hard { answered correct }
   *     }
   *   }
   * }
   */
  @Query(() => UserStatisticsType, {
    description: 'Get statistics for the current authenticated user',
  })
  @UseGuards(GqlAuthGuard)
  async myStatistics(
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<UserStatisticsType> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    return await this.userAnswersService.getUserStatistics(userId);
  }
}
