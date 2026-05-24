import { ObjectType, Field } from '@nestjs/graphql';
import { UserModel } from './user.model';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  // refreshToken removed: the token was generated but never stored or validated,
  // so returning it to clients was misleading — they couldn't use it safely.
  // Re-add once a proper DB-backed refresh endpoint (with token rotation/revocation)
  // is implemented. See T-5 in the security audit notes.

  @Field(() => UserModel)
  user: UserModel;
}
