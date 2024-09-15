<<<<<<< HEAD
// user ip 추출 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  return ip;
});
=======
// user ip 추출 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  return ip;
});
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
