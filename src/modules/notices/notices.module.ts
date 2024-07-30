import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

import { NoticesService } from "./notices.service";
import { NoticesController } from "./notices.controller";

import { NoticesEntity } from "src/entities/notices.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NoticesEntity]), AuthModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
