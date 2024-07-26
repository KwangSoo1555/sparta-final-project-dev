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

  @Post("sign-in")
  @UsePipes(ValidationPipe)
  signIn(
    @Ip() ip: string,
    @Headers("User-Agent") userAgent: string,
    @Body() signInDto: UserLocalSignInDto,
  ) {
    return this.userLocalService.signIn(signInDto, ip, userAgent);
  }
}
