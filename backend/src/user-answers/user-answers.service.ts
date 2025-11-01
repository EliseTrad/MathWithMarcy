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
      const qb = this.userAnswersRepo
        .createQueryBuilder('ua')
        .innerJoin('ua.user', 'u')
        .innerJoin('ua.question', 'q')
        .where('u.user_id = :userId', { userId });

      if (filters?.topic) {
        qb.andWhere('q.topic = :topic', { topic: filters.topic });
      }

      if (filters?.difficulty) {
        qb.andWhere('q.difficulty = :difficulty', {
          difficulty: filters.difficulty,
        });
      }

      const rows = await qb
        .select([
          'q.question_text AS questionText',
          'q.topic AS topic',
          'q.difficulty AS difficulty',
          'ua.user_answer AS userAnswer',
          'ua.is_correct AS isCorrect',
        ])
        .orderBy('ua.answer_id', 'DESC')
        .getRawMany<{
          questionText: string;
          topic: string;
          difficulty: string;
          userAnswer: string;
          isCorrect: boolean;
        }>();

      return rows;
    } catch (error) {
      console.error('[USER_ANSWERS] Error filtering user answers:', error);
      throw new InternalServerErrorException('Failed to fetch answers');
    }
  }

  async getAllUserAnswers(): Promise<UserAnswer[]> {
    console.log('[USER_ANSWERS] Fetching all user answers');
    try {
      const items = await this.userAnswersRepo.find({
        relations: ['user', 'question'],
      });
      console.log('[USER_ANSWERS] fetched:', items.length);
      return items;
    } catch (error) {
      console.error('[USER_ANSWERS] Error fetching all:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve user answers.'
      );
    }
  }

  async getUserAnswerById(id: number): Promise<UserAnswer> {
    console.log('[USER_ANSWERS] Fetching by id:', id);
    try {
      const item = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
        relations: ['user', 'question'],
      });
      if (!item) {
        console.warn('[USER_ANSWERS] Not found id:', id);
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

  async createUserAnswer(dto: CreateUserAnswerDto): Promise<UserAnswer> {
    console.log(
      '[USER_ANSWERS] Creating answer for user:',
      dto.user_id,
      'question:',
      dto.question_id
    );
    try {
      const entity: Partial<UserAnswer> = this.userAnswersRepo.create({
        user_answer: dto.user_answer ?? '',
        is_correct: dto.is_correct ?? false,
      });

      // Set relation placeholders by id so TypeORM can resolve/attach them
      (entity as any).user = { user_id: dto.user_id };
      (entity as any).question = { question_id: dto.question_id };

      const saved = await this.userAnswersRepo.save(entity as UserAnswer);
      console.log(
        '[USER_ANSWERS] Created id:',
        (saved as UserAnswer).answer_id
      );
      return saved as UserAnswer;
    } catch (error) {
      console.error('[USER_ANSWERS] Error creating:', error);
      throw new InternalServerErrorException('Unable to create user answer.');
    }
  }

  async updateUserAnswer(
    id: number,
    dto: UpdateUserAnswerDto
  ): Promise<UserAnswer> {
    console.log('[USER_ANSWERS] Updating id:', id);
    try {
      const existing = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
      });
      if (!existing) {
        console.warn('[USER_ANSWERS] Not found for update id:', id);
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

  async deleteUserAnswer(id: number): Promise<void> {
    console.log('[USER_ANSWERS] Deleting id:', id);
    try {
      const existing = await this.userAnswersRepo.findOne({
        where: { answer_id: id },
      });
      if (!existing) {
        console.warn('[USER_ANSWERS] Not found for delete id:', id);
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
   * Get comprehensive statistics for a user
   */
  async getUserStatistics(userId: number): Promise<UserStatisticsDto> {
    console.log('[USER_ANSWERS] Fetching statistics for user:', userId);

    try {
      // Fetch all user answers with related question data
      const userAnswers = await this.userAnswersRepo
        .createQueryBuilder('ua')
        .leftJoinAndSelect('ua.question', 'q')
        .where('ua.user.user_id = :userId', { userId })
        .getMany();

      console.log(
        '[USER_ANSWERS] Found',
        userAnswers.length,
        'answers for user:',
        userId
      );

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

      // Process each answer
      userAnswers.forEach((answer) => {
        if (!answer.question) return;

        const topic = this.normalizeTopicKey(answer.question.topic);
        const difficulty = this.normalizeDifficultyKey(
          answer.question.difficulty
        );
        const isCorrect = answer.is_correct;

        // Update topic stats
        if (topicsData[topic]) {
          topicsData[topic].answered++;
          if (isCorrect) topicsData[topic].correct++;

          // Update topic difficulty breakdown
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
      });

      console.log('[USER_ANSWERS] Calculated stats:', {
        totalAnswered,
        correctAnswers,
        accuracy,
      });

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
   * Helper: Return empty statistics structure
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
   * Helper: Return empty topic stats
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
   * Helper: Normalize topic name to camelCase key
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
   * Helper: Normalize difficulty to lowercase key
   */
  private normalizeDifficultyKey(difficulty: string): string {
    return difficulty.toLowerCase();
  }
}
