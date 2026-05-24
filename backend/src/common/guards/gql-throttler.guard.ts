// GQL-aware throttler guard.
//
// @nestjs/throttler's default ThrottlerGuard extracts context from the
// HTTP ExecutionContext, but GraphQL resolvers get a different context
// shape. This override reads the request from the GQL context so the
// guard works on GraphQL mutations and queries.

import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext<{ req: Request }>();
    return { req, res: (req as any).res };
  }
}
