import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionType, AnswerResponse } from './questions.types';
import {
  CreateQuestionInput,
  GetQuestionsInput,
  SubmitAnswerInput,
  UpdateQuestionInput,
} from './questions.inputs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

/**
 * GraphQL Resolver for Question Operations
 *
 * Handles all question-related queries and mutations including fetching questions,
 * submitting answers, and managing question CRUD operations.
 * All operations require authentication via JWT token.
 *
 * @class QuestionsResolver
 * @authentication Required for all operations
 */
@ApiTags('Questions')
@ApiBearerAuth('JWT-auth')
@Resolver(() => QuestionType)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * Get questions with optional filtering by topic and difficulty
   *
   * Returns all questions if no filters provided, or filtered questions based on topic/difficulty.
   * Results can be limited and randomized using input parameters.
   *
   * @query questions
   * @param {GetQuestionsInput} [input] - Optional filter criteria
   * @param {string} [input.topic] - Filter by topic (Geometry, Algebra, Arithmetic, WordProblem)
   * @param {string} [input.difficulty] - Filter by difficulty (Easy, Medium, Hard)
   * @param {number} [input.limit] - Maximum number of questions to return
   * @returns {Promise<QuestionType[]>} Array of question objects
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When filter values are invalid (not in predefined lists)
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * query {
   *   questions(input: {
   *     topic: "Algebra"
   *     difficulty: "Medium"
   *     limit: 10
   *   }) {
   *     question_id
   *     topic
   *     difficulty
   *     question_text
   *     hint
   *   }
   * }
   */
  @Query(() => [QuestionType], {
    description: 'Get questions with optional topic and difficulty filters',
  })
  @UseGuards(GqlAuthGuard)
  async questions(
    @Args('input', { nullable: true }) input?: GetQuestionsInput
  ): Promise<QuestionType[]> {
    if (input) {
      return await this.questionsService.getFilteredQuestions(input as any);
    }
    return await this.questionsService.getAllQuestions();
  }

  /**
   * Get a single question by its unique identifier
   *
   * Returns detailed information for a specific question including the correct answer.
   *
   * @query question
   * @param {number} id - The unique question ID
   * @returns {Promise<QuestionType|null>} Question object or null if not found
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When question ID is invalid (non-integer or <= 0)
   * @throws {NotFoundException} When question with specified ID doesn't exist
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * query {
   *   question(id: 5) {
   *     question_id
   *     topic
   *     difficulty
   *     question_text
   *     correct_answer
   *     hint
   *   }
   * }
   */
  @Query(() => QuestionType, {
    description: 'Get a single question by ID',
    nullable: true,
  })
  @UseGuards(GqlAuthGuard)
  async question(
    @Args('id', { type: () => Int }) id: number
  ): Promise<QuestionType | null> {
    return await this.questionsService.getQuestionById(id);
  }

  /**
   * Submit an answer to a question and record the result
   *
   * Performs case-insensitive answer comparison, creates a user answer record,
   * and returns immediate feedback. Records are associated with the authenticated user.
   *
   * @mutation submitAnswer
   * @param {number} questionId - The ID of the question being answered
   * @param {string} userAnswer - The user's submitted answer (trimmed and case-insensitive comparison)
   * @param {object} user - Current user context from JWT token
   * @returns {Promise<AnswerResponse>} Object containing correctness status, feedback message, correct answer, and recorded answer ID
   * @returns {boolean} AnswerResponse.is_correct - Whether the answer was correct
   * @returns {string} AnswerResponse.message - Feedback message ("Correct! Great job!" or "Incorrect. Don't give up!")
   * @returns {string} AnswerResponse.correct_answer - The correct answer for the question
   * @returns {number|null} AnswerResponse.user_answer_id - ID of the recorded answer in database
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When questionId is invalid
   * @throws {NotFoundException} When question doesn't exist
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * mutation {
   *   submitAnswer(questionId: 5, userAnswer: "42") {
   *     is_correct
   *     message
   *     correct_answer
   *     user_answer_id
   *   }
   * }
   */
  @Mutation(() => AnswerResponse, {
    description: 'Submit an answer to a question',
  })
  @UseGuards(GqlAuthGuard)
  async submitAnswer(
    @Args('questionId', { type: () => Int }) questionId: number,
    @Args('userAnswer') userAnswer: string,
    @CurrentUser() user: { id: string | number; email: string }
  ): Promise<AnswerResponse> {
    const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    const result = await this.questionsService.submitAnswer(
      userId,
      questionId,
      { userAnswer } as any
    );

    return {
      is_correct: result.isCorrect,
      message: result.isCorrect
        ? 'Correct! Great job!'
        : "Incorrect. Don't give up!",
      correct_answer: result.correctAnswer,
      user_answer_id: result.userAnswerId,
    };
  }

  /**
   * Create a new question in the system (admin operation)
   *
   * Creates a new question with specified topic, difficulty, text, answer, and optional hint.
   * All fields except hint are required and validated.
   *
   * @mutation createQuestion
   * @param {CreateQuestionInput} input - Question creation data
   * @param {string} input.topic - Topic category (Geometry, Algebra, Arithmetic, WordProblem)
   * @param {string} input.difficulty - Difficulty level (Easy, Medium, Hard)
   * @param {string} input.question_text - Question content (10-1000 chars)
   * @param {string} input.correct_answer - Correct answer (max 255 chars)
   * @param {string} [input.hint] - Optional hint text (max 500 chars)
   * @returns {Promise<QuestionType>} Created question with generated question_id
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When validation fails (invalid topic/difficulty or length constraints)
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * mutation {
   *   createQuestion(input: {
   *     topic: "Algebra"
   *     difficulty: "Medium"
   *     question_text: "Solve for x: 2x + 5 = 15"
   *     correct_answer: "5"
   *     hint: "Subtract 5 from both sides first"
   *   }) {
   *     question_id
   *     topic
   *     difficulty
   *     question_text
   *   }
   * }
   */
  @Mutation(() => QuestionType, {
    description: 'Create a new question',
  })
  @UseGuards(GqlAuthGuard)
  async createQuestion(
    @Args('input') input: CreateQuestionInput
  ): Promise<QuestionType> {
    return await this.questionsService.createQuestion(input as any);
  }

  /**
   * Update an existing question (admin operation)
   *
   * Performs partial update - only provided fields are modified, others remain unchanged.
   * All fields are optional in the update input.
   *
   * @mutation updateQuestion
   * @param {number} id - Question ID to update
   * @param {UpdateQuestionInput} input - Fields to update (all optional)
   * @param {string} [input.topic] - New topic category
   * @param {string} [input.difficulty] - New difficulty level
   * @param {string} [input.question_text] - New question content
   * @param {string} [input.correct_answer] - New correct answer
   * @param {string} [input.hint] - New hint text
   * @returns {Promise<QuestionType>} Updated question object
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When question ID or validation fails
   * @throws {NotFoundException} When question doesn't exist
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @example
   * mutation {
   *   updateQuestion(id: 5, input: {
   *     difficulty: "Hard"
   *     hint: "Use the quadratic formula"
   *   }) {
   *     question_id
   *     difficulty
   *     hint
   *     updated_at
   *   }
   * }
   */
  @Mutation(() => QuestionType, {
    description: 'Update an existing question',
  })
  @UseGuards(GqlAuthGuard)
  async updateQuestion(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateQuestionInput
  ): Promise<QuestionType> {
    return await this.questionsService.updateQuestion(id, input as any);
  }

  /**
   * Delete a question permanently (admin operation)
   *
   * Removes the question from the database. Related user answers may be affected by cascading rules.
   * This operation is irreversible.
   *
   * @mutation deleteQuestion
   * @param {number} id - Question ID to delete
   * @returns {Promise<boolean>} True when successfully deleted
   * @throws {UnauthorizedException} When JWT token is missing or invalid
   * @throws {BadRequestException} When question ID is invalid
   * @throws {NotFoundException} When question doesn't exist
   * @throws {InternalServerErrorException} For database errors
   * @authentication Required - JWT token in Authorization header
   * @warning This operation is irreversible
   * @example
   * mutation {
   *   deleteQuestion(id: 5)
   * }
   */
  @Mutation(() => Boolean, {
    description: 'Delete a question',
  })
  @UseGuards(GqlAuthGuard)
  async deleteQuestion(
    @Args('id', { type: () => Int }) id: number
  ): Promise<boolean> {
    await this.questionsService.deleteQuestion(id);
    return true;
  }
}
