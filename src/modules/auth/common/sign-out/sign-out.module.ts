import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserSignOutService } from "./sign-out.service";
import { UserSignOutController } from "./sign-out.controller";

import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokensEntity])],
  controllers: [UserSignOutController],
  providers: [UserSignOutService],
})
export class UserSignOutModule {}
