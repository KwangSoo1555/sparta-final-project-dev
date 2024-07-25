import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EmailVerificationService } from "src/modules/auth/common/email/email.service";

import { UsersEntity } from "src/entities/users.entity";
import { FindIdDto } from "./find-account.dto/find-id.dto";
import { FindPwDto } from "./find-account.dto/find-pw.dto";
import { MESSAGES } from "src/common/constants/message.constant";

@Injectable()
export class FindAccountService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async findId(findIdDto: FindIdDto) {
    const user = await this.userRepository.findOne({
      where: { name: findIdDto.name, email: findIdDto.email },
    });

    if (!user) throw new NotFoundException("가입되지 않은 이메일입니다.");

    const sendedEmailCode = await this.emailVerificationService.getCode(user.email);
    const isExpired = await this.emailVerificationService.isExpired(user.email);

    if (!sendedEmailCode || isExpired || sendedEmailCode !== findIdDto.verificationCode)
      throw new BadRequestException(MESSAGES.AUTH.SIGN_UP.EMAIL.VERIFICATION_CODE.INCONSISTENT);

    return user.email;
  }

  async findPw(findPwDto: FindPwDto) {
    const user = await this.userRepository.findOne({
      where: { email: findPwDto.email },
    });
    if (!user) throw new NotFoundException("가입되지 않은 이메일입니다.");
    return user.password;
  }
}
