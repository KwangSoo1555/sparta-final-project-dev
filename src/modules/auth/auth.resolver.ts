import { Args, Resolver, Mutation, Query } from "@nestjs/graphql";
import { Ip, Headers } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { UserCreateInput, UserSignInInput, UserWithToken, JwtPayload } from "./types";
import { ContextResponse, ReqJwtByHttp } from "./decorators";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserWithToken, { description: "로그인" })
  async signIn(
    @ContextResponse() response: any,
    @Args("user", { description: "로그인" })
    user: UserSignInInput,
    @Ip() ip: string,
    @Headers("User-Agent") userAgent: string,
  ): Promise<UserWithToken> {
    const userWithToken = await this.authService.signIn(user, ip, userAgent);
    const { accessToken } = userWithToken;

    response.cookie("x-token", accessToken, { httpOnly: true });

    return userWithToken;
  }

  @Mutation(() => Boolean, { description: "로그아웃 & 토큰 제거" })
  async signOut(
    @ReqJwtByHttp() requester: JwtPayload,
    @ContextResponse() response: any,
  ): Promise<boolean> {
    response.clearCookie("x-token");
    return true;
  }

  @Mutation(() => String, { name: "createUser", description: "사용자 생성" })
  async signUp(
    @Args("user", { description: "사용자 생성" })
    user: UserCreateInput,
  ): Promise<string> {
    return this.authService.signUp(user);
  }
}
