import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserAnswer } from './user-answer.entity';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { GetUserAnswersFilterDto } from './dto/get-user-answers-filter.dto';
import {
  UserStatisticsDto,
  DifficultyStats,
  TopicStats,
} from './dto/user-statistics.dto';

/**
 * Service responsible for CRUD operations on UserAnswer.
 * Keeps logic minimal — just persistence and existence checks.
 */
@Injectable()
export class UserAnswersService {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswersRepo: Repository<UserAnswer>
  ) {}

  /**
   * Retrieve a user's answers with optional topic and difficulty filters.
   * Returns a projection suitable for dashboards.
   *
   * @param userId - The ID of the user whose answers to retrieve
   * @param filters - Optional filters for topic and difficulty
   * @returns Promise that resolves to array of user answer projections with question details
   * @throws InternalServerErrorException for database errors
   */
  async getUserAnswers(
    userId: number,
    filters: GetUserAnswersFilterDto
  ): Promise<
    Array<{
      questionText: string;
      topic: string;
      difficulty: string;
      userAnswer: string;
      isCorrect: boolean;
    }>
  > {
    try {
      let whereCondition: any = { user: { user_id: userId } };

      if (filters && filters.topic) {
        whereCondition.question = whereCondition.question || {};
        whereCondition.question.topic = filters.topic;
      }

      if (filters && filters.difficulty) {
        whereCondition.question = whereCondition.question || {};
        whereCondition.question.difficulty = filters.difficulty;
      }

      const answers = await this.userAnswersRepo.find({
        where: whereCondition,
        relations: ['user', 'question'],
        order: { answer_id: 'DESC' },
      });

      const result: Array<{
        questionText: string;
        topic: string;
        difficulty: string;
        userAnswer: string;
        isCorrect: boolean;
      }> = [];

      for (const ua of answers) {
        result.push({
          questionText: ua.question.question_text,
          topic: ua.question.topic,
          difficulty: ua.question.difficulty,
          userAnswer: ua.user_answer,
          isCorrect: ua.is_correct,
        });
      }

      return result;
    } catch (error) {
      console.error('[USER_ANSWERS] Error fetching user answers:', error);
      throw new InternalServerErrorException('Failed to fetch answers');
    }
  }

  /**
   * Retrieves all user answers from the database.
   *
   * @returns Promise that resolves to array of all UserAnswer entities with relations
   * @throws InternalServerErrorException for database errors
   */
  async getAllUserAnswers(): Promise<UserAnswer[]> {
    try {
      const items = await this.userAnswersRepo.find({
        relations: ['user', 'question'],
      });
      return items;
    } catch (error) {
      console.error('[USER_ANSWERS] Error fetching all:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve user answers.'
      );
    }
  }

  /**
   * Retrieves a single user answer by its ID.
   *
   * @param id - The answer ID to lookup
   * @returns Promise that resolves to UserAnswer entity with relations
   * @throws NotFoundException if user answer doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async getUserAnswerById(id: number): Promise<UserAnswer> {
    try {
      const item = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
        relations: ['user', 'question'],
      });
      if (!item) {
        throw new NotFoundException('User answer not found.');
      }
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[USER_ANSWERS] Error fetching id:', id, error);
      throw new InternalServerErrorException(
        'Unable to retrieve the requested user answer.'
      );
    }
  }

  /**
   * Creates a new user answer record.
   *
   * @param dto - Data transfer object containing user answer details
   * @returns Promise that resolves to the created UserAnswer entity
   * @throws InternalServerErrorException for database errors
   */
  async createUserAnswer(dto: CreateUserAnswerDto): Promise<UserAnswer> {
    try {
      const entity = this.userAnswersRepo.create({
        user_answer: dto.user_answer || '',
        is_correct: dto.is_correct || false,
        user: { user_id: dto.user_id } as any,
        question: { question_id: dto.question_id } as any,
      });

      const saved = await this.userAnswersRepo.save(entity);
      console.log('[USER_ANSWERS] Created id:', saved.answer_id);
      return saved;
    } catch (error) {
      console.error('[USER_ANSWERS] Error creating:', error);
      throw new InternalServerErrorException('Unable to create user answer.');
    }
  }

  /**
   * Updates an existing user answer record.
   *
   * @param id - The answer ID to update
   * @param dto - Data transfer object containing fields to update
   * @returns Promise that resolves to the updated UserAnswer entity
   * @throws NotFoundException if user answer doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async updateUserAnswer(
    id: number,
    dto: UpdateUserAnswerDto
  ): Promise<UserAnswer> {
    try {
      const existing = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
      });
      if (!existing) {
        throw new NotFoundException('User answer not found.');
      }

      if (dto.user_answer !== undefined) existing.user_answer = dto.user_answer;
      if (dto.is_correct !== undefined) existing.is_correct = dto.is_correct;
      if (dto.user_id !== undefined)
        (existing as any).user = { user_id: dto.user_id };
      if (dto.question_id !== undefined)
        (existing as any).question = { question_id: dto.question_id };

      const updated = await this.userAnswersRepo.save(existing);
      console.log('[USER_ANSWERS] Updated id:', updated.answer_id);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[USER_ANSWERS] Error updating id:', id, error);
      throw new InternalServerErrorException('Unable to update user answer.');
    }
  }

  /**
   * Deletes a user answer record.
   *
   * @param id - The answer ID to delete
   * @returns Promise that resolves when the answer is successfully deleted
   * @throws NotFoundException if user answer doesn't exist
   * @throws InternalServerErrorException for database errors
   */
  async deleteUserAnswer(id: number): Promise<void> {
    try {
      const existing = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
      });
      if (!existing) {
        throw new NotFoundException('User answer not found.');
      }

      await this.userAnswersRepo.remove(existing);
      console.log('[USER_ANSWERS] Deleted id:', id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[USER_ANSWERS] Error deleting id:', id, error);
      throw new InternalServerErrorException('Unable to delete user answer.');
    }
  }

  /**
   * Get comprehensive statistics for a user.
   * Calculates overall accuracy, topic-wise performance, and difficulty-wise breakdown.
   *
   * @param userId - The ID of the user to get statistics for
   * @returns Promise that resolves to UserStatisticsDto with comprehensive stats
   * @throws InternalServerErrorException for database errors
   */
  async getUserStatistics(userId: number): Promise<UserStatisticsDto> {
    try {
      // Fetch all user answers with their related question
      const userAnswers = await this.userAnswersRepo.find({
        where: { user: { user_id: userId } },
        relations: ['question'],
      });

      // If no answers, return zero stats
      if (userAnswers.length === 0) {
        return this.getEmptyStatistics();
      }

      // Calculate overall stats
      const totalAnswered = userAnswers.length;
      const correctAnswers = userAnswers.filter((ua) => ua.is_correct).length;
      const accuracy =
        totalAnswered > 0
          ? Math.round((correctAnswers / totalAnswered) * 100)
          : 0;

      // Initialize topics stats
      const topicsData: Record<string, TopicStats> = {
        geometry: this.getEmptyTopicStats(),
        algebra: this.getEmptyTopicStats(),
        arithmetic: this.getEmptyTopicStats(),
        wordProblem: this.getEmptyTopicStats(),
      };

      // Initialize difficulties stats
      const difficultiesData: Record<string, DifficultyStats> = {
        easy: { answered: 0, correct: 0 },
        medium: { answered: 0, correct: 0 },
        hard: { answered: 0, correct: 0 },
      };

      // Go through each answer and update stats
      for (const answer of userAnswers) {
        if (!answer.question) continue;

        const topic = this.normalizeTopicKey(answer.question.topic);
        const difficulty = this.normalizeDifficultyKey(
          answer.question.difficulty
        );
        const isCorrect = answer.is_correct;

        // Update topic stats
        if (topicsData[topic]) {
          topicsData[topic].answered++;
          if (isCorrect) topicsData[topic].correct++;

          // Update topic's difficulty breakdown safely
          const difficultyBreakdown = topicsData[topic]
            .byDifficulty as unknown as Record<string, DifficultyStats>;

          if (difficultyBreakdown[difficulty]) {
            difficultyBreakdown[difficulty].answered++;
            if (isCorrect) difficultyBreakdown[difficulty].correct++;
          }
        }

        // Update difficulty stats
        if (difficultiesData[difficulty]) {
          difficultiesData[difficulty].answered++;
          if (isCorrect) difficultiesData[difficulty].correct++;
        }
      }

      // Return the final structured stats
      return {
        totalAnswered,
        correctAnswers,
        accuracy,
        topics: {
          geometry: topicsData.geometry,
          algebra: topicsData.algebra,
          arithmetic: topicsData.arithmetic,
          wordProblem: topicsData.wordProblem,
        },
        difficulties: {
          easy: difficultiesData.easy,
          medium: difficultiesData.medium,
          hard: difficultiesData.hard,
        },
      };
    } catch (error) {
      console.error('[USER_ANSWERS] Error fetching user statistics:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve statistics at this time.'
      );
    }
  }

  /**
   * Helper method that returns an empty statistics structure.
   * Used when a user has no answered questions yet.
   *
   * @returns UserStatisticsDto with all values set to zero
   */
  private getEmptyStatistics(): UserStatisticsDto {
    return {
      totalAnswered: 0,
      correctAnswers: 0,
      accuracy: 0,
      topics: {
        geometry: this.getEmptyTopicStats(),
        algebra: this.getEmptyTopicStats(),
        arithmetic: this.getEmptyTopicStats(),
        wordProblem: this.getEmptyTopicStats(),
      },
      difficulties: {
        easy: { answered: 0, correct: 0 },
        medium: { answered: 0, correct: 0 },
        hard: { answered: 0, correct: 0 },
      },
    };
  }

  /**
   * Helper method that returns an empty topic statistics structure.
   * Initializes all difficulty levels with zero values.
   *
   * @returns TopicStats with all counters set to zero
   */
  private getEmptyTopicStats(): TopicStats {
    return {
      answered: 0,
      correct: 0,
      byDifficulty: {
        easy: { answered: 0, correct: 0 },
        medium: { answered: 0, correct: 0 },
        hard: { answered: 0, correct: 0 },
      },
    };
  }

  /**
   * Helper method that normalizes topic names to camelCase keys.
   * Maps display names to consistent object property names.
   *
   * @param topic - The topic name from the database (e.g., "Word Problem")
   * @returns Normalized camelCase key (e.g., "wordProblem")
   */
  private normalizeTopicKey(topic: string): string {
    const topicMap: Record<string, string> = {
      Geometry: 'geometry',
      Algebra: 'algebra',
      Arithmetic: 'arithmetic',
      'Word Problem': 'wordProblem',
    };
    return topicMap[topic] || topic.toLowerCase();
  }

  /**
   * Helper method that normalizes difficulty names to lowercase keys.
   * Ensures consistent difficulty level keys regardless of input casing.
   *
   * @param difficulty - The difficulty level from the database (e.g., "Easy", "MEDIUM")
   * @returns Lowercase normalized key (e.g., "easy", "medium")
   */
  private normalizeDifficultyKey(difficulty: string): string {
    return difficulty.toLowerCase();
  }
}
