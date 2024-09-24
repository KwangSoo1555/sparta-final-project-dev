import { MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

import { UserRoles } from "src/common/customs/enums/enum-user-roles";

@InputType()
export class UserCreateInput {
  @Field(() => String)
  // @MinLength(4)
  email: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String)
  name: string;

  @Field(() => UserRoles, { nullable: true })
  role?: UserRoles;

  @Field(() => String, { nullable: true })
  provider?: string;

  @Field(() => String, { nullable: true })
  socialId?: string;

  @Field(() => Number)
  verificationCode: number;
}
