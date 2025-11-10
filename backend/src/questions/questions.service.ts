import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Question } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionsFilterDto } from './dto/get-questions-filter.dto';
import { UserAnswer } from '../user-answers/user-answer.entity';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

/**
 * Service for managing questions (pure data access and simple orchestration).
 * No business rules beyond basic existence checks and persistence.
 */
@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
    @InjectRepository(UserAnswer)
    private readonly userAnswersRepo: Repository<UserAnswer>
  ) {}

  /** Retrieve all questions. */
  async getAllQuestions(): Promise<Question[]> {
    try {
      const questions = await this.questionsRepo.find();
      return questions;
    } catch (error) {
      console.error('[QUESTIONS] Error fetching all questions:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve questions at this time.'
      );
    }
  }

  /**
   * Retrieve questions with optional filtering by topic and difficulty.
   * Optionally return random questions.
   */
  async getFilteredQuestions(
    filters: GetQuestionsFilterDto
  ): Promise<Question[]> {
    try {
      const validTopics = [
        'Geometry',
        'Algebra',
        'Arithmetic',
        'WordProblem',
      ] as const;
      const validDifficulties = ['Easy', 'Medium', 'Hard'] as const;

      // Only pass valid filters
      const topicFilter =
        filters.topic &&
        validTopics.includes(filters.topic as (typeof validTopics)[number])
          ? { topic: filters.topic }
          : {};
      const difficultyFilter =
        filters.difficulty &&
        validDifficulties.includes(
          filters.difficulty as (typeof validDifficulties)[number]
        )
          ? { difficulty: filters.difficulty }
          : {};

      // Fetch questions
      let questions = await this.questionsRepo.find({
        where: { ...topicFilter, ...difficultyFilter },
        order: { question_id: 'ASC' },
      });

      // Randomize if requested
      if (filters.random === 'true') {
        questions = questions.sort(() => Math.random() - 0.5);
      }

      console.log('[QUESTIONS] Filtered questions count:', questions.length);
      return questions;
    } catch (error) {
      console.error('[QUESTIONS] Error fetching filtered questions:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve questions at this time.'
      );
    }
  }

  /**
   * Submit an answer to a question.
   * Stores the answer and returns whether it was correct.
   */
  async submitAnswer(
    userId: number,
    questionId: number,
    dto: SubmitAnswerDto
  ): Promise<{ isCorrect: boolean; correctAnswer: string }> {
    try {
      // Find the question
      const question = await this.questionsRepo.findOne({
        where: { question_id: questionId },
      });

      if (!question) {
        throw new NotFoundException('Question not found.');
      }

      // Check if answer is correct (case-insensitive, trimmed)
      const userAnswer = dto.userAnswer.trim().toLowerCase();
      const correctAnswer = question.correct_answer.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      // Create user answer record
      const userAnswerEntity = this.userAnswersRepo.create({
        user_answer: dto.userAnswer,
        is_correct: isCorrect,
      });

      // Set foreign key relations
      (userAnswerEntity as any).user = { user_id: userId };
      (userAnswerEntity as any).question = { question_id: questionId };

      await this.userAnswersRepo.save(userAnswerEntity);

      return {
        isCorrect,
        correctAnswer: question.correct_answer,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('[QUESTIONS] Error submitting answer:', error);
      throw new InternalServerErrorException(
        'Unable to submit answer at this time.'
      );
    }
  }

  /** Retrieve a single question by its ID. */
  async getQuestionById(id: number): Promise<Question> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid question id.');
      }
      const question = await this.questionsRepo.findOne({
        where: { question_id: id },
      });

      if (!question) {
        console.warn('[QUESTIONS] Question not found for id:', id);
        throw new NotFoundException('Question not found.');
      }

      return question;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error('[QUESTIONS] Error fetching question by id:', id, error);
      throw new InternalServerErrorException(
        'Unable to retrieve the requested question.'
      );
    }
  }

  /** Create a new question. */
  async createQuestion(dto: CreateQuestionDto): Promise<Question> {
    try {
      const entity = this.questionsRepo.create({
        topic: dto.topic,
        difficulty: dto.difficulty,
        question_text: dto.question_text,
        correct_answer: dto.correct_answer,
        hint: dto.hint ?? null,
      });

      const saved = await this.questionsRepo.save(entity);
      return saved;
    } catch (error) {
      console.error('[QUESTIONS] Error creating question:', error);
      // Re-throw as internal error; DTO already validates input shape.
      throw new InternalServerErrorException(
        'Unable to create question. Please try again later.'
      );
    }
  }

  /** Update an existing question by ID. */
  async updateQuestion(id: number, dto: UpdateQuestionDto): Promise<Question> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid question id.');
      }
      const existing = await this.questionsRepo.findOne({
        where: { question_id: id },
      });

      if (!existing) {
        console.warn('[QUESTIONS] Question not found for update, id:', id);
        throw new NotFoundException('Question not found.');
      }

      // Merge only provided fields (dto is already trimmed/validated)
      if (dto.topic !== undefined) existing.topic = dto.topic;
      if (dto.difficulty !== undefined) existing.difficulty = dto.difficulty;
      if (dto.question_text !== undefined)
        existing.question_text = dto.question_text;
      if (dto.correct_answer !== undefined)
        existing.correct_answer = dto.correct_answer;
      if (dto.hint !== undefined) existing.hint = dto.hint ?? null;

      const updated = await this.questionsRepo.save(existing);
      console.log('[QUESTIONS] Question updated id:', updated.question_id);
      return updated;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error('[QUESTIONS] Error updating question id:', id, error);
      throw new InternalServerErrorException('Unable to update question.');
    }
  }

  /** Delete a question by ID. */
  async deleteQuestion(id: number): Promise<void> {
    console.log('[QUESTIONS] Deleting question id:', id);
    try {
      if (!Number.isInteger(id) || id <= 0) {
        console.warn('[QUESTIONS] Invalid id for deleteQuestion:', id);
        throw new BadRequestException('Invalid question id.');
      }
      const existing = await this.questionsRepo.findOne({
        where: { question_id: id },
      });

      if (!existing) {
        console.warn('[QUESTIONS] Question not found for delete, id:', id);
        throw new NotFoundException('Question not found.');
      }

      await this.questionsRepo.remove(existing);
      console.log('[QUESTIONS] Question deleted id:', id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.error('[QUESTIONS] Error deleting question id:', id, error);
      throw new InternalServerErrorException('Unable to delete question.');
    }
  }
}
