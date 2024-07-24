import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmailVerificationService } from "../email/email.service";

import { FindAccountService } from "./find-account.service";
import { FindAccountController } from "./find-account.controller";

import { UsersEntity } from "src/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [FindAccountController],
  providers: [FindAccountService, EmailVerificationService],
})
export class FindAccountModule {}
