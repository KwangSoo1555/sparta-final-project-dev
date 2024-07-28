import { Module } from "@nestjs/common";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { UserLocalModule } from "src/modules/auth/local/local.module";
import { AuthCommonModule } from "../common/common.module";

import { SocialPassportService } from "./social-passport.service";
import { SocialPassportController } from "./social-passport.controller";
import { GoogleStrategy } from "./social-strategy";
import { NaverStrategy } from "./social-strategy";

import { UsersEntity } from "src/entities/users.entity";
import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

@Module({
  imports: [
    NestTypeOrmModule.forFeature([UsersEntity, RefreshTokensEntity]),
    PassportModule.register({ defaultStrategy: "google" }),
    UserLocalModule,
    AuthCommonModule,
  ],
  controllers: [SocialPassportController],
  providers: [SocialPassportService, GoogleStrategy, NaverStrategy],
})
export class SocialPassportModule { }
