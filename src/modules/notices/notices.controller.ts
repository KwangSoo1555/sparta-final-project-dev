import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NoticesService } from "./notices.service";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { UpdateNoticeDto } from "./dto/update-notice.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";
import { UsersEntity } from "src/entities/users.entity";
import { JwtAccessGuards } from "../auth/common/jwt/jwt-strategy.service";
import { Roles } from "src/common/customs/decorator/roles.decorator";
import { UserRoles } from "src/common/customs/types/enum-user-roles";
import { RolesGuard } from "src/common/customs/guards/roles.guard";

@ApiTags("공지사항")
@Controller("notices")
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  /**
   * 공지시항 생성
   * @param createNoticeDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async createNotice(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },
    @Body() noticeData: CreateNoticeDto,
  ) {
    return this.noticesService.createNewNotice(userId, noticeData);
  }

  /**
   * 공지사항 목록 조회
   * @param page
   * @param limit
   * @returns
   */
  @ApiQuery({ name: "page", required: false, type: Number, description: "페이지 번호", example: 1 })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "페이지당 항목 수",
    example: 20,
  })
  @Get()
  async getNotices(@Query("page") page: number, @Query("limit") limit: number) {
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 20;

    return this.noticesService.getNotices(page, limit);
  }

  /**
   * 공지사항 상세 조회
   * @param noticeId
   * @returns
   */
  @Get(":noticeId")
  async getNoticeDetail(@Param("noticeId") noticeId: number) {
    return this.noticesService.getNoticeDetail(noticeId);
  }

  /**
   * 공지사항 수정
   * @param param
   * @param noticeId
   * @param updateNoticeDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch(":noticeId")
  async updateNotice(
    @Param("noticeId") noticeId: number,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    return this.noticesService.updateNotice(noticeId, updateNoticeDto);
  }

  /**
   * 공지사항 삭제
   * @param noticeId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(":noticeId")
  async removeNotice(@Param("noticeId") noticeId: number) {
    await this.noticesService.removeNotice(noticeId);
    return { message: "공지사항이 정상적으로 삭제 되었습니다." };
  }
}
