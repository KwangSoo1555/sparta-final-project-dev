import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Headers,
  Ip,
  Request,
  Response,
  Param,
} from "@nestjs/common";

import { Request as ExpressRequest, Response as ExpressResponse } from "express";

import { AuthGuard } from "@nestjs/passport";
import { JwtAccessGuards, JwtRefreshGuards } from "./strategies/jwt-strategy";
import { RequestJwtByHttp } from "src/common/customs/decorators/jwt-http-request";
import { RequestUserAgent } from "src/common/customs/decorators/user-agent-request";
import { RequestIp } from "src/common/customs/decorators/ip-request";

import { AuthService } from "./auth.service";

import { EmailVerificationDto } from "./dto/email-verification.dto";
import { UserCreateInput, UserSignInInput } from "./types";
import { FindPwDto } from "./dto/find-pw.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("email/verification")
  @UsePipes(ValidationPipe)
  async sendAuthEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.authService.sendAuthEmail(emailVerificationDto);
  }

  @Post("email/temp-pw")
  @UsePipes(ValidationPipe)
  async sendTempPassword(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.authService.sendTempPassword(emailVerificationDto);
  }

  // user auth 관련 api
  @Post("sign-up")
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpDto: UserCreateInput) {
    return this.authService.signUp(signUpDto);
  }

  @Post("sign-in")
  @UsePipes(ValidationPipe)
  signIn(
    @Ip() ip: string,
    @Headers("User-Agent") userAgent: string,
    @Body() signInDto: UserSignInInput,
  ) {
    return this.authService.signIn(signInDto, ip, userAgent);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() req: ExpressRequest) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(
    @RequestUserAgent() userAgent: string,
    @RequestIp() ip: string,
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user;
    const authCode = req.query.code as string;
    try {
      await this.authService.socialSignIn(user, ip, userAgent, authCode, res);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get("naver")
  @UseGuards(AuthGuard("naver"))
  async naverAuth(@Request() req: ExpressRequest) {}

  @Get("naver/callback")
  @UseGuards(AuthGuard("naver"))
  async naverAuthCallback(
    @RequestUserAgent() userAgent: string,
    @RequestIp() ip: string,
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user;
    const authCode = req.query.code as string;
    await this.authService.socialSignIn(user, ip, userAgent, authCode, res);
  }

  @Get("kakao")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuth(@Request() req: ExpressRequest) {}

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuthCallback(
    @RequestUserAgent() userAgent: string,
    @RequestIp() ip: string,
    @Response() res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user;
    const authCode = req.query.code as string;
    await this.authService.socialSignIn(user, ip, userAgent, authCode, res);
  }

  @Get("auth-code/:authCode")
  async getAuthCode(@Param("authCode") authCode: string) {
    return this.authService.getAuthCode(authCode);
  }

  @Post("jwt-reissue")
  @UseGuards(JwtRefreshGuards)
  @UsePipes(ValidationPipe)
  tokenReissue(
    @RequestJwtByHttp() { user: { id: userId }, token: refreshToken },
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    return this.authService.tokenReissue(userId, refreshToken, ip, userAgent);
  }

  @Post("find-pw")
  async findPw(@Body() findPwDto: FindPwDto) {
    return this.authService.findPw(findPwDto);
  }

  @Patch("sign-out")
  @UseGuards(JwtAccessGuards)
  signOut(@RequestJwtByHttp() { user: { id: userId } }) {
    return this.authService.signOut(userId);
  }
}
