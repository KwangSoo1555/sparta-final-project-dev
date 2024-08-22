import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";
import nodemailerMock from "nodemailer-mock";
import { Redis } from "ioredis";

import { Test, TestingModule } from "@nestjs/testing";
import {
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { AuthService } from "../../src/modules/auth/auth.service";

import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RefreshTokensEntity } from "../../src/entities/refresh-tokens.entity";
import { UsersEntity } from "../../src/entities/users.entity";

import { JwtPayload } from "../../src/common/customs/types/jwt-payload.type";
import { AUTH_CONSTANT } from "../../src/common/constants/auth.constant";
import { MESSAGES } from "../../src/common/constants/message.constant";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("nodemailer", () => nodemailerMock);

describe("AuthService", () => {
  let service: AuthService;
  let userRepository: Repository<UsersEntity>;
  let refreshTokenRepository: Repository<RefreshTokensEntity>;
  let redisClient: Redis;
  let configService: ConfigService;

  beforeEach(async () => {
    nodemailerMock.mock.reset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshTokensEntity),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            upsert: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: "REDIS_CLIENT",
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            hmset: jest.fn(),
            hmget: jest.fn(),
            expire: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "MAIL_AUTH_USER") return "test@example.com";
              if (key === "MAIL_AUTH_PASS") return "password";
              if (key === "ACCESS_TOKEN_SECRET") return "access_secret";
              if (key === "REFRESH_TOKEN_SECRET") return "refresh_secret";
              return null;
            }),
          },
        },
        {
          provide: "SMTP_TRANSPORT",
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
    refreshTokenRepository = module.get<Repository<RefreshTokensEntity>>(
      getRepositoryToken(RefreshTokensEntity),
    );
    redisClient = module.get<Redis>("REDIS_CLIENT");
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    nodemailerMock.mock.reset();
  });

  describe("sendAuthEmail", () => {
    it("이메일 전송에 실패 시 에러 발생", async () => {
      const emailVerificationDto = { email: "test@example.com" };
      jest.spyOn(redisClient, "set").mockResolvedValue("OK");
      nodemailerMock.mock.setShouldFailOnce();

      await expect(service.sendAuthEmail(emailVerificationDto)).rejects.toThrow(
        MESSAGES.AUTH.SIGN_UP.EMAIL.FAIL,
      );
    });

    it("인증 이메일을 발송 성공", async () => {
      const emailVerificationDto = { email: "test@example.com" };
      jest.spyOn(redisClient, "set").mockResolvedValue("OK");
      nodemailerMock.mock.setShouldFailOnce(false);

      const result = await service.sendAuthEmail(emailVerificationDto);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.message).toBe(MESSAGES.AUTH.SIGN_UP.EMAIL.SUCCEED);
      expect(result.data).toHaveProperty("code");
      expect(result.data).toHaveProperty("timestamp");

      const sentMail = nodemailerMock.mock.getSentMail();
      expect(sentMail.length).toBe(1);
      expect(sentMail[0].to).toBe(emailVerificationDto.email);
    });
  });

  describe("getVerificationCode", () => {
    it("should return verification code from Redis", async () => {
      jest.spyOn(redisClient, "get").mockResolvedValue("123456");

      const result = await service.getVerificationCode("test@example.com");

      expect(result).toBe(123456);
    });

    it("should return null if verification code is not found", async () => {
      jest.spyOn(redisClient, "get").mockResolvedValue(null);

      const result = await service.getVerificationCode("test@example.com");

      expect(result).toBeNull();
    });
  });

  describe("sendTempPassword", () => {
    it("should send temporary password successfully", async () => {
      const emailVerificationDto = { email: "test@example.com" };
      jest.spyOn(redisClient, "set").mockResolvedValue("OK");
      jest.spyOn(service["smtpTransport"], "sendMail").mockResolvedValue({} as any);

      const result = await service.sendTempPassword(emailVerificationDto);

      expect(result.status).toBe(200);
      expect(result.message).toBe(MESSAGES.AUTH.SIGN_UP.EMAIL.SUCCEED);
      expect(result.data).toHaveProperty("tempPassword");
    });

    it("should throw an error if temporary password sending fails", async () => {
      const emailVerificationDto = { email: "test@example.com" };
      jest.spyOn(redisClient, "set").mockResolvedValue("OK");
      jest
        .spyOn(service["smtpTransport"], "sendMail")
        .mockRejectedValue(new Error("Email sending failed"));

      await expect(service.sendTempPassword(emailVerificationDto)).rejects.toThrow(
        "Email sending failed",
      );
    });
  });

  describe("getTempPassword", () => {
    it("should return temporary password from Redis", async () => {
      jest.spyOn(redisClient, "get").mockResolvedValue("tempPass123");

      const result = await service.getTempPassword("test@example.com");

      expect(result).toBe("tempPass123");
    });

    it("should return null if temporary password is not found", async () => {
      jest.spyOn(redisClient, "get").mockResolvedValue(null);

      const result = await service.getTempPassword("test@example.com");

      expect(result).toBeNull();
    });
  });

  describe("checkUserForAuth", () => {
    it("should return user if found", async () => {
      const mockUser = { id: 1, email: "test@example.com" };
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser as UsersEntity);

      const result = await service.checkUserForAuth({ email: "test@example.com" });

      expect(result).toEqual(mockUser);
    });

    it("should return null if user is not found", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      const result = await service.checkUserForAuth({ email: "test@example.com" });

      expect(result).toBeNull();
    });
  });

  describe("signUp", () => {
    const signUpDto = {
      email: "test@example.com",
      name: "Test User",
      password: "password123",
      verificationCode: 123456,
    };

    it("should throw ConflictException if user already exists", async () => {
      jest
        .spyOn(service, "checkUserForAuth")
        .mockResolvedValue({ id: 1, deletedAt: null } as UsersEntity);

      await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });

    it("should throw BadRequestException if verification code is incorrect", async () => {
      jest.spyOn(service, "checkUserForAuth").mockResolvedValue(null);
      jest.spyOn(service, "getVerificationCode").mockResolvedValue(654321);

      await expect(service.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it("should recover a soft-deleted user", async () => {
      jest.spyOn(service, "checkUserForAuth").mockResolvedValue(null);
      jest.spyOn(service, "getVerificationCode").mockResolvedValue(123456);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue({ id: 1, deletedAt: new Date() } as UsersEntity);
      jest.spyOn(userRepository, "save").mockResolvedValue({
        id: 1,
        ...signUpDto,
        password: undefined,
        deletedAt: null,
      } as unknown as UsersEntity);
      jest.spyOn(redisClient, "del").mockResolvedValue(1);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({
        id: 1,
        email: signUpDto.email,
        name: signUpDto.name,
        deletedAt: null,
      });
      expect("password" in result).toBeFalsy();
    });

    it("should create a new user if everything is valid", async () => {
      jest.spyOn(service, "checkUserForAuth").mockResolvedValue(null);
      jest.spyOn(service, "getVerificationCode").mockResolvedValue(123456);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(userRepository, "create").mockReturnValue({
        id: 1,
        ...signUpDto,
        password: "hashedPassword",
        deletedAt: null,
      } as unknown as UsersEntity);

      jest
        .spyOn(userRepository, "save")
        .mockResolvedValue({ id: 1, ...signUpDto, password: undefined } as unknown as UsersEntity);
      jest.spyOn(redisClient, "del").mockResolvedValue(1);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ id: 1, email: signUpDto.email, name: signUpDto.name });
      expect("password" in result).toBeFalsy();
    });
  });

  describe("signIn", () => {
    const signInDto = { email: "test@example.com", password: "password123" };

    it("should throw NotFoundException if user does not exist", async () => {
      jest.spyOn(service, "checkUserForAuth").mockResolvedValue(null);

      await expect(service.signIn(signInDto, "127.0.0.1", "test-agent")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      jest
        .spyOn(service, "checkUserForAuth")
        .mockResolvedValue({ id: 1, password: "hashedPassword" } as UsersEntity);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(service.signIn(signInDto, "127.0.0.1", "test-agent")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should return tokens and role if credentials are correct", async () => {
      jest
        .spyOn(service, "checkUserForAuth")
        .mockResolvedValue({ id: 1, password: "hashedPassword" } as UsersEntity);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
      jest
        .spyOn(service, "createToken")
        .mockReturnValueOnce("accessToken")
        .mockReturnValueOnce("refreshToken");
      jest.spyOn(service, "refreshTokenStore").mockResolvedValue(undefined);

      const result = await service.signIn(signInDto, "127.0.0.1", "test-agent");

      expect(result).toEqual({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        role: "user",
      });
    });
  });

  describe("socialSignIn", () => {
    const mockUser = { id: 1, email: "test@example.com", role: "user" };
    const mockResponse = { redirect: jest.fn() };

    it("should recover a soft-deleted user", async () => {
      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue({ ...mockUser, deletedAt: new Date() } as UsersEntity);
      jest
        .spyOn(userRepository, "save")
        .mockResolvedValue({ ...mockUser, deletedAt: null } as UsersEntity);
      jest.spyOn(service, "createToken").mockReturnValue("token");
      jest.spyOn(service, "refreshTokenStore").mockResolvedValue(undefined);
      jest.spyOn(redisClient, "hmset").mockResolvedValue("OK");
      jest.spyOn(redisClient, "expire").mockResolvedValue(1);

      await service.socialSignIn(
        mockUser,
        "127.0.0.1",
        "test-agent",
        "authCode",
        mockResponse as any,
      );

      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ deletedAt: null }),
      );
      expect(mockResponse.redirect).toHaveBeenCalled();
    });

    it("should create a new user if not exists", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(service, "checkUserForAuth").mockResolvedValue(null);
      jest.spyOn(userRepository, "save").mockResolvedValue(mockUser as UsersEntity);
      jest.spyOn(service, "createToken").mockReturnValue("token");
      jest.spyOn(service, "refreshTokenStore").mockResolvedValue(undefined);
      jest.spyOn(redisClient, "hmset").mockResolvedValue("OK");
      jest.spyOn(redisClient, "expire").mockResolvedValue(1);

      await service.socialSignIn(
        mockUser,
        "127.0.0.1",
        "test-agent",
        "authCode",
        mockResponse as any,
      );

      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.redirect).toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if an error occurs", async () => {
      jest.spyOn(userRepository, "findOne").mockRejectedValue(new Error("Database error"));

      await expect(
        service.socialSignIn(mockUser, "127.0.0.1", "test-agent", "authCode", mockResponse as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("getAuthCode", () => {
    it("should return auth data from Redis", async () => {
      jest.spyOn(redisClient, "hmget").mockResolvedValue(["accessToken", "refreshToken", "user"]);

      const result = await service.getAuthCode("authCode");

      expect(result).toEqual(["accessToken", "refreshToken", "user"]);
    });
  });

  describe("tokenReissue", () => {
    it("should throw UnauthorizedException if refresh token does not exist", async () => {
      jest.spyOn(refreshTokenRepository, "findOne").mockResolvedValue(null);

      await expect(
        service.tokenReissue(1, "refreshToken", "127.0.0.1", "test-agent"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if refresh tokens do not match", async () => {
      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValue({ refreshToken: "hashedToken" } as RefreshTokensEntity);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(
        service.tokenReissue(1, "refreshToken", "127.0.0.1", "test-agent"),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should return new tokens if refresh token is valid", async () => {
      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValue({ refreshToken: "hashedToken" } as RefreshTokensEntity);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
      jest
        .spyOn(service, "createToken")
        .mockReturnValueOnce("newAccessToken")
        .mockReturnValueOnce("newRefreshToken");
      jest.spyOn(service, "refreshTokenStore").mockResolvedValue(undefined);

      const result = await service.tokenReissue(1, "refreshToken", "127.0.0.1", "test-agent");

      expect(result).toEqual({
        accessToken: "newAccessToken",
        refreshToken: "newRefreshToken",
      });
    });
  });

  describe("findPw", () => {
    const findPwDto = { email: "test@example.com", name: "Test User", tempPassword: "temp123" };

    it("should throw NotFoundException if user does not exist", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(service.findPw(findPwDto)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if temp password is incorrect", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue({ id: 1 } as UsersEntity);
      jest.spyOn(service, "getTempPassword").mockResolvedValue("wrongTemp");

      await expect(service.findPw(findPwDto)).rejects.toThrow(NotFoundException);
    });

    it("should update password and return success message", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue({ id: 1 } as UsersEntity);
      jest.spyOn(service, "getTempPassword").mockResolvedValue("temp123");
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
      jest.spyOn(userRepository, "update").mockResolvedValue({} as any);
      jest.spyOn(redisClient, "del").mockResolvedValue(1);

      const result = await service.findPw(findPwDto);

      expect(result.status).toBe(200);
      expect(result.message).toBe("비밀번호가 임시 비밀번호로 변경되었습니다.");
      expect(result.data.password).toBe("temp123");
    });
  });

  describe("signOut", () => {
    it("should update refresh token to null", async () => {
      jest.spyOn(refreshTokenRepository, "update").mockResolvedValue({} as any);

      const result = await service.signOut(1);

      expect(result.message).toBe(MESSAGES.AUTH.SIGN_OUT.SUCCEED);
      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        { userId: 1 },
        { refreshToken: null },
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify access token", () => {
      const mockPayload = { userId: 1, type: "ACCESS" };
      jest.spyOn(jwt, "verify").mockReturnValue(mockPayload as any);

      const result = service.verifyToken("access_token");

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith("access_token", "mocked-value");
    });

    it("should verify refresh token", () => {
      const mockPayload = { userId: 1, type: "REFRESH" };
      jest.spyOn(jwt, "verify").mockReturnValue(mockPayload as any);

      const result = service.verifyToken("refresh_token");

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith("refresh_token", "mocked-value");
    });

    it("should throw an error if token verification fails", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => service.verifyToken("invalid_token")).toThrow("Invalid token");
    });
  });

  describe("createToken", () => {
    it("should create an access token", () => {
      jest.spyOn(jwt, "sign").mockReturnValue("access_token" as any);

      const result = service.createToken({ userId: 1 });

      expect(result).toBe("access_token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, type: "ACCESS" },
        "mocked-value",
        expect.any(Object),
      );
    });

    it("should create a refresh token", () => {
      jest.spyOn(jwt, "sign").mockReturnValue("refresh_token" as any);

      const result = service.createToken({ userId: 1 }, true);

      expect(result).toBe("refresh_token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1, type: "REFRESH" },
        "mocked-value",
        expect.any(Object),
      );
    });

    it("should throw an error if token creation fails", () => {
      jest.spyOn(jwt, "sign").mockImplementation(() => {
        throw new Error("Token creation failed");
      });

      expect(() => service.createToken({ userId: 1 })).toThrow(MESSAGES.AUTH.TOKEN.OCCURRED_ERROR);
    });
  });

  describe("refreshTokenStore", () => {
    it("should store hashed refresh token", async () => {
      jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedToken" as never);
      jest.spyOn(refreshTokenRepository, "upsert").mockResolvedValue({} as any);

      await service.refreshTokenStore(1, "refreshToken", "127.0.0.1", "test-agent");

      expect(bcrypt.hashSync).toHaveBeenCalledWith("refreshToken", AUTH_CONSTANT.HASH_SALT_ROUNDS);
      expect(refreshTokenRepository.upsert).toHaveBeenCalledWith(
        {
          userId: 1,
          refreshToken: "hashedToken",
          ip: "127.0.0.1",
          userAgent: "test-agent",
        },
        ["userId"],
      );
    });

    it("should throw an error if token storage fails", async () => {
      jest.spyOn(bcrypt, "hashSync").mockReturnValue("hashedToken" as never);
      jest.spyOn(refreshTokenRepository, "upsert").mockRejectedValue(new Error("Storage failed"));

      await expect(
        service.refreshTokenStore(1, "refreshToken", "127.0.0.1", "test-agent"),
      ).rejects.toThrow("Storage failed");
    });
  });
});
