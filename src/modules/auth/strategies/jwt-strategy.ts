import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";

import { AuthService } from "../auth.service";

import { MESSAGES } from "src/common/constants/message.constant";

// Access token validation
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "accessToken") {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;

    const user = await this.authService.checkUserForAuth({ id: userId });
    if (!user) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    return user;
  }
}

// Refresh token validation
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refreshToken") {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    //: Promise<UserAuthEntity> 함수의 타입을 명시합시다.
    const { userId } = payload;

    const user = await this.authService.checkUserForAuth({ id: userId });
    if (!user) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    return user;
  }
}

// 인증 가드를 설정하여 보호된 라우트에 접근할 때 access token 과 refresh token 을 검증
@Injectable()
export class JwtAccessGuards extends AuthGuard("accessToken") {}

@Injectable()
export class JwtRefreshGuards extends AuthGuard("refreshToken") {}
