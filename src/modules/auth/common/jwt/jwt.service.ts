import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class JwtService {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private jwtRepository: Repository<RefreshTokensEntity>,
    private configService: ConfigService,
  ) {}

  async tokenReissue(userId: number, refreshToken: string, ip: string, userAgent: string) {
    // refresh token 을 가지고 있는 유저인지 확인
    const existingRefreshToken = await this.jwtRepository.findOne({ where: { userId } });
    if (!existingRefreshToken) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    // 제출된 refresh token 과 저장된 refresh token 이 일치하는지 확인
    const matchRefreshToken = await bcrypt.compare(refreshToken, existingRefreshToken.refreshToken);
    if (!matchRefreshToken) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    // access token 과 refresh token 을 새롭게 발급
    const reIssueAccessToken = jwt.sign({ userId }, this.configService.get("ACCESS_TOKEN_SECRET"), {
      expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRES_IN,
    });

    const reIssueRefreshToken = jwt.sign(
      { userId },
      this.configService.get("REFRESH_TOKEN_SECRET"),
      { expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRES_IN },
    );

    // 새롭게 발급한 refresh token 을 해싱
    const hashedReIssueRefreshToken = await bcrypt.hash(
      reIssueRefreshToken,
      AUTH_CONSTANT.HASH_SALT_ROUNDS,
    );

    // 해싱된 refresh token 을 저장
    await this.jwtRepository.upsert(
      {
        userId,
        refreshToken: hashedReIssueRefreshToken,
        ip,
        userAgent,
      },
      ["userId"],
    );

    return {
      accessToken: reIssueAccessToken,
      refreshToken: reIssueRefreshToken,
    };
  }
}
