import { Err } from "./_generator";

export const AuthError = {
  UserNotExistsById: (id: number) =>
    Err({
      code: "A0001",
      message: `user not exists by ${id}`,
      messageKo: "사용자가 존재하지 않습니다",
    }),
  UserNotExistsByEmail: (email: string) =>
    Err({
      code: "A0002",
      message: `user not exists by ${email}`,
      messageKo: "사용자가 존재하지 않습니다",
    }),
  InvalidPassword: () =>
    Err({
      code: "A0003",
      message: "invalid password",
      messageKo: "패스워드를 다시 확인하세요",
    }),
  InvalidUserRole: () =>
    Err({
      code: "A0004",
      message: "invalid user role",
      messageKo: "권한이 없습니다",
    }),
  UserEmailAlreadyExists: (email: string) =>
    Err({
      code: "A0005",
      message: `user already exists by ${email}`,
      messageKo: "이미 존재하는 사용자입니다",
    }),
  EmptyToken: () =>
    Err({
      code: "A0006",
      message: "provide token in your request header",
      messageKo: "요청 토큰이 누락되었습니다",
    }),
  InvalidToken: () =>
    Err({
      code: "A0007",
      message: "invalid token",
      messageKo: "요청 토큰이 유효하지 않습니다",
    }),
  UserAlreadyDeleted: (email: string) =>
    Err({
      code: "A0008",
      message: `user has been deleted: ${email}`,
      messageKo: "삭제된 계정입니다",
    }),
  CannotSaveUser: (error: Error) =>
    Err({
      code: "A0009",
      message: "cannot save user",
      messageKo: "사용자 생성 중 문제가 발생했습니다",
      originError: error,
    }),
  InvalidUserModifyInput: () =>
    Err({
      code: "A0010",
      message: "invalid user modify input",
      messageKo: "사용자 정보 수정 입력값이 올바르지 않습니다.",
    }),
};
