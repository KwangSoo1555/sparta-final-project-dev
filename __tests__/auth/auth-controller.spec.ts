import { Test, TestingModule } from "@nestjs/testing";

import { AuthService } from "../../src/modules/auth/auth.service";
import { AuthController } from "../../src/modules/auth/auth.controller";

import { JwtAccessGuards, JwtRefreshGuards } from "../../src/modules/auth/strategies/jwt-strategy";
import { EmailVerificationDto } from "../../src/modules/auth/dto/email-verification.dto";
import { UserSignUpDto } from "../../src/modules/auth/dto/sign-up.dto";
import { LocalSignInDto } from "../../src/modules/auth/dto/sign-in.dto";

jest.mock("../../src/modules/auth/auth.service");

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should call AuthService.signUp with correct parameters", async () => {
      const signUpDto: UserSignUpDto = {
        email: "test@example.com",
        name: "test",
        password: "password",
        verificationCode: 123456,
      };
      const result = { id: 1, email: signUpDto.email };
      jest.spyOn(authService, "signUp").mockResolvedValue(result as any);

      expect(await controller.signUp(signUpDto)).toEqual(result);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe("signIn", () => {
    it("should call AuthService.signIn with correct parameters", async () => {
      const signInDto: LocalSignInDto = { email: "test@example.com", password: "password" };
      const result = { accessToken: "accessToken", refreshToken: "refreshToken", role: "user" };
      jest.spyOn(authService, "signIn").mockResolvedValue(result as any);

      expect(await controller.signIn("127.0.0.1", "test-agent", signInDto)).toEqual(result);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto, "127.0.0.1", "test-agent");
    });
  });

  describe("sendAuthEmail", () => {
    it("should call AuthService.sendAuthEmail with correct parameters", async () => {
      const emailVerificationDto: EmailVerificationDto = { email: "test@example.com" };
      const result = { status: 200, message: "이메일 인증 코드를 보냈습니다." };
      jest.spyOn(authService, "sendAuthEmail").mockResolvedValue(result as any);

      expect(await controller.sendAuthEmail(emailVerificationDto)).toEqual(result);
      expect(authService.sendAuthEmail).toHaveBeenCalledWith(emailVerificationDto);
    });
  });

  describe("tokenReissue", () => {
    it("should call AuthService.tokenReissue with correct parameters", async () => {
      const mockUser = { id: 1 };
      const mockRequest = { user: mockUser, token: "refreshToken" };
      const mockIp = "127.0.0.1";
      const mockUserAgent = "test-agent";
      const result = { accessToken: "accessToken", refreshToken: "refreshToken" };
      jest.spyOn(authService, "tokenReissue").mockResolvedValue(result as any);

      expect(await controller.tokenReissue(mockRequest as any, mockIp, mockUserAgent)).toEqual(
        result,
      );
      expect(authService.tokenReissue).toHaveBeenCalledWith(
        mockRequest.user,
        mockRequest.token,
        mockIp,
        mockUserAgent,
      );
    });
  });

  describe("signOut", () => {
    it("should call AuthService.signOut with correct parameters", async () => {
      const mockUser = { id: 1 };
      const mockRequest = { user: mockUser, token: "refreshToken" };
      const result = { status: 200, message: "로그아웃 되었습니다." };
      jest.spyOn(authService, "signOut" as keyof AuthService).mockResolvedValue(result as any);

      expect(await controller.signOut(mockRequest as any)).toEqual(result);
      expect(authService.signOut).toHaveBeenCalledWith(mockRequest.user, mockRequest.token);
    });
  });
});
