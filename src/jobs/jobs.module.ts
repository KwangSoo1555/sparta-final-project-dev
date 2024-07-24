import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

import { JobsEntity } from 'src/entities/jobs.entity'
import { JobsMatchingEntity } from 'src/entities/jobs-matching.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsEntity, JobsMatchingEntity]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
