// socket 프로토콜에서 JWT 로 요청한 유저 정보와 토큰을 가져오는 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Socket } from "socket.io";

export const RequestJwtBySocket = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  // console.log(ctx);
  const request = ctx.switchToWs().getClient();
  // const client: Socket = ctx.switchToWs().getClient();
  // console.log
  // return client.data.user; // 소켓에 저장된 사용자 정보 반환
  console.log(request.data.user);
  // console.log(1);
  // console.log(request);
  const { handshake } = request;
  const authorization = handshake.headers?.authorization; // Optional chaining 사용

  if (!authorization) {
    throw new Error("Authorization header not found");
  }

  const token = authorization.replace("Bearer ", "");
  return { token };
});
