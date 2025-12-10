import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Input type for handwriting recognition mutation
 */
@InputType()
export class RecognizeHandwritingInput {
  /**
   * Base64 encoded image of handwritten input
   * Should be a data URL or plain base64 string
   */
  @Field(() => String, {
    description: 'Base64 encoded image of handwritten math expression',
  })
  @IsString()
  @IsNotEmpty({ message: 'Handwriting data is required' })
  handwritingData!: string;

  /**
   * Question ID to validate answer against
   */
  @Field(() => Int, {
    description: 'ID of the question being answered',
  })
  @IsNotEmpty({ message: 'Question ID is required' })
  questionId!: number;
}
