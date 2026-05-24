import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthPayload } from './models/auth-payload.model';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlThrottlerGuard } from '../../common/guards/gql-throttler.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserModel } from './models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // 5 attempts per 60 s per IP — tighter than the global 20/60 s.
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input.email, input.password);
  }

  // T-11: Returns UserModel DTO (id, email, fullName, profileId) — never the
  // raw User entity, which would expose passwordHash to the GraphQL client.
  @Query(() => UserModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any): Promise<UserModel | null> {
    return this.authService.getUserById(user.sub);
  }
}
