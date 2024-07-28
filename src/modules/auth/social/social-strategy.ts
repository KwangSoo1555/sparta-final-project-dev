import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

import { UserLocalService } from "../local/local.service";

import { UsersEntity } from "src/entities/users.entity";
import { OAuthInput } from "./dto/google-create-user-input.dto";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    profile: Profile
  ): Promise<UsersEntity | string> {
    const {
      provider: oauthProvider,
      id: oauthId,
      displayName: name = 'Anonymous',
      emails,
      photos,
    } = profile;
    const oauthInput: OAuthInput = {
      oauthProvider,
      oauthId,
      name: name,
      email: emails ? emails[0].value : null,
    }

    return;
  }
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor(
    private readonly configService: ConfigService,
    private readonly userLocalService: UserLocalService,
  ) {
    super({
      clientID: configService.get("NAVER_CLIENT_ID"),
      clientSecret: configService.get("NAVER_CLIENT_SECRET"),
      callbackURL: configService.get("NAVER_CALLBACK_URL"),
    });
  }

  async validate(profile: Profile, done: VerifyCallback): Promise<any> {
    const user_email = profile._json.email;

    const user = await this.userLocalService.checkUserForAuth({ email: user_email });
    if (user === null) {
      return fail;
    }

    return done(null, user);
  }
}