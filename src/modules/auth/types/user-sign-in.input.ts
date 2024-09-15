import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class UserSignInInput {
  @Field(() => String)
  @MinLength(4)
  readonly email!: string;

  @Field(() => String)
  @MinLength(4)
  readonly password: string;
}
