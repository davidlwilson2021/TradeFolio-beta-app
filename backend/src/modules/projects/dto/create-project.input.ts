import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  locationCity?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  locationState?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  projectDate?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  skillIds?: string[];
}
