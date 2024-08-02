import _ from "lodash";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MESSAGES } from "src/common/constants/message.constant";

import { JobsMatchingEntity } from "src/entities/jobs-matching.entity";
import { JobsEntity } from "src/entities/jobs.entity";
import { UsersEntity } from "src/entities/users.entity";

@Injectable()
export class JobMatchingService {
  constructor(
    @InjectRepository(JobsMatchingEntity)
    private jobsMatchingRepository: Repository<JobsMatchingEntity>,
    @InjectRepository(JobsEntity) private jobsRepository: Repository<JobsEntity>,
    @InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
  ) {}

  async create(customerId: number, jobsId: number) {
    const verifyUserbyId = await this.userRepository.findOne({
      where: {
        id: customerId,
      },
    });
    if (verifyUserbyId === undefined || verifyUserbyId === null) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    const verifyJobbyId = await this.jobsRepository.findOne({
      where: {
        id: jobsId,
        deletedAt: null,
      },
    });
    if (verifyJobbyId === undefined || verifyJobbyId === null) {
      throw new NotFoundException(MESSAGES.JOBS.NOT_EXISTS);
    }

    const data = await this.jobsMatchingRepository.save({
      customerId,
      jobId: jobsId,
      matchedYn: false,
      rejectedYn: false,
    });

    return data;
  }

  async findAllApply(userId: number) {
    const data = await this.jobsMatchingRepository.find({
      relations: ["users","job"],
      select:{
        id : true,
        customerId : true,
        jobId : true,
        matchedYn : true,
        rejectedYn : true,
        createdAt : true,
        users:{
          name : true,
        },
        job:{
          ownerId : true,
          title : true,
          content : true,
          price : true,
          photoUrl : true,
          address : true,
          category : true,
          expiredYn : true,
          matchedYn : true,
        }
      },
      where: {
        customerId: userId,
        deletedAt: null,
      },
      order: { createdAt: "DESC" },
    });

    return data;
  }

  async findAllApplication(userId: number) {
    const data = await this.jobsMatchingRepository.find({
      relations: ["users","job"],
      select:{
        id : true,
        customerId : true,
        jobId : true,
        matchedYn : true,
        rejectedYn : true,
        createdAt : true,
        users:{
          name : true,
        },
        job:{
          ownerId : true,
          title : true,
          content : true,
          price : true,
          photoUrl : true,
          address : true,
          category : true,
          expiredYn : true,
          matchedYn : true,
        }
      },
      where: {
        job:{
          ownerId: userId,
          deletedAt: null,
        }
      },
      order: { createdAt: "DESC" },
    });

    return data;
  }

  async findOne(matchingId: number) {
    const data = await this.jobsMatchingRepository.findOne({
      where: {
        id: matchingId,
      },
    });

    return data;
  }

  async updateMatchYn(userId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOne({ 
      where:{ id: matchingId },
      relations: ["job"],
    });
    if (matching === undefined || matching === null) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.job.ownerId !== userId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.MATCHING.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.update(
      { id: matchingId },
      {
        matchedYn: true,
      },
    );
  }

  async updateRejectYn(userId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOne({ 
      where:{ id: matchingId },
      relations: ["job"],
    });
    if (matching === undefined || matching === null) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.job.ownerId !== userId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.REJECT.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.update(
      { id: matchingId },
      {
        rejectedYn: true,
      },
    );
  }

  async remove(userId: number, matchingId: number) {
    const matching = await this.jobsMatchingRepository.findOneBy({ id: matchingId });
    if (matching === undefined || matching === null) {
      throw new NotFoundException(MESSAGES.JOBMATCH.NOT_EXISTS);
    }
    if (matching.customerId !== userId) {
      throw new BadRequestException(MESSAGES.JOBMATCH.DELETE.NOT_VERIFY);
    }

    return await this.jobsMatchingRepository.softRemove({ id: matchingId });
  }
}
