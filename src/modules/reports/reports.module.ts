import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";

import { UsersEntity } from "src/entities/users.entity";
import { ReportsEntity } from "src/entities/reports.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReportsEntity, UsersEntity]), AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
