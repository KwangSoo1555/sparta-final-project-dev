import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { NoticesService } from "./notices.service";
import { CreateNoticeDto } from "./dto/create-notice.dto";
import { UpdateNoticeDto } from "./dto/update-notice.dto";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("공지사항")
@Controller("notices")
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  /**
   * 공지시항 생성
   * @param createNoticeDto
   * @returns
   */
  @Post()
  async createNotice(@Body() noticeData: CreateNoticeDto) {
    const userId = 1;
    return this.noticesService.createNewNotice(userId, noticeData);
  }

  /**
   * 공지사항 목록 조회
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
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
   * @param id
   * @returns
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.noticesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(+id, updateNoticeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.noticesService.remove(+id);
  }
}
