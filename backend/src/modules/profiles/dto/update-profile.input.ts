import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tradeCategory?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  specialty?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

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
  phone?: string;
}
