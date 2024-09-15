import { registerEnumType } from "@nestjs/graphql";

export enum JwtCategory {
  Access = "ACCESS",
  Refresh = "REFRESH",
}

registerEnumType(JwtCategory, {
  name: "JwtType",
  description: "Jwt 타입",
});
