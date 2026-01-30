import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

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
}
