import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { JwtAccessGuards } from "src/modules/auth/common/jwt/jwt-strategy.service";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";
import { MESSAGES } from 'src/common/constants/message.constant'
import { JobMatchingService } from './job-matching.service';
import { CreateJobMatchingDto } from './dto/create-job-matching.dto';
import { UpdateJobMatchingDto } from './dto/update-job-matching.dto';

@Controller('job-matching')
export class JobMatchingController {
  constructor(private readonly jobMatchingService: JobMatchingService) {}

  @Post()
  create(@Body() createJobMatchingDto: CreateJobMatchingDto) {
    return this.jobMatchingService.create(createJobMatchingDto);
  }

  @Get()
  findAll() {
    return this.jobMatchingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobMatchingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobMatchingDto: UpdateJobMatchingDto) {
    return this.jobMatchingService.update(+id, updateJobMatchingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobMatchingService.remove(+id);
  }
}
