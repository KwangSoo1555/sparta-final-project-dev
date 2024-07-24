import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ConfigService } from "@nestjs/config";
import { EmailVerificationService } from "src/modules/auth/common/email/email.service";

import { UsersEntity } from "src/entities/users.entity";
import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";
import { UserLocalSignUpDto } from "src/modules/auth/local/auth-local.dto/sign-up.dto";
import { UserLocalSignInDto } from "src/modules/auth/local/auth-local.dto/sign-in.dto";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class UserLocalService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  async checkUserForAuth(params: { email?: string; id?: number }) {
    return this.userRepository.findOne({ where: { ...params } });
  }

  async signUp(signUpDto: UserLocalSignUpDto) {
    const { email, password, verificationCode, provider, socialId } = signUpDto;

    // 소셜 회원가입 처리
    if (provider && socialId) {
      const existingUser = await this.checkUserForAuth({ email });
      if (existingUser) throw new ConflictException(MESSAGES.AUTH.SIGN_UP.EMAIL.DUPLICATED);

      const user = this.userRepository.create({
        email,
        name: signUpDto.name,
        socialId,
        provider,
      });

      return await this.userRepository.save(user);
    }

    // 소셜 회원가입이 아닌 로컬 회원가입 처리
    else {
      // 이메일 인증 코드 확인
      const sendedEmailCode = await this.emailVerificationService.getCode(email);
      const isExpired = await this.emailVerificationService.isExpired(email);
      if (!sendedEmailCode || isExpired || sendedEmailCode !== verificationCode)
        throw new BadRequestException(MESSAGES.AUTH.SIGN_UP.EMAIL.VERIFICATION_CODE.INCONSISTENT);

      // 이미 존재하는 유저인 경우 에러 처리
      const existingUser = await this.checkUserForAuth({ email });
      if (existingUser) throw new ConflictException(MESSAGES.AUTH.SIGN_UP.EMAIL.DUPLICATED);

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANT.HASH_SALT_ROUNDS);

      // 유저 생성
      const user = this.userRepository.create({
        ...signUpDto,
        password: hashedPassword,
      });

      const signUpUser = await this.userRepository.save(user);

      // 비밀번호 필드를 undefined로 설정
      signUpUser.password = undefined;

      return signUpUser;
    }
  }

  async logIn(logInDto: UserLocalSignInDto, ip: string, userAgent: string) {
    const user = await this.checkUserForAuth({ email: logInDto.email });

    // 유저 존재 여부 확인
    if (!user) throw new NotFoundException(MESSAGES.AUTH.LOG_IN.LOCAL.EMAIL.NOT_FOUND);

    // 비밀번호 일치 여부 확인
    const isPasswordMatch = await bcrypt.compare(logInDto.password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException(MESSAGES.AUTH.LOG_IN.LOCAL.PASSWORD.INCONSISTENT);

    // JWT 발급
    const payload = { userId: user.id };

    const accessToken = jwt.sign(payload, this.configService.get("ACCESS_TOKEN_SECRET"), {
      expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, this.configService.get("REFRESH_TOKEN_SECRET"), {
      expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRES_IN,
    });

    // refresh token 해싱
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, AUTH_CONSTANT.HASH_SALT_ROUNDS);

    // hashed refresh token 을 jwt entity 에 저장
    await this.refreshTokenRepository.upsert(
      {
        userId: user.id,
        refreshToken: hashedRefreshToken,
        ip,
        userAgent,
      },
      ["userId"],
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logOut(userId: number) {
    await this.refreshTokenRepository.update(
      { userId },
      { refreshToken: null },
      // accessToken expires
    );

    // 유저가 로그아웃 하면 유저의 모든 access token 만료
    // 왜냐? 유저가 로그아웃 하면 access token 도 expire 해야 하기 때문
    // 그렇지 않으면 유저가 로그아웃 한 후에도 crud 가 가능하기 때문

    return {
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
    };
  }
}
