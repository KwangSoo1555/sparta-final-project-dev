import * as nodemailer from "nodemailer";
import { Redis } from "ioredis";

import { Injectable, HttpStatus, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailVerificationDto } from "./email.dto/email-verification.dto";
import { MESSAGES } from "src/common/constants/message.constant";
import { AUTH_CONSTANT } from "src/common/constants/auth.constant";

@Injectable()
export class EmailVerificationService {
  private smtpTransport: nodemailer.Transporter;

  constructor(
    @Inject("REDIS_CLIENT") private redisClient: Redis,
    private configService: ConfigService,
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
}
