import { User } from './user.entity';
import { UserType } from './users.types';

/**
 * Maps User entity to UserType GraphQL type
 * Converts snake_case entity fields to camelCase GraphQL fields
 */
export function mapUserToGraphQL(user: User): UserType {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
