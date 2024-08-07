import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { JwtAccessGuards } from "src/modules/auth/strategies/jwt-strategy";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequestJwtByHttp } from "src/common/customs/decorators/jwt-http-request";
import { MESSAGES } from "src/common/constants/message.constant";
import { BlacklistService } from "./blacklist.service";

@ApiTags("blacklists")
@ApiBearerAuth()
@UseGuards(JwtAccessGuards)
@Controller("blacklists")
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  /**
   * blacklist 등록
   * @param blackedId
   * @param userId
   * @returns
   */
  @Post(":blackedId")
  async create(@Param("blackedId") blackedId: string, @RequestJwtByHttp() { user: { id: userId } }) {
    const blacklist = await this.blacklistService.create(+blackedId, +userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.BLACKLIST.CREATE.CREATE_SUCCEED,
      blacklist,
    };
  }

  /**
   * blacklist 조회
   * @param userId
   * @returns
   */
  @Get()
  async findAll(@RequestJwtByHttp() { user: { id: userId } }) {
    const blacklist = await this.blacklistService.findAll(+userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.BLACKLIST.READ.READ_SUCCEED,
      blacklist,
    };
  }

  /**
   * blacklist 삭제
   * @param blacklistId
   * @param userId
   * @returns
   */
  @Delete(":blacklistId")
  async remove(@Param("blacklistId") blacklistId: string, @RequestJwtByHttp() { user: { id: userId } }) {
    const blacklist = await this.blacklistService.remove(+blacklistId, +userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.BLACKLIST.DELETE.DELETE_SUCCEED,
      blacklist,
    };
  }
}
