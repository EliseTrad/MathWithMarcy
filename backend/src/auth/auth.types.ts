import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL User Type
 * Represents a student/user in the system
 */
@ObjectType()
export class UserType {
  @Field(() => Int)
  user_id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  // Password is never exposed in GraphQL
  // password is intentionally omitted

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;
}

/**
 * GraphQL Auth Response Type
 * Returned after successful login or registration
 */
@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field(() => UserType)
  user!: UserType;
}
