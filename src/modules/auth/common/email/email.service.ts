import * as nodemailer from "nodemailer";
import { Redis } from "ioredis";

import { Injectable, HttpStatus, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailVerificationDto } from "./auth-common-email.dto/email-verification.dto";
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

  codeNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  codeIssue() {
    return this.codeNumber(111111, 999999);
  }

  async isExpired(email: string) {
    const expirationTime = 5 * 60 * 1000; // 5분 뒤 코드 인증 만료
    const timestamp = await this.redisClient.get(`${email}:timestamp`);
    if (!timestamp) return true;
    return Date.now() > parseInt(timestamp) + expirationTime;
  }

  async getCode(email: string) {
    const code = await this.redisClient.get(email);
    return code ? parseInt(code) : null;
  }

  async sendAuthEmail(emailVerificationDto: EmailVerificationDto) {
    const verificationCode = this.codeIssue();
    const timestamp = Date.now();
    const email = emailVerificationDto.email;

    const mailOptions = {
      from: AUTH_CONSTANT.AUTH_EMAIL.FROM,
      to: email,
      subject: AUTH_CONSTANT.AUTH_EMAIL.SUBJECT,
      html: `
        <p>${AUTH_CONSTANT.AUTH_EMAIL.HTML}</p> <br>
        <p>인증코드: ${verificationCode}</p>
        `,
    };

    await this.redisClient.set(email, verificationCode.toString());
    await this.redisClient.set(`${email}:timestamp`, timestamp.toString());

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
}
