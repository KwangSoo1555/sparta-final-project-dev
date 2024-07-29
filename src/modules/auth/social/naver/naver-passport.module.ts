import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserLocalModule } from "src/modules/auth/local/local.module";

import { NaverPassportService } from "./naver-passport.service";
import { NaverPassportController } from "./naver-passport.controller";
import { NaverStrategy } from "./naver-strategy.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "naver" }),
    UserLocalModule,
  ],
  controllers: [NaverPassportController],
  providers: [NaverPassportService, NaverStrategy],
})
export class NaverPassportModule {}
