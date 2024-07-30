import { Controller, Get, Patch, UseGuards, UsePipes, ValidationPipe, Body } from "@nestjs/common";
import { JwtAccessGuards } from "src/modules/auth/strategies/jwt-strategy";
import { RequestJwt } from "src/common/customs/decorators/jwt-request";

import { UsersService } from "src/modules/users/users.service";

import { UsersUpdateDto } from "src/modules/users/dto/update-user.dto";

@Controller("users")
@UseGuards(JwtAccessGuards)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getUsers(@RequestJwt() { user: { id: userId } }) {
    return this.usersService.getUsers(userId);
  }

  @Patch("me")
  @UsePipes(ValidationPipe)
  updateUser(
    @RequestJwt() { user: { id: userId } },
    @Body() updateUserDto: UsersUpdateDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Patch("quit")
  quitUser(@RequestJwt() { user: { id: userId } }) {
    return this.usersService.quitUser(userId);
  }
}
