// socket 프로토콜에서 JWT 로 요청한 유저 정보와 토큰을 가져오는 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestJwtBySocket = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToWs().getClient();
  const { handshake } = request;
  const user = handshake.user;
  const authorization = handshake.headers["authorization"];
  const token = authorization ? authorization.replace("Bearer ", "") : null;
  return { user, token };
});
