import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class MediaModel {
  @Field(() => ID)
  mediaId: string;

  @Field()
  mediaType: string;

  @Field()
  originalUrl: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  blurHash?: string;

  @Field()
  isBeforeAfter: boolean;

  @Field({ nullable: true })
  beforeAfterType?: string;

  @Field(() => Int)
  displayOrder: number;
}
