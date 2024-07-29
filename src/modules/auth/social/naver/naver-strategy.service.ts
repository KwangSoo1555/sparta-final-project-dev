import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get("NAVER_CLIENT_ID"),
      clientSecret: configService.get("NAVER_CLIENT_SECRET"),
      callbackURL: configService.get("NAVER_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(profile: Profile, done: VerifyCallback) {
    try {
      const { name, emails } = profile;
      const user = {
        email: emails[0].value,
        firstName: name.familyName,
        lastName: name.givenName,
      };
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
