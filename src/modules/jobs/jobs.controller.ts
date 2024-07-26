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
import { JwtAccessGuards } from "src/modules/auth/common/jwt/jwt-strategy.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";
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
   * @param user
   * @returns
   */
  @Post()
  create(@Body() createJobDto: CreateJobDto, @RequestJwt() { user: { id: userId } }) {
    const createJob = this.jobsService.create(createJobDto, userId);

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
  findAll() {
    const jobs = this.jobsService.findAll();

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
  findOne(@Param("jobsId") jobsId: string) {
    const job = this.jobsService.findOne(+jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.READ.READ_SUCCEED,
      job,
    };
  }

  /**
   * job 수정
   * @param jobsId
   * @param user
   * @param updateJobDto
   * @returns
   */
  @Patch(":jobsId")
  update(
    @Param("jobsId") jobsId: string,
    @RequestJwt() { user: { id: userId } },
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const updateJob = this.jobsService.update(userId, +jobsId, updateJobDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.UPDATE.UPDATE_SUCCEED,
      updateJob,
    };
  }

  /**
   * job 삭제
   * @param jobsId
   * @param user
   * @returns
   */
  @Delete(":jobsId")
  remove(@Param("jobsId") jobsId: string, @RequestJwt() { user: { id: userId } }) {
    const deleteJob = this.jobsService.remove(userId, +jobsId);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES.JOBS.DELETE.DELETE_SUCCEED,
      deleteJob,
    };
  }
}
