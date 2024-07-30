import { Module } from "@nestjs/common";
import { TypeOrmModule as NestTypeOrmModule } from "@nestjs/typeorm";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies/jwt-strategy";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

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
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
