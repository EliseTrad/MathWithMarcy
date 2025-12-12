import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../users/users.types';

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
