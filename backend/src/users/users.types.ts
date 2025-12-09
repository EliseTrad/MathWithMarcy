import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL Type for User Entity
 * Excludes password field for security
 */
@ObjectType({ description: 'A user account' })
export class UserType {
  @Field(() => Int, { description: 'User ID' })
  user_id!: number;

  @Field({ description: 'User name' })
  name!: string;

  @Field({ description: 'User email address' })
  email!: string;

  @Field({ description: 'Account creation timestamp' })
  created_at!: Date;

  @Field({ description: 'Last update timestamp' })
  updated_at!: Date;
}
