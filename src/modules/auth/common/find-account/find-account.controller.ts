import { Controller, Post, Body } from "@nestjs/common";
import { FindAccountService } from "./find-account.service";

import { FindIdDto } from "./find-account.dto/find-id.dto";
import { FindPwDto } from "./find-account.dto/find-pw.dto";

@Controller("auth")
export class FindAccountController {
  constructor(private readonly findAccountService: FindAccountService) {}

  @Post("find-id")
  async findId(@Body() findIdDto: FindIdDto) {
    return this.findAccountService.findId(findIdDto);
  }

  @Post("find-pw")
  async findPw(@Body() findPwDto: FindPwDto) {
    return this.findAccountService.findPw(findPwDto);
  }
}
