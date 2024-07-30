import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../auth.service";

import { UsersEntity } from "src/entities/users.entity";
import { GoogleSignInDto } from "../dto/sign-in.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
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
    profile: Profile,
  ): Promise<UsersEntity | string> {
    console.log("Google Profile:", profile); // 콘솔 로그 추가
    const { id, name, emails, provider } = profile;
    const googleSignInDto: GoogleSignInDto = {
      email: emails[0].value,
      provider: provider,
      socialId: id,
      name: name.givenName + name.familyName,
    };

    const user = await this.authService.checkUserForAuth(googleSignInDto);
    console.log({ user });
    if (!user) return "fail";
    return user;
  }
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
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

  async validate(profile: Profile, done: VerifyCallback): Promise<any> {
    console.log("Naver Profile:", profile); // 콘솔 로그 추가
    const user_email = profile._json.email;

    const user = await this.authService.checkUserForAuth({ email: user_email });
    if (user === null) {
      return fail;
    }

    return done(null, user);
  }
}
