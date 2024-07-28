import { Controller, Post, Patch, Body, UsePipes, ValidationPipe, UseGuards, Headers, Ip } from "@nestjs/common";

import { JwtRefreshGuards } from "./jwt-strategy";
import { RequestJwt } from "src/common/customs/decorators/jwt-request";

import { AuthCommonService } from "./common.service";

import { EmailVerificationDto } from "./dto/email-verification.dto";
import { FindPwDto } from "./dto/find-pw.dto";

@Controller("auth")
export class AuthCommonController {
  constructor(private authCommonService: AuthCommonService) { }

  @Post("email/verification")
  @UsePipes(ValidationPipe)
  async sendAuthEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.authCommonService.sendAuthEmail(emailVerificationDto);
  }

  @Post("email/temp-pw")
  @UsePipes(ValidationPipe)
  async sendTempPassword(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.authCommonService.sendTempPassword(emailVerificationDto);
  }

  @Post("jwt-reissue")
  @UseGuards(JwtRefreshGuards)
  @UsePipes(ValidationPipe)
  tokenReissue(
    @RequestJwt() { user: { id: userId }, token: refreshToken },
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    return this.authCommonService.tokenReissue(userId, refreshToken, ip, userAgent);
  }

  @Post("find-pw")
  async findPw(@Body() findPwDto: FindPwDto) {
    return this.authCommonService.findPw(findPwDto);
  }

  @Patch("sign-out")
  @UseGuards(JwtRefreshGuards)
  signOut(@RequestJwt() { user: { id: userId } }) {
    return this.authCommonService.signOut(userId);
  }
}
