import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

import { MESSAGES } from 'src/common/constants/message.constant'
import { JobsEntity } from 'src/entities/jobs.entity'
import { UsersEntity  } from 'src/entities/users.entity'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobsEntity) private jobsRepository: Repository<JobsEntity>,
    @InjectRepository(UsersEntity) private UserRepository: Repository<UsersEntity>,
  ) {}

  async create(createJobDto: CreateJobDto, userId: number) {

    const { title, content, photoUrl, price, address, category } = createJobDto;

    const verifyUserbyId = await this.UserRepository.findOne({
      where: {
        id : userId
      },
    })

    if (_.isNil(verifyUserbyId)) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    const data = await this.jobsRepository.save({
      ownerId : userId,
      title, 
      content, 
      photoUrl, 
      price, 
      address, 
      category,
      expiredYn : false,
      matchedYn : false
    });
    return data;
  }

  async findAll() {
    const data = await this.jobsRepository.find({
      where: {
        expiredYn : false,
        matchedYn : false,
      },
    })

    return data;
  }

  async findOne(id: number) {
    const data = await this.jobsRepository.findOne({
      where: {
        id
      },
    })

    return data;
  }

  async update(ownerId: number, jobsId: number, updateJobDto: UpdateJobDto) {
    const jobs = await this.jobsRepository.findOneBy({ id : jobsId });
    if (_.isNil(jobs)) {
      throw new NotFoundException(MESSAGES.JOBS.NOT_EXISTS);
    }
    if (jobs.ownerId !== ownerId) {
      throw new BadRequestException(MESSAGES.JOBS.UPDATE.NOT_VERIFY);
    }

    return await this.jobsRepository.update({ id : jobsId }, updateJobDto);
  }

  async remove(ownerId: number, jobsId: number) {
    const jobs = await this.jobsRepository.findOneBy({ id : jobsId });
    if (_.isNil(jobs)) {
      throw new NotFoundException(MESSAGES.JOBS.NOT_EXISTS);
    }
    if (jobs.ownerId !== ownerId) {
      throw new BadRequestException(MESSAGES.JOBS.DELETE.NOT_VERIFY);
    }

    return await this.jobsRepository.softRemove({ id : jobsId });
  }
}
