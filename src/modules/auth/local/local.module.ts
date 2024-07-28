import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { AuthCommonModule } from "../common/common.module";

import { UserLocalService } from "./local.service";
import { UserLocalController } from "./local.controller";

import { UsersEntity } from "src/entities/users.entity";
import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

@Module({
  imports: [
    NestTypeOrmModule.forFeature([UsersEntity, RefreshTokensEntity]),
    forwardRef(() => AuthCommonModule),
  ],
  controllers: [UserLocalController],
  providers: [UserLocalService],
  exports: [UserLocalService],
})
export class UserLocalModule { }
