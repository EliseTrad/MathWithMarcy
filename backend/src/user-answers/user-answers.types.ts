import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL Types for User Statistics
 */

@ObjectType()
export class DifficultyStatsType {
  @Field(() => Int)
  answered!: number;

  @Field(() => Int)
  correct!: number;
}

@ObjectType()
export class TopicDifficultyBreakdownType {
  @Field(() => DifficultyStatsType)
  easy!: DifficultyStatsType;

  @Field(() => DifficultyStatsType)
  medium!: DifficultyStatsType;

  @Field(() => DifficultyStatsType)
  hard!: DifficultyStatsType;
}

@ObjectType()
export class TopicStatsType {
  @Field(() => Int)
  answered!: number;

  @Field(() => Int)
  correct!: number;

  @Field(() => TopicDifficultyBreakdownType)
  byDifficulty!: TopicDifficultyBreakdownType;
}

@ObjectType()
export class TopicsStatsType {
  @Field(() => TopicStatsType)
  geometry!: TopicStatsType;

  @Field(() => TopicStatsType)
  algebra!: TopicStatsType;

  @Field(() => TopicStatsType)
  arithmetic!: TopicStatsType;

  @Field(() => TopicStatsType)
  wordProblem!: TopicStatsType;
}

@ObjectType()
export class DifficultiesStatsType {
  @Field(() => DifficultyStatsType)
  easy!: DifficultyStatsType;

  @Field(() => DifficultyStatsType)
  medium!: DifficultyStatsType;

  @Field(() => DifficultyStatsType)
  hard!: DifficultyStatsType;
}

@ObjectType()
export class UserStatisticsType {
  @Field(() => Int)
  totalAnswered!: number;

  @Field(() => Int)
  correctAnswers!: number;

  @Field()
  accuracy!: number;

  @Field(() => TopicsStatsType)
  topics!: TopicsStatsType;

  @Field(() => DifficultiesStatsType)
  difficulties!: DifficultiesStatsType;
}
