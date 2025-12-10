import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HandwritingService } from './handwriting.service';
import { QuestionsService } from '../questions/questions.service';
import { UserAnswersService } from '../user-answers/user-answers.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { RecognizeHandwritingInput } from './handwriting.inputs';
import {
  HandwritingRecognitionResponse,
  ModelStatusResponse,
} from './handwriting.types';

/**
 * GraphQL resolver for handwriting recognition operations
 *
 * @authentication All mutations require valid JWT token
 */
@Resolver()
export class HandwritingResolver {
  constructor(
    private readonly handwritingService: HandwritingService,
    private readonly questionsService: QuestionsService,
    private readonly userAnswersService: UserAnswersService
  ) {}

  /**
   * Recognize handwritten math answer and validate it
   *
   * @authentication Required - user must be logged in
   *
   * @param input - Handwriting data and question ID
   * @param user - Current authenticated user
   *
   * @returns Recognition result with validation and points
   *
   * @throws BadRequestException - Invalid image data or question not found
   * @throws UnauthorizedException - User not authenticated
   *
   * @example
   * ```graphql
   * mutation {
   *   recognizeHandwriting(input: {
   *     handwritingData: "data:image/png;base64,iVBORw0KGgoAAAANS..."
   *     questionId: 1
   *   }) {
   *     recognizedText
   *     confidence
   *     isCorrect
   *     correctAnswer
   *     feedback
   *     points
   *     userAnswerId
   *   }
   * }
   * ```
   */
  @Mutation(() => HandwritingRecognitionResponse, {
    description:
      'Recognize handwritten math answer and validate against question',
  })
  @UseGuards(GqlAuthGuard)
  async recognizeHandwriting(
    @Args('input') input: RecognizeHandwritingInput,
    @CurrentUser() user: User
  ): Promise<HandwritingRecognitionResponse> {
    try {
      // Get the question to validate against
      const question = await this.questionsService.getQuestionById(
        input.questionId
      );

      // Recognize handwriting
      const recognition = await this.handwritingService.recognizeHandwriting(
        input.handwritingData
      );

      // Validate answer
      const validation = this.handwritingService.validateAnswer(
        recognition.recognizedText,
        question.correct_answer
      );

      // Submit answer using QuestionsService (handles saving)
      const result = await this.questionsService.submitAnswer(
        user.user_id,
        input.questionId,
        { userAnswer: recognition.recognizedText }
      );

      return {
        recognizedText: recognition.recognizedText,
        confidence: recognition.confidence,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        feedback: validation.feedback,
        points: validation.points,
        userAnswerId: result.userAnswerId ?? undefined,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get status of ML model for handwriting recognition
   *
   * @authentication Not required - public endpoint
   *
   * @returns Model status and type
   *
   * @example
   * ```graphql
   * query {
   *   handwritingModelStatus {
   *     loaded
   *     modelType
   *   }
   * }
   * ```
   */
  @Query(() => ModelStatusResponse, {
    description: 'Get status of handwriting recognition model',
  })
  async handwritingModelStatus(): Promise<ModelStatusResponse> {
    return this.handwritingService.getModelStatus();
  }
}
