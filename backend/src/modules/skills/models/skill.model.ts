import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SkillModel {
  @Field(() => ID)
  skillId: string;

  @Field()
  categoryId: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  aliases?: string[];
}
