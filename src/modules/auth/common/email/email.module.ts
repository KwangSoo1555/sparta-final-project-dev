import { Module } from "@nestjs/common";

import { EmailVerificationController } from "./email.controller";
import { EmailVerificationService } from "./email.service";

@Module({
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailModule {}
