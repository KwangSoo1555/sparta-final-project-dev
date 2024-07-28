import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./jwt-strategy";
import { UserLocalModule } from "../local/local.module";

import { AuthCommonService } from "./common.service"
import { AuthCommonController } from "./common.controller";

import { UsersEntity } from "src/entities/users.entity";
import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

@Module({
  imports: [
    NestTypeOrmModule.forFeature([UsersEntity, RefreshTokensEntity]),
    NestJwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
      }),
      inject: [ConfigService],
    }),
    NestJwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("REFRESH_TOKEN_SECRET"),
      }),
      inject: [ConfigService],
    }),
    NestTypeOrmModule.forFeature([RefreshTokensEntity]),
    forwardRef(() => UserLocalModule),
  ],
  controllers: [AuthCommonController],
  providers: [AuthCommonService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthCommonService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthCommonModule { }
