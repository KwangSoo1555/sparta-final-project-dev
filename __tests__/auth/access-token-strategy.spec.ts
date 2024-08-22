import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  AccessTokenWsStrategy,
} from "../../src/modules/auth/strategies/jwt-strategy";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../../src/modules/auth/auth.service";

import { MESSAGES } from "../../src/common/constants/message.constant";
import {
  JwtAccessGuards,
  JwtRefreshGuards,
  JwtSocketGuards,
} from "../../src/modules/auth/strategies/jwt-strategy";

jest.mock("@nestjs/passport", () => ({
  ...jest.requireActual("@nestjs/passport"),
  AuthGuard: jest.fn(() => ({
    canActivate: jest.fn().mockImplementation((context) => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 1 }; // 모의 사용자 데이터
      return true;
    }),
  })),
}));

// AccessTokenStrategy 테스트
describe("AccessTokenStrategy", () => {
  let strategyAccessToken: AccessTokenStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenStrategy,
        {
          provide: AuthService,
          useValue: {
            checkUserForAuth: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("mock-access-token-secret"),
          },
        },
      ],
    }).compile();

    strategyAccessToken = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(strategyAccessToken).toBeDefined();
  });

  it("should validate and return user if payload is valid", async () => {
    const payload = { userId: 1 };
    const mockUser = { id: 1, email: "test@example.com" };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(mockUser as any);

    const result = await strategyAccessToken.validate(payload);

    expect(result).toEqual(mockUser);
  });

  it("should throw UnauthorizedException if user is not found", async () => {
    const payload = { userId: 1 };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(null);

    await expect(strategyAccessToken.validate(payload)).rejects.toThrow(
      new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID),
    );
  });
});

// RefreshTokenStrategy 테스트
describe("RefreshTokenStrategy", () => {
  let strategyRefreshToken: RefreshTokenStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        {
          provide: AuthService,
          useValue: {
            checkUserForAuth: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("mock-refresh-token-secret"),
          },
        },
      ],
    }).compile();

    strategyRefreshToken = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(strategyRefreshToken).toBeDefined();
  });

  it("should validate and return user if payload is valid", async () => {
    const payload = { userId: 1 };
    const mockUser = { id: 1, email: "test@example.com" };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(mockUser as any);

    const result = await strategyRefreshToken.validate(payload);

    expect(result).toEqual(mockUser);
  });

  it("should throw UnauthorizedException if user is not found", async () => {
    const payload = { userId: 1 };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(null);

    await expect(strategyRefreshToken.validate(payload)).rejects.toThrow(
      new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID),
    );
  });
});

// AccessTokenWsStrategy 테스트
describe("AccessTokenWsStrategy", () => {
  let strategy: AccessTokenWsStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenWsStrategy,
        {
          provide: AuthService,
          useValue: {
            checkUserForAuth: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("mock-access-token-secret"),
          },
        },
      ],
    }).compile();

    strategy = module.get<AccessTokenWsStrategy>(AccessTokenWsStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should validate and return user if payload is valid", async () => {
    const payload = { userId: 1 };
    const mockUser = { id: 1, email: "test@example.com" };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(mockUser as any);

    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
  });

  it("should throw UnauthorizedException if user is not found", async () => {
    const payload = { userId: 1 };
    jest.spyOn(authService, "checkUserForAuth").mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toThrow(
      new UnauthorizedException(MESSAGES.AUTH.COMMON.JWT.INVALID),
    );
  });
});

// JwtGuards 테스트
describe("JwtGuards", () => {
  let accessGuard: JwtAccessGuards;
  let refreshGuard: JwtRefreshGuards;
  let socketGuard: JwtSocketGuards;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAccessGuards,
        JwtRefreshGuards,
        JwtSocketGuards,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    accessGuard = module.get<JwtAccessGuards>(JwtAccessGuards);
    refreshGuard = module.get<JwtRefreshGuards>(JwtRefreshGuards);
    socketGuard = module.get<JwtSocketGuards>(JwtSocketGuards);
  });

  it("JwtAccessGuards should be defined", () => {
    expect(accessGuard).toBeDefined();
  });

  it("JwtRefreshGuards should be defined", () => {
    expect(refreshGuard).toBeDefined();
  });

  it("JwtSocketGuards should be defined", () => {
    expect(socketGuard).toBeDefined();
  });

  it("should return true for canActivate method in JwtAccessGuards", () => {
    const context = {} as ExecutionContext;
    expect(accessGuard.canActivate(context)).toBe(true);
  });

  it("should return true for canActivate method in JwtRefreshGuards", () => {
    const context = {} as ExecutionContext;
    expect(refreshGuard.canActivate(context)).toBe(true);
  });

  it("should return true for canActivate method in JwtSocketGuards", () => {
    const context = {} as ExecutionContext;
    expect(socketGuard.canActivate(context)).toBe(true);
  });
});
