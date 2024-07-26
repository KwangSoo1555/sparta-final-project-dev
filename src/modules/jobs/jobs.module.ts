import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

import { JobsEntity } from 'src/entities/jobs.entity'
import { UsersEntity } from 'src/entities/users.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([JobsEntity, UsersEntity]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
