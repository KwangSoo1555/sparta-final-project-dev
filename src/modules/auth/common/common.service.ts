import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Redis } from "ioredis";

import { Injectable, HttpStatus, Inject, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

import { UsersEntity } from "src/entities/users.entity";
import { RefreshTokensEntity } from "src/entities/refresh-tokens.entity";

import { EmailVerificationDto } from "./dto/email-verification.dto";
import { FindPwDto } from "./dto/find-pw.dto";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class AuthCommonService {
  private smtpTransport: nodemailer.Transporter;

  constructor(
    @Inject("REDIS_CLIENT") private redisClient: Redis,
    private configService: ConfigService,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {
    this.smtpTransport = nodemailer.createTransport({
      service: "naver",
      auth: {
        user: this.configService.get<string>("MAIL_AUTH_USER"),
        pass: this.configService.get<string>("MAIL_AUTH_PASS"),
      },
    });
  }

  private codeNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private codeString() {
    return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);
  }

  // 메일 인증 코드 발송
  async sendAuthEmail(emailVerificationDto: EmailVerificationDto) {
    const email = emailVerificationDto.email;
    const verificationCode = this.codeNumber(111111, 999999);
    const timestamp = Date.now();

    const mailOptions = {
      from: AUTH_CONSTANT.AUTH_EMAIL.FROM,
      to: email,
      subject: AUTH_CONSTANT.AUTH_EMAIL.SUBJECT,
      html: `
        <p>${AUTH_CONSTANT.AUTH_EMAIL.HTML}</p> <br>
        <p>${verificationCode}</p>
        `,
    };

    await this.redisClient.set(email, verificationCode);
    await this.redisClient.set(`${email}:timestamp`, timestamp);

    await this.smtpTransport.sendMail(mailOptions);

    console.log("code:", verificationCode);

    const sendTime = new Date(timestamp).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

    return {
      status: HttpStatus.OK,
      message: MESSAGES.AUTH.SIGN_UP.EMAIL.SUCCEED,
      data: {
        code: verificationCode,
        timestamp: sendTime,
      },
    };
  }

  // redis 에서 메일 인증 코드 조회
  async getVerificationCode(email: string): Promise<number | null> {
    const code = await this.redisClient.get(email);
    return code ? parseInt(code) : null;
  }

  // redis 에서 메일 인증 코드 만료 여부 확인
  async isExpired(email: string) {
    const expirationTime = 5 * 60 * 1000; // 5분 뒤 코드 인증 만료
    const timestamp = await this.redisClient.get(`${email}:timestamp`);
    if (!timestamp) return true;
    return Date.now() > parseInt(timestamp) + expirationTime;
  }

  // 임시 비밀번호 발송
  async sendTempPassword(emailVerificationDto: EmailVerificationDto) {
    const email = emailVerificationDto.email;
    const tempPassword = this.codeString();

    const mailOptions = {
      from: AUTH_CONSTANT.AUTH_EMAIL.FROM,
      to: email,
      subject: AUTH_CONSTANT.TEMP_PASSWORD_EMAIL.SUBJECT,
      html: `
        <p>${AUTH_CONSTANT.TEMP_PASSWORD_EMAIL.HTML}</p> <br>
        <p>${tempPassword}</p>
        `,
    };

    await this.redisClient.set(email, tempPassword);

    await this.smtpTransport.sendMail(mailOptions);

    console.log("tempPassword:", tempPassword);

    return {
      status: HttpStatus.OK,
      message: MESSAGES.AUTH.SIGN_UP.EMAIL.SUCCEED,
      data: {
        tempPassword: tempPassword,
      },
    };
  }

  // redis 에서 임시 비밀번호 조회
  async getTempPassword(email: string): Promise<string | null> {
    const tempPassword = await this.redisClient.get(email);
    return tempPassword || null;
  }

  // redis 에서 임시 비밀번호 삭제
  async deleteTempPassword(email: string) {
    await this.redisClient.del(email);
  }

  async findPw(findPwDto: FindPwDto) {
    const user = await this.userRepository.findOne({
      where: { email: findPwDto.email, name: findPwDto.name },
    });

    if (!user) throw new NotFoundException("가입되지 않은 계정입니다.");

    // 임시 비밀번호
    const tempPassword = await this.getTempPassword(findPwDto.email);
    if (findPwDto.tempPassword !== tempPassword) {
      throw new NotFoundException("잘못된 임시 비밀번호입니다.");
    } else {
      await this.deleteTempPassword(findPwDto.email);
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

  async tokenReissue(userId: number, refreshToken: string, ip: string, userAgent: string) {
    // refresh token 을 가지고 있는 유저인지 확인
    const existingRefreshToken = await this.refreshTokenRepository.findOne({ where: { userId } });
    if (!existingRefreshToken) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    // 제출된 refresh token 과 저장된 refresh token 이 일치하는지 확인
    const matchRefreshToken = await bcrypt.compare(refreshToken, existingRefreshToken.refreshToken);
    if (!matchRefreshToken) throw new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID);

    // access token 과 refresh token 을 새롭게 발급
    const reIssueAccessToken = jwt.sign({ userId }, this.configService.get("ACCESS_TOKEN_SECRET"), {
      expiresIn: AUTH_CONSTANT.ACCESS_TOKEN_EXPIRES_IN,
    });

    const reIssueRefreshToken = jwt.sign(
      { userId },
      this.configService.get("REFRESH_TOKEN_SECRET"),
      { expiresIn: AUTH_CONSTANT.REFRESH_TOKEN_EXPIRES_IN },
    );

    // 새롭게 발급한 refresh token 을 해싱
    const hashedReIssueRefreshToken = await bcrypt.hash(
      reIssueRefreshToken,
      AUTH_CONSTANT.HASH_SALT_ROUNDS,
    );

    // 해싱된 refresh token 을 저장
    await this.refreshTokenRepository.upsert(
      {
        userId,
        refreshToken: hashedReIssueRefreshToken,
        ip,
        userAgent,
      },
      ["userId"],
    );

    return {
      accessToken: reIssueAccessToken,
      refreshToken: reIssueRefreshToken,
    };
  }

  async signOut(userId: number) {
    await this.refreshTokenRepository.update({ userId }, { refreshToken: null });

    return {
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
    };
  }
}
