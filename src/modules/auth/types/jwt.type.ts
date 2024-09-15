import { PickType } from "@nestjs/graphql";
import { UsersEntity } from "src/entities/users.entity";
import { JwtCategory } from "../enums";

export class UserIdentifier extends PickType(UsersEntity, ["id"]) {
  constructor(user: UsersEntity) {
    super();
    this.id = user.id;
  }
}

export class JwtInput {
  user: UserIdentifier;
  custom?: Record<string, any>;
}

export class JwtPayload extends JwtInput {
  type: JwtCategory;
}
