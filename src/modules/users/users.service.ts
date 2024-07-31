import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersEntity } from "src/entities/users.entity";
import { UsersUpdateDto } from "src/modules/users/dto/update-user.dto";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async checkUserForUsers(params: { email?: string; id?: number }) {
    return this.userRepository.findOne({ where: { ...params } });
  }

  async getUsers(userId: number) {
    const user = await this.checkUserForUsers({ id: userId });

    user.password = undefined;
    return user;
  }

  async updateUser(userId: number, userUpdateDto: UsersUpdateDto) {
    const { name, currentPasswordCheck, newPassword } = userUpdateDto;
    const user = await this.checkUserForUsers({ id: userId });
    let hashedNewPassword: string;

    // 유저가 새로운 비밀번호 입력 시 유효성 검사
    if (newPassword) {
      // 현재 비밀번호 입력 누락 시 오류 발생
      if (!currentPasswordCheck)
        throw new UnauthorizedException(
          MESSAGES.USERS.UPDATE_ME.PASSWORD.CURRENT_PASSWORD_REQUIRED,
        );

      // 새로운 비밀번호와 현재 비밀번호가 같으면 오류 발생
      if (newPassword === currentPasswordCheck)
        throw new UnauthorizedException(
          MESSAGES.USERS.UPDATE_ME.PASSWORD.NEW_PASSWORD_NOT_EQUAL_CURRENT_PASSWORD,
        );

      // 현재 비밀번호 입력 시 비밀번호 일치 여부 체크
      const isPasswordMatch = await bcrypt.compare(currentPasswordCheck, user.password);
      if (!isPasswordMatch)
        throw new UnauthorizedException(
          MESSAGES.USERS.UPDATE_ME.PASSWORD.CURRENT_PASSWORD_INCONSISTENT,
        );

      // 새로운 비밀번호 입력 시 비밀번호 해싱
      hashedNewPassword = await bcrypt.hash(newPassword, AUTH_CONSTANT.HASH_SALT_ROUNDS);
    }

    const updated: Partial<UsersEntity> = {};
    if (name) updated.name = name;
    if (newPassword) updated.password = hashedNewPassword;

    await this.userRepository.update({ id: userId }, updated);

    // 업데이트된 유저 정보 반환
    const updatedUser = await this.checkUserForUsers({ id: userId });
    updatedUser.password = undefined;

    return updatedUser;
  }

  async quitUser(userId: number) {
    await this.userRepository.update({ id: userId }, { deletedAt: new Date() });
  }
}
