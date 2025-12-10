import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

/**
 * Response type for handwriting recognition
 */
@ObjectType()
export class HandwritingRecognitionResponse {
  /**
   * Text recognized from handwriting
   */
  @Field(() => String, {
    description: 'Recognized text from handwritten input',
  })
  recognizedText!: string;

  /**
   * Confidence score of recognition (0-1)
   */
  @Field(() => Float, {
    description: 'Confidence score of the recognition (0.0 to 1.0)',
  })
  confidence!: number;

  /**
   * Whether the answer is correct
   */
  @Field(() => Boolean, {
    description: 'Whether the recognized answer is correct',
  })
  isCorrect!: boolean;

  /**
   * Correct answer for the question
   */
  @Field(() => String, {
    description: 'The correct answer',
  })
  correctAnswer!: string;

  /**
   * Feedback message
   */
  @Field(() => String, {
    description: 'Feedback message for the user',
  })
  feedback!: string;

  /**
   * Points awarded (bonus for handwritten answers)
   */
  @Field(() => Int, {
    description:
      'Points awarded for this answer (15 for correct handwritten, 0 for incorrect)',
  })
  points!: number;

  /**
   * User answer ID if answer was recorded
   */
  @Field(() => Int, {
    nullable: true,
    description: 'ID of the created user answer record',
  })
  userAnswerId?: number;
}

/**
 * Model status response
 */
@ObjectType()
export class ModelStatusResponse {
  @Field(() => Boolean, {
    description: 'Whether the ML model is loaded and ready',
  })
  loaded!: boolean;

  @Field(() => String, {
    description: 'Type of model being used',
  })
  modelType!: string;
}
