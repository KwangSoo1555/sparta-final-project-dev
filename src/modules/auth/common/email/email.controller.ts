import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";

import { EmailVerificationService } from "./email.service";

import { EmailVerificationDto } from "./auth-common-email.dto/email-verification.dto";

@Controller("auth")
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}

  @Post("email-verification")
  @UsePipes(ValidationPipe)
  async sendAuthEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.emailVerificationService.sendAuthEmail(emailVerificationDto);
  }
}