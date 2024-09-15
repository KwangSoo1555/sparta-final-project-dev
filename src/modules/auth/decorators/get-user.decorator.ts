// GQL http 프로토콜에서 JWT 로 요청한 유저 정보와 토큰을 가져오는 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtPayload } from "../types/jwt.type";

import { AuthError } from "src/lib/errors";
import { isTruthy } from "src/lib/utils";

export const ReqJwtByHttp = createParamDecorator((_data, context: ExecutionContext): JwtPayload => {
  const jwtPayload = GqlExecutionContext.create(context).getContext().req.user as JwtPayload;
  if (!isTruthy(jwtPayload?.user?.id)) {
    throw AuthError.InvalidToken();
  }
  return jwtPayload;
});
