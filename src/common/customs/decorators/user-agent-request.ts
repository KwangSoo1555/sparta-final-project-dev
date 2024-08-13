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
