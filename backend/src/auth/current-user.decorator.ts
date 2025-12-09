import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL Current User Decorator
 * Extracts the authenticated user from the GraphQL request context
 * Usage: @CurrentUser() user: { id: string; email: string; role: string }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  }
);
