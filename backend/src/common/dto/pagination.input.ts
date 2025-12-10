import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Min, Max } from 'class-validator';

/**
 * Pagination Input for queries
 */
@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 20;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0, { message: 'Offset must be at least 0' })
  offset?: number = 0;
}
