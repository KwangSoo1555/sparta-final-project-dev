import { Controller, Post, Body, UsePipes, ValidationPipe, Ip, Headers } from "@nestjs/common";

import { UserLocalService } from "./local.service";

import { UserLocalSignUpDto } from "./local.dto/sign-up.dto";
import { UserLocalSignInDto } from "./local.dto/sign-in.dto";

@Controller("auth/local")
export class UserLocalController {
  constructor(private userLocalService: UserLocalService) {}

  @Post("sign-up")
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpDto: UserLocalSignUpDto) {
    return this.userLocalService.signUp(signUpDto);
  }

  @Post("log-in")
  @UsePipes(ValidationPipe)
  logIn(
    @Ip() ip: string,
    @Headers("User-Agent") userAgent: string,
    @Body() logInDto: UserLocalSignInDto,
  ) {
    return this.userLocalService.logIn(logInDto, ip, userAgent);
  }
}
