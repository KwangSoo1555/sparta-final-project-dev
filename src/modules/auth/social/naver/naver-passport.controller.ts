import { Controller, Get, UseGuards, Req, Ip, Headers } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { NaverPassportService } from "./naver-passport.service";

@Controller("auth/naver")
export class NaverPassportController {
  constructor(private naverPassportService: NaverPassportService) {}

  @Get()
  @UseGuards(AuthGuard("naver"))
  async googleRedirect() {
    // 네이버 로그인 페이지로 리다이렉트
  }

  @Get("callback")
  @UseGuards(AuthGuard("naver"))
  async googleLogin(
    @Ip() ip: string,
    @Headers("User-Agent") userAgent: string,
    @Req() req: any
  ) {
    return this.naverPassportService.naverLogin(req, ip, userAgent);
  }
}
