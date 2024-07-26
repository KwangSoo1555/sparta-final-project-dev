import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

import { MESSAGES } from "src/common/constants/message.constant";

@Injectable()
export class UserSignOutService {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  async signOut(userId: number) {
    await this.refreshTokenRepository.update({ userId }, { refreshToken: null });

    return {
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
    };
  }
}
