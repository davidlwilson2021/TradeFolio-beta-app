import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field({ nullable: true })
  profileId?: string;
}
