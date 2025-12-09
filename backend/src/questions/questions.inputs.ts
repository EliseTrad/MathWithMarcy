import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import {
  IsValidTopic,
  IsValidDifficulty,
} from '../common/validators/custom.validators';

/**
 * GraphQL Input for Submitting an Answer
 */
@InputType()
export class SubmitAnswerInput {
  @Field(() => Int)
  @IsNotEmpty({ message: 'Question ID is required' })
  questionId!: number;

  @Field()
  @IsString({ message: 'Answer must be a text value' })
  @IsNotEmpty({ message: 'Answer is required' })
  @MaxLength(255, { message: 'Answer cannot exceed 255 characters' })
  userAnswer!: string;
}

/**
 * GraphQL Input for Filtering Questions
 */
@InputType()
export class GetQuestionsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsValidTopic({
    message:
      'Topic must be one of: addition, subtraction, multiplication, division, geometry, algebra, fractions, decimals, word-problem',
  })
  topic?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsValidDifficulty({
    message: 'Difficulty must be one of: Easy, Medium, Hard',
  })
  difficulty?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit?: number;
}

/**
 * GraphQL Input for Creating a Question (admin use)
 */
@InputType()
export class CreateQuestionInput {
  @Field()
  @IsNotEmpty({ message: 'Topic is required' })
  @IsValidTopic()
  topic!: string;

  @Field()
  @IsNotEmpty({ message: 'Difficulty is required' })
  @IsValidDifficulty()
  difficulty!: string;

  @Field()
  @IsNotEmpty({ message: 'Question text is required' })
  @IsString()
  question_text!: string;

  @Field()
  @IsNotEmpty({ message: 'Correct answer is required' })
  @IsString()
  @MaxLength(255)
  correct_answer!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hint?: string;
}

/**
 * GraphQL Input for Updating a Question
 */
@InputType()
export class UpdateQuestionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsValidTopic()
  topic?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsValidDifficulty()
  difficulty?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  question_text?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  correct_answer?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hint?: string;
}
