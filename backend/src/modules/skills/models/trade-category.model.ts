import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { SkillModel } from './skill.model';

@ObjectType()
export class TradeCategoryModel {
  @Field(() => ID)
  categoryId: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => Int)
  displayOrder: number;

  @Field(() => [SkillModel], { nullable: true })
  skills?: SkillModel[];
}
