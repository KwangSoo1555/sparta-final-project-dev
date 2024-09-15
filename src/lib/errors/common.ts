import { Err } from "./_generator";

export const CommonError = {
  CatchError: (error: { code: string; message: string; messageKo: string; originError?: Error }) =>
    Err(error),
  TransactionBroken: (error?: Error) =>
    Err({
      code: "E0001",
      message: "unhandled transaction broken",
      messageKo: "지정되지 않은 트랜잭션 오류가 발생했습니다",
      originError: error,
    }),

  InvalidAccess: () =>
    Err({
      code: "E0017",
      message: `invalid access`,
      messageKo: `잘못된 접근입니다`,
    }),
};
