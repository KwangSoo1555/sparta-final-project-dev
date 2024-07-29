export class JwtPayload {
  type: "ACCESS" | "REFRESH";
  userId: number;
}
