import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL Question Type
 */
@ObjectType()
export class QuestionType {
  @Field(() => Int)
  question_id!: number;

  @Field()
  topic!: string;

  @Field()
  difficulty!: string;

  @Field()
  question_text!: string;

  @Field()
  correct_answer!: string;

  @Field(() => String, { nullable: true })
  hint!: string | null;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;
}

/**
 * GraphQL Answer Response Type
 * Returned after submitting an answer
 */
@ObjectType()
export class AnswerResponse {
  @Field()
  is_correct!: boolean;

  @Field()
  message!: string;

  @Field()
  correct_answer!: string;

  @Field(() => Int, { nullable: true })
  user_answer_id!: number | null;
}
