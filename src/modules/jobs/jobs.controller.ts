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
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

@ApiTags("jobs")
@ApiBearerAuth()
@UseGuards(JwtAccessGuards)
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * job 생성
   * @param createJobDto
   * @param userId
   * @returns
   */
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @RequestJwtByHttp() { user: { id: userId } },
  ) {
    const createJob = await this.jobsService.create(createJobDto, userId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.CREATE.CREATE_SUCCEED,
      createJob,
    };
  }

  /**
   * job 목록 조회
   * @returns
   */
  @Get()
  async findAll() {
    const jobs = await this.jobsService.findAll();

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.READ.READ_SUCCEED,
      jobs,
    };
  }

  /**
   * job 상세 조회
   * @param jobsId
   * @returns
   */
  @Get(":jobsId")
  async findOne(@Param("jobsId") jobsId: string) {
    const job = await this.jobsService.findOne(+jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.READ.READ_SUCCEED,
      job,
    };
  }

  /**
   * job 수정
   * @param jobsId
   * @param userId
   * @param updateJobDto
   * @returns
   */
  @Patch(":jobsId")
  async update(
    @Param("jobsId") jobsId: string,
    @RequestJwtByHttp() { user: { id: userId } },
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const updateJob = await this.jobsService.update(userId, +jobsId, updateJobDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.UPDATE.UPDATE_SUCCEED,
      updateJob,
    };
  }

  /**
   * job matching 여부 수정
   * @param jobsId
   * @param userId
   * @returns
   */
  @Patch("matching/:jobsId")
  async updateJobYn(
    @Param("jobsId") jobsId: string,
    @RequestJwtByHttp() { user: { id: userId } },
  ) {
    const updateJob = await this.jobsService.updateJobYn(userId, +jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.MATCHING.MATCHING_SUCCEED,
      updateJob,
    };
  }

  /**
   * job cancel 여부 수정
   * @param jobsId
   * @param userId
   * @returns
   */
  @Patch("cancel/:jobsId")
  async updateJobCancelYn(
    @Param("jobsId") jobsId: string,
    @RequestJwtByHttp() { user: { id: userId } },
  ) {
    const updateJob = await this.jobsService.updateJobCancelYn(userId, +jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.CANCEL.CANCEL_SUCCEED,
      updateJob,
    };
  }

  /**
   * job 삭제
   * @param jobsId
   * @param userId
   * @returns
   */
  @Delete(":jobsId")
  async remove(
    @Param("jobsId") jobsId: string,
    @RequestJwtByHttp() { user: { id: userId } },
  ) {
    const deleteJob = await this.jobsService.remove(userId, +jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.DELETE.DELETE_SUCCEED,
      deleteJob,
    };
  }
}
