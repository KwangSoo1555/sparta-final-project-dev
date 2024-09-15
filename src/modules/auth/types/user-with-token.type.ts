import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserWithToken {
  @Field(() => String, { description: "사용자 인증 액세스 토큰" })
  accessToken: string;
}
