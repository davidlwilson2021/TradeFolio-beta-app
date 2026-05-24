// T-8: PublicProfileModel — the shape returned by the unauthenticated getProfile query.
//
// Deliberately omits email, phone, subscriptionTier, and profileCompletion — these are
// private to the user and must not be exposed to unauthenticated callers. Public portfolio
// visitors only need the professional / location fields.

import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PublicProfileModel {
  @Field(() => ID)
  profileId: string;

  @Field()
  userId: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  tradeCategory?: string;

  @Field({ nullable: true })
  specialty?: string;

  @Field(() => Int)
  yearsExperience: number;

  @Field({ nullable: true })
  locationCity?: string;

  @Field({ nullable: true })
  locationState?: string;

  @Field()
  createdAt: Date;
}
