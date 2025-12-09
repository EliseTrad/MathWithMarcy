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

  /**
   * Retrieves all questions from the database without any filtering or ordering.
   *
   * Business logic: Simple data retrieval operation for administrative or bulk operations.
   *
   * @returns {Promise<Question[]>} Array of all questions in the database
   * @throws {InternalServerErrorException} When database operation fails
   */
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
   * Retrieves questions with optional filtering by topic and difficulty, with support for randomization.
   *
   * Business logic: Validates filter criteria against predefined valid values and applies randomization when requested.
   *
   * @param {GetQuestionsFilterDto} filters - Filter criteria including topic, difficulty, and random flag
   * @param {string} [filters.topic] - Question topic (Geometry, Algebra, Arithmetic, WordProblem)
   * @param {string} [filters.difficulty] - Question difficulty (Easy, Medium, Hard)
   * @param {string} [filters.random] - Whether to randomize results ('true' for random order)
   * @returns {Promise<Question[]>} Array of filtered questions, optionally in random order
   * @throws {BadRequestException} When filter values are invalid
   * @throws {InternalServerErrorException} When database operation fails or filter validation errors occur
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

      // Validate topic filter if provided
      if (
        filters.topic &&
        !validTopics.includes(filters.topic as (typeof validTopics)[number])
      ) {
        throw new BadRequestException(
          `Invalid topic. Must be one of: ${validTopics.join(', ')}`
        );
      }

      // Validate difficulty filter if provided
      if (
        filters.difficulty &&
        !validDifficulties.includes(
          filters.difficulty as (typeof validDifficulties)[number]
        )
      ) {
        throw new BadRequestException(
          `Invalid difficulty. Must be one of: ${validDifficulties.join(', ')}`
        );
      }

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

      console.log(
        '[QUESTIONS] Filtered questions count:',
        questions.length,
        'Filters:',
        filters
      );
      return questions;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('[QUESTIONS] Error fetching filtered questions:', error);
      throw new InternalServerErrorException(
        'Unable to retrieve questions at this time. Please try again later.'
      );
    }
  }

  /**
   * Processes a user's answer submission for a specific question and records the result.
   *
   * Business logic: Performs case-insensitive answer comparison, creates user answer record,
   * and establishes foreign key relationships with user and question entities.
   *
   * @param {number} userId - ID of the user submitting the answer
   * @param {number} questionId - ID of the question being answered
   * @param {SubmitAnswerDto} dto - Answer submission data
   * @param {string} dto.userAnswer - The user's submitted answer
   * @returns {Promise<{isCorrect: boolean; correctAnswer: string}>} Result object containing correctness status and the correct answer
   * @throws {BadRequestException} When userId or questionId is invalid
   * @throws {NotFoundException} When the specified question doesn't exist
   * @throws {InternalServerErrorException} When database operations fail
   */
  async submitAnswer(
    userId: number,
    questionId: number,
    dto: SubmitAnswerDto
  ): Promise<{
    isCorrect: boolean;
    correctAnswer: string;
    userAnswerId: number | null;
  }> {
    try {
      // Validate input IDs
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestException('Invalid user ID provided.');
      }

      if (!Number.isInteger(questionId) || questionId <= 0) {
        throw new BadRequestException('Invalid question ID provided.');
      }

      // Find the question
      const question = await this.questionsRepo.findOne({
        where: { question_id: questionId },
      });

      if (!question) {
        console.warn('[QUESTIONS] Question not found for id:', questionId);
        throw new NotFoundException(
          `Question with ID ${questionId} not found. It may have been deleted.`
        );
      }

      // Validate that question has a correct answer
      if (!question.correct_answer) {
        console.error(
          '[QUESTIONS] Question missing correct answer:',
          questionId
        );
        throw new InternalServerErrorException(
          'This question is not properly configured. Please try another question.'
        );
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

      const savedAnswer = await this.userAnswersRepo.save(userAnswerEntity);

      console.log(
        '[QUESTIONS] Answer submitted - User:',
        userId,
        'Question:',
        questionId,
        'Correct:',
        isCorrect
      );

      return {
        isCorrect,
        correctAnswer: question.correct_answer,
        userAnswerId: savedAnswer.answer_id ?? null,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('[QUESTIONS] Error submitting answer:', error);
      throw new InternalServerErrorException(
        'Unable to submit answer at this time. Please try again.'
      );
    }
  }

  /**
   * Retrieves a single question by its unique identifier.
   *
   * Business logic: Validates question ID format and ensures question exists before returning.
   *
   * @param {number} id - The unique identifier of the question to retrieve
   * @returns {Promise<Question>} The requested question entity
   * @throws {BadRequestException} When the provided ID is invalid (non-integer or <= 0)
   * @throws {NotFoundException} When no question exists with the specified ID
   * @throws {InternalServerErrorException} When database operation fails
   */
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

  /**
   * Creates a new question in the database with the provided data.
   *
   * Business logic: Creates question entity from DTO data, handling optional hint field.
   * Input validation is performed at the DTO level.
   *
   * @param {CreateQuestionDto} dto - Question creation data
   * @param {string} dto.topic - Question topic category
   * @param {string} dto.difficulty - Question difficulty level
   * @param {string} dto.question_text - The question content/text
   * @param {string} dto.correct_answer - The correct answer for the question
   * @param {string} [dto.hint] - Optional hint for the question
   * @returns {Promise<Question>} The newly created question entity with generated ID
   * @throws {InternalServerErrorException} When database operation fails or question creation is unsuccessful
   */
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

  /**
   * Updates an existing question with new data, merging only provided fields.
   *
   * Business logic: Validates question ID, verifies question exists, and performs partial updates
   * by merging only the fields provided in the DTO while preserving existing values for omitted fields.
   *
   * @param {number} id - The unique identifier of the question to update
   * @param {UpdateQuestionDto} dto - Partial question update data
   * @param {string} [dto.topic] - Updated question topic category
   * @param {string} [dto.difficulty] - Updated question difficulty level
   * @param {string} [dto.question_text] - Updated question content/text
   * @param {string} [dto.correct_answer] - Updated correct answer
   * @param {string} [dto.hint] - Updated hint (can be set to null)
   * @returns {Promise<Question>} The updated question entity
   * @throws {BadRequestException} When the provided ID is invalid (non-integer or <= 0)
   * @throws {NotFoundException} When no question exists with the specified ID
   * @throws {InternalServerErrorException} When database operation fails
   */
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

  /**
   * Permanently removes a question from the database by its unique identifier.
   *
   * Business logic: Validates question ID format, verifies question exists before deletion,
   * and performs hard delete from the database. Related user answers may be affected by cascading rules.
   *
   * @param {number} id - The unique identifier of the question to delete
   * @returns {Promise<void>} Resolves when deletion is complete
   * @throws {BadRequestException} When the provided ID is invalid (non-integer or <= 0)
   * @throws {NotFoundException} When no question exists with the specified ID
   * @throws {InternalServerErrorException} When database operation fails
   */
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
