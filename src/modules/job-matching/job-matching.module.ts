import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobMatchingService } from './job-matching.service';
import { JobMatchingController } from './job-matching.controller';

import { JobsMatchingEntity } from 'src/entities/jobs-matching.entity'
import { JobsEntity } from 'src/entities/jobs.entity'
import { UsersEntity } from 'src/entities/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsMatchingEntity,JobsEntity, UsersEntity]),
  ],
  controllers: [JobMatchingController],
  providers: [JobMatchingService],
})
export class JobMatchingModule {}
