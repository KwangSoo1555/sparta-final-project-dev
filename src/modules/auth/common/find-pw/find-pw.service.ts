import * as bcrypt from "bcrypt";

import { Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EmailVerificationService } from "src/modules/auth/common/email/email.service";

import { UsersEntity } from "src/entities/users.entity";
import { FindPwDto } from "./find-pw.dto/find-pw.dto";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class FindPwService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async findPw(findPwDto: FindPwDto) {
    const user = await this.userRepository.findOne({
      where: { email: findPwDto.email, name: findPwDto.name },
    });

    if (!user) throw new NotFoundException("가입되지 않은 계정입니다.");

    // 임시 비밀번호
    const tempPassword = await this.emailVerificationService.getTempPassword(findPwDto.email);
    if (findPwDto.tempPassword !== tempPassword) {
      throw new NotFoundException("잘못된 임시 비밀번호입니다.");
    } else {
      await this.emailVerificationService.deleteTempPassword(findPwDto.email);
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(tempPassword, AUTH_CONSTANT.HASH_SALT_ROUNDS);

    // 비밀번호 업데이트
    await this.userRepository.update(user.id, { password: hashedPassword });

    return {
      status: HttpStatus.OK,
      message: "비밀번호가 임시 비밀번호로 변경되었습니다.",
      data: {
        password: tempPassword,
      },
    };
  }
}
