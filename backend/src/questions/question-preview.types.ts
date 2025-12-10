import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL Question Preview Type (without answer)
 * Used for practice mode - prevents cheating by not exposing correct answer
 */
@ObjectType()
export class QuestionPreviewType {
  @Field(() => Int, { name: 'questionId' })
  questionId!: number;

  @Field()
  topic!: string;

  @Field()
  difficulty!: string;

  @Field({ name: 'questionText' })
  questionText!: string;

  @Field(() => String, { nullable: true })
  hint!: string | null;

  @Field({ name: 'createdAt' })
  createdAt!: Date;

  @Field({ name: 'updatedAt' })
  updatedAt!: Date;
}

/**
 * Paginated Questions Response
 */
@ObjectType()
export class PaginatedQuestionsResponse {
  @Field(() => [QuestionPreviewType])
  items!: QuestionPreviewType[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  offset!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Boolean)
  hasMore!: boolean;
}
