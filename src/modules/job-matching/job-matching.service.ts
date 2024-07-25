import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGES } from 'src/common/constants/message.constant'
import { CreateJobMatchingDto } from './dto/create-job-matching.dto';
import { UpdateJobMatchingDto } from './dto/update-job-matching.dto';

import { JobsMatchingEntity } from 'src/entities/jobs-matching.entity'
import { JobsEntity } from 'src/entities/jobs.entity'
import { UsersEntity  } from 'src/entities/users.entity'

@Injectable()
export class JobMatchingService {
  constructor(
    @InjectRepository(JobsMatchingEntity) private jobsMatchingRepository: Repository<JobsMatchingEntity>,
    @InjectRepository(JobsEntity) private jobsRepository: Repository<JobsEntity>,
    @InjectRepository(UsersEntity) private UserRepository: Repository<UsersEntity>,
  ) {}

  create(createJobMatchingDto: CreateJobMatchingDto) {
    return 'This action adds a new jobMatching';
  }

  findAll() {
    return `This action returns all jobMatching`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobMatching`;
  }

  update(id: number, updateJobMatchingDto: UpdateJobMatchingDto) {
    return `This action updates a #${id} jobMatching`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobMatching`;
  }
}
