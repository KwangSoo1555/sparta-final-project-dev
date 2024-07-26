import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmailVerificationService } from "../email/email.service";

import { FindPwService } from "./find-pw.service";
import { FindPwController } from "./find-pw.controller";

import { UsersEntity } from "src/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [FindPwController],
  providers: [FindPwService, EmailVerificationService],
})
export class FindPwModule {}
