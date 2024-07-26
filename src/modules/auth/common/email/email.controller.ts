import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";

import { EmailVerificationService } from "./email.service";

import { EmailVerificationDto } from "./email.dto/email-verification.dto";

@Controller("auth/email")
export class EmailVerificationController {
  constructor(private emailVerificationService: EmailVerificationService) {}

  @Post("verification")
  @UsePipes(ValidationPipe)
  async sendAuthEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.emailVerificationService.sendAuthEmail(emailVerificationDto);
  }

  @Post("temp-pw")
  @UsePipes(ValidationPipe)
  async sendTempPassword(@Body() emailVerificationDto: EmailVerificationDto) {
    return this.emailVerificationService.sendTempPassword(emailVerificationDto);
  }
}
