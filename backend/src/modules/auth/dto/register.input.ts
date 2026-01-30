import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsOptional, IsString } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @IsString()
  fullName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tradeCategory?: string;
}
