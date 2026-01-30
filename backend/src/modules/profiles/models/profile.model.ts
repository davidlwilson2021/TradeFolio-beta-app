import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ProfileModel {
  @Field(() => ID)
  profileId: string;

  @Field()
  userId: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

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
  subscriptionTier: string;

  @Field(() => Int)
  profileCompletion: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
