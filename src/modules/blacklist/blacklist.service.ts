import _ from "lodash";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MESSAGES } from "src/common/constants/message.constant";

import { BlacklistsEntity } from "src/entities/blacklists.entity";
import { UsersEntity } from "src/entities/users.entity";

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistsEntity) private blacklistRepository: Repository<BlacklistsEntity>,
    @InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
  ) {}

  async create(blackedId: number, userId: number) {
    const verifyUserbyId = await this.userRepository.findOne({
      where: {
        id: blackedId,
      },
    });
    if (verifyUserbyId === undefined || verifyUserbyId === null) {
      throw new NotFoundException(MESSAGES.USERS.COMMON.NOT_FOUND);
    }

    const data = await this.blacklistRepository.save({
      userId,
      blackedId,
    });

    return data;
  }

  async findAll(userId: number) {
    const data = await this.blacklistRepository.find({
      relations: ["blackedUser"],
      select:{
        id : true,
        userId : true,
        blackedId : true,
        blackedUser:{
          name : true,
        },
      },
      where: {
        userId,
      },
    });

    return data;
  }

  async remove(blacklistId: number, userId: number) {
    const blacklist = await this.blacklistRepository.findOneBy({ id: blacklistId });
    if (blacklist === undefined || blacklist === null) {
      throw new NotFoundException(MESSAGES.BLACKLIST.NOT_EXISTS);
    }
    if (blacklist.userId !== userId) {
      throw new BadRequestException(MESSAGES.BLACKLIST.DELETE.NOT_VERIFY);
    }

    return await this.blacklistRepository.softRemove({ id: blacklistId });
  }
}
