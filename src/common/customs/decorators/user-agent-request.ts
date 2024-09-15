<<<<<<< HEAD
// user agent 추출 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestUserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userAgent =
    request.headers["user-agent"] ||
    request.rawHeaders.find(
      (header, index) => header.toLowerCase() === "user-agent" && request.rawHeaders[index + 1],
    );
  return userAgent;
});
=======
// user agent 추출 데코레이터

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestUserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userAgent =
    request.headers["user-agent"] ||
    request.rawHeaders.find(
      (header, index) => header.toLowerCase() === "user-agent" && request.rawHeaders[index + 1],
    );
  return userAgent;
});
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
