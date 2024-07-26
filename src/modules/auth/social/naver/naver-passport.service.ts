import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserLocalService } from "src/modules/auth/local/local.service";

import { MESSAGES } from "src/common/constants/message.constant";

@Injectable()
export class NaverPassportService {
  constructor(
    private userLocalService: UserLocalService,
    private configService: ConfigService,
  ) {}

  async naverLogin(req: any, ip: string, userAgent: string) {
    try {
      const { user } = req;
      user.nickname = user.firstName + user.lastName;
      delete user.lastName;
      delete user.firstName;
      user.type = "naver";

      // 유저 중복 검사 후 존재하지 않는 유저면 회원가입
      const findUser = await this.userLocalService.checkUserForAuth({ email: user.email });
      if (!findUser) {
        await this.userLocalService.signUp(user);
      }

      // 기존 로컬 로그인 로직 재사용
      const loginDto = { email: user.email, password: user.password };
      const tokens = await this.userLocalService.signIn(loginDto, ip, userAgent);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException(MESSAGES.AUTH.LOG_IN.NAVER.EMAIL);
    }
  }
}
