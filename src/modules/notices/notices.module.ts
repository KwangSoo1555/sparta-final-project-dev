import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

import { NoticesService } from "./notices.service";
import { NoticesController } from "./notices.controller";

import { NoticesEntity } from "src/entities/notices.entity";
import { RedisConfig } from "src/database/redis/redis.config";

@Module({
  imports: [TypeOrmModule.forFeature([NoticesEntity]), AuthModule],
  controllers: [NoticesController],
  providers: [NoticesService, RedisConfig],
})
export class NoticesModule {}
