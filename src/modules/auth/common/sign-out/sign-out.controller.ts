import { Controller, Patch, UseGuards } from "@nestjs/common";

import { UserSignOutService } from "./sign-out.service";

import { JwtRefreshGuards } from "src/modules/auth/common/jwt/jwt-strategy.service";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";

@Controller("auth")
export class UserSignOutController {
  constructor(private userSignOutService: UserSignOutService) {}

  @Patch("sign-out")
  @UseGuards(JwtRefreshGuards)
  signOut(@RequestJwt() { user: { id: userId } }) {
    return this.userSignOutService.signOut(userId);
  }
}
