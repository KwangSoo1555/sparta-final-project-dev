import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGES } from 'src/common/constants/message.constant'

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

  create(customerId : number, jobsId : number) {
    return 'This action adds a new jobMatching';
  }

  async findAll(userId : number) {
    const data = await this.jobsMatchingRepository.find({
      where: {
        customerId : userId,
        deletedAt : null,
      },
    })

    return data;
  }

  async findOne(matchingId: number) {
    const data = await this.jobsMatchingRepository.findOne({
      where: {
        id : matchingId,
      },
    })

    return data;
  }

  async updateMatchYn(customerId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOneBy({ id : matchingId });
    if (_.isNil(matching)) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.customerId !== customerId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.MATCHING.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.update({ id : matchingId }, 
      {
        matchedYn : true,
      });
  }

  async updateRejectYn(customerId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOneBy({ id : matchingId });
    if (_.isNil(matching)) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.customerId !== customerId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.REJECT.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.update({ id : matchingId }, 
      {
        rejectedYn : true,
      });
  }

  async remove(customerId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOneBy({ id : matchingId });
    if (_.isNil(matching)) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.customerId !== customerId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.DELETE.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.softRemove({ id : matchingId });
  }
}
