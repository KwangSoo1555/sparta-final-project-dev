import { MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

import { UserRoles } from "src/common/customs/enums/enum-user-roles";

@InputType()
export class UserCreateInput {
  @Field(() => String)
  @MinLength(4)
  readonly email: string;

  @Field(() => String, { nullable: true })
  readonly password?: string;

  @Field(() => String)
  readonly name: string;

  @Field(() => UserRoles, { nullable: true })
  readonly role?: UserRoles;

  @Field(() => String)
  readonly provider: string;

  @Field(() => String, { nullable: true })
  readonly socialId?: string;

  @Field(() => Number)
  readonly verificationCode: number;
}
