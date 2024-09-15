// user ip 추출 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  return ip;
});
