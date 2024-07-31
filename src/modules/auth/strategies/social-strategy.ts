import { Injectable, ConflictException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as NaverStrategy, Profile as NaverProfile } from "passport-naver-v2";
import { Strategy as KakaoStrategy, Profile as KakaoProfile } from "passport-kakao";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../auth.service";

import { UsersEntity } from "src/entities/users.entity";
import { GoogleSignInDto, NaverSignInDto, KakaoSignInDto } from "../dto/sign-in.dto";
import { SocialProviders } from "src/common/customs/enums/enum-social-providers";
import { MESSAGES } from "src/common/constants/message.constant";

@Injectable()
export class GooglePassportStrategy extends PassportStrategy(GoogleStrategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
  ): Promise<UsersEntity | string> {
    const { id, name, emails, provider } = profile;
    const googleSignInDto: GoogleSignInDto = {
      email: emails[0].value,
      provider: provider as SocialProviders,
      socialId: id,
      name: name.familyName + name.givenName,
    };

    const user = await this.authService.checkUserForAuth({ email: googleSignInDto.email });
    if (!user) {
      return await this.authService.signUp(googleSignInDto);
    } else {
      throw new ConflictException(MESSAGES.AUTH.SIGN_UP.EMAIL.DUPLICATED);
    }
  }
}

@Injectable()
export class NaverPassportStrategy extends PassportStrategy(NaverStrategy, "naver") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get("NAVER_CLIENT_ID"),
      clientSecret: configService.get("NAVER_CLIENT_SECRET"),
      callbackURL: configService.get("NAVER_CALLBACK_URL"),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: NaverProfile,
  ): Promise<UsersEntity | string> {
    console.log("Naver Profile:", profile); // 콘솔 로그 추가
    const { id, name, email, provider } = profile;
    const naverSignInDto: NaverSignInDto = {
      email: email,
      provider: provider as SocialProviders,
      socialId: id,
      name: name,
    };

    const user = await this.authService.checkUserForAuth({ email: naverSignInDto.email });
    if (!user) {
      return await this.authService.signUp(naverSignInDto);
    } else {
      throw new ConflictException(MESSAGES.AUTH.SIGN_UP.EMAIL.DUPLICATED);
    }
  }
}

@Injectable()
export class KakaoPassportStrategy extends PassportStrategy(KakaoStrategy, "kakao") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get("KAKAO_CLIENT_ID"),
      clientSecret: configService.get("KAKAO_CLIENT_SECRET"),
      callbackURL: configService.get("KAKAO_CALLBACK_URL"),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: KakaoProfile,
  ): Promise<UsersEntity | string> {
    const { id, username, _json: { kakao_account: { email } }, provider } = profile;
    const kakaoSignInDto: KakaoSignInDto = {
      email: email,
      provider: provider as SocialProviders,
      socialId: id,
      name: username,
    };

    const user = await this.authService.checkUserForAuth({ email: kakaoSignInDto.email });
    if (!user) {
      return await this.authService.signUp(kakaoSignInDto);
    } else {
      throw new ConflictException(MESSAGES.AUTH.SIGN_UP.EMAIL.DUPLICATED);
    }
  }
}
