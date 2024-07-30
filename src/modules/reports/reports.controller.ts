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
  Query,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { JwtAccessGuards } from "../auth/strategies/jwt-strategy";
import { RequestJwt } from "src/common/customs/decorators/jwt-request";
import { UsersEntity } from "src/entities/users.entity";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/common/customs/guards/roles.guard";
import { UserRoles } from "src/common/customs/enums/enum-user-roles";
import { Roles } from "src/common/customs/decorators/roles.decorator";

@ApiTags("신고")
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * 유저 신고 목록 조회
   * @param page
   * @param limit
   * @returns
   */
  @ApiBearerAuth()
  @ApiQuery({ name: "page", required: false, type: Number, description: "페이지 번호", example: 1 })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "페이지당 항목 수",
    example: 20,
  })
  @UseGuards(JwtAccessGuards, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get("admin")
  async adminReport(@Query("page") page: number, @Query("limit") limit: number) {
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 20;
    const { reports, pagination } = await this.reportsService.adminReport(page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: "유저 신고 목록 조회에 성공하였습니다.",
      data: reports,
      meta: pagination,
    };
  }

  /**
   * 신고 생성
   * @param createReportDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards)
  @Post()
  async createReport(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },
    @Body() createReportDto: CreateReportDto,
  ) {
    const createdReport = await this.reportsService.createReport(userId, createReportDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "신고가 성공적으로 접수되었습니다.",
      data: createdReport,
    };
  }

  /**
   * 신고 목록 조회
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
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards)
  @Get()
  async getReportList(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },

    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 20;
    const { reports, pagination } = await this.reportsService.getReportList(page, limit, userId);

    return {
      statusCode: HttpStatus.OK,
      message: "신고 목록이 성공적으로 조회되었습니다.",
      data: reports,
      meta: pagination,
    };
  }

  /**
   * 신고 상세 조회
   * @param reportId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards)
  @Get(":reportId")
  async getReportDetail(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },
    @Param("reportId") reportId: number,
  ) {
    const reportDetail = await this.reportsService.getReportDetail(reportId, userId);
    return {
      statusCode: HttpStatus.OK,
      message: "신고 상세 정보가 성공적으로 조회되었습니다.",
      data: reportDetail,
    };
  }

  /**
   * 신고 수정
   * @param reportId
   * @param updateReportDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards)
  @Patch(":reportId")
  async updateReport(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },
    @Param("reportId") reportId: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const updatedReport = await this.reportsService.updateReport(userId, reportId, updateReportDto);
    return {
      statusCode: HttpStatus.OK,
      message: "신고가 성공적으로 수정되었습니다.",
      data: updatedReport,
    };
  }

  /**
   * 신고 삭제
   * @param reportId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuards)
  @Delete(":reportId")
  async deleteReport(
    @RequestJwt() { user: { id: userId } }: { user: Pick<UsersEntity, "id"> },
    @Param("reportId") reportId: number,
  ) {
    await this.reportsService.deleteReport(reportId, userId);
    return { statusCode: HttpStatus.OK, message: "신고가 정상적으로 삭제되었습니다." };
  }
}
