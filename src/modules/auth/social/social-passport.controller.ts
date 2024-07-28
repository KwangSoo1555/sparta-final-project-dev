import { Controller, Get, UseGuards, Request, Response } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { SocialPassportService } from "./social-passport.service";

@Controller("auth")
export class SocialPassportController {
  constructor(
    private socialPassportService: SocialPassportService
  ) { }

  @Get('google')
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() req: ExpressRequest) {
    console.log(req)
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse
  ): Promise<ExpressResponse | void> {
    console.log(request)
    return await this.socialPassportService.googleLogin(request, response);
  }

  @Get('naver')
  @UseGuards(AuthGuard("naver"))
  async naverAuth(@Request() req: ExpressRequest) {
    console.log(req)
  }

  @Get("naver/callback")
  @UseGuards(AuthGuard("naver"))
  async naverAuthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse
  ): Promise<ExpressResponse | void> {
    return await this.socialPassportService.naverLogin(request, response);
  }

  @Get('kakao')
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuth(@Request() req: ExpressRequest) {
    console.log(req)
  }

  @Get("kakao/callback")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuthCallback(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse
  ): Promise<ExpressResponse | void> {
    return await this.socialPassportService.kakaoLogin(request, response);
  }
}
