import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto, userId : number) {
    return this.jobsService.create(createJobDto,userId);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':jobsId')
  update(@Param('jobsId') jobId: string, ownerId : number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+jobId, ownerId, updateJobDto);
  }

  @Delete(':jobsId')
  remove(@Param('jobsId') jobsId: string, ownerId: number) {
    return this.jobsService.remove(+jobsId, ownerId);
  }
}
