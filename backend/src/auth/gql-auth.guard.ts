import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL Authentication Guard
 * Adapts the JWT authentication guard to work with GraphQL contexts
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * Extract the request object from the GraphQL execution context
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
