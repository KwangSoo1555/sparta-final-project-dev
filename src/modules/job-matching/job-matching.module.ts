import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

import { JobMatchingService } from "./job-matching.service";
import { JobMatchingController } from "./job-matching.controller";

import { JobsMatchingEntity } from "src/entities/jobs-matching.entity";
import { JobsEntity } from "src/entities/jobs.entity";
import { UsersEntity } from "src/entities/users.entity";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsMatchingEntity, JobsEntity, UsersEntity, NotificationsModule]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [JobMatchingController],
  providers: [JobMatchingService],
})
export class JobMatchingModule {}
