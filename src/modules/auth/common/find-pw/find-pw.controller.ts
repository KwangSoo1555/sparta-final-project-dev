import { Controller, Post, Body } from "@nestjs/common";
import { FindPwService } from "./find-pw.service";

import { FindPwDto } from "./find-pw.dto/find-pw.dto";

@Controller("auth")
export class FindPwController {
  constructor(private readonly findPwService: FindPwService) {}

  @Post("find-pw")
  async findPw(@Body() findPwDto: FindPwDto) {
    return this.findPwService.findPw(findPwDto);
  }
}
