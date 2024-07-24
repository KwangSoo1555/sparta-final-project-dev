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

  async logOut(userId: number) {
    await this.refreshTokenRepository.update({ userId }, { refreshToken: null });

    // 유저가 로그아웃 하면 유저의 모든 access token 만료
    // 왜냐? 그렇지 않으면 유저가 로그아웃 한 후에도 crud 가 가능하기 때문

    return {
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
    };
  }
}
