import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfileModel } from './models/profile.model';
import { PublicProfileModel } from './models/public-profile.model';
import { UpdateProfileInput } from './dto/update-profile.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => ProfileModel)
export class ProfilesResolver {
  constructor(private profilesService: ProfilesService) {}

  @Query(() => ProfileModel)
  @UseGuards(GqlAuthGuard)
  async myProfile(@CurrentUser() user: any): Promise<any> {
    return this.profilesService.getByUserId(user.sub);
  }

  // T-8: Unauthenticated public profile view — scrubs email, phone, and private
  // fields. Use myProfile (authenticated) to read your own full profile.
  @Query(() => PublicProfileModel)
  async getProfile(@Args('userId', { type: () => ID }) userId: string): Promise<PublicProfileModel> {
    return this.profilesService.getPublicByUserId(userId);
  }

  @Mutation(() => ProfileModel)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @CurrentUser() user: any,
    @Args('input') input: UpdateProfileInput,
  ): Promise<any> {
    return this.profilesService.update(user.sub, input);
  }
}
