import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { SkillModel } from '../../skills/models/skill.model';
import { MediaModel } from './media.model';

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  projectId: string;

  @Field()
  profileId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  sourceType: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  locationCity?: string;

  @Field({ nullable: true })
  locationState?: string;

  @Field({ nullable: true })
  projectDate?: Date;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  likeCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field(() => [SkillModel], { nullable: true })
  skills?: SkillModel[];

  @Field(() => [MediaModel], { nullable: true })
  media?: MediaModel[];
}
