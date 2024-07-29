import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserLocalModule } from "src/modules/auth/local/local.module";

import { GooglePassportService } from "./google-passport.service";
import { GooglePassportController } from "./google-passport.controller";
import { GoogleStrategy } from "./google-strategy.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "google" }), 
    UserLocalModule,
  ],
  controllers: [GooglePassportController],
  providers: [GooglePassportService, GoogleStrategy],
})
export class GooglePassportModule {}
