import { Controller, Post, UsePipes, ValidationPipe, UseGuards, Headers, Ip } from "@nestjs/common";

import { JwtService } from "./jwt.service";

import { JwtRefreshGuards } from "./jwt-strategy.service";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";

@Controller("auth")
export class JwtController {
  constructor(private jwtService: JwtService) {}

  @Post("jwt-reissue")
  @UseGuards(JwtRefreshGuards)
  @UsePipes(ValidationPipe)
  tokenReissue(
    @RequestJwt() { user: { id: userId }, token: refreshToken },
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    return this.jwtService.tokenReissue(userId, refreshToken, ip, userAgent);
  }
}