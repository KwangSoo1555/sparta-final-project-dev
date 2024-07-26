export const MESSAGES = {
    AUTH: {
      COMMON: {
        CURRENT_PASSWORD: {
          REQURIED: "현재 비밀번호를 입력해 주세요.",
          NOT_MACHTED_WITH_PASSWORD: "현재 비밀번호와 기존 비밀번호가 일치하지 않습니다.",
        },
        NEW_PASSWORD: {
          REQURIED: "새로운 비밀번호를 입력해 주세요.",
          NEW_PASSWORD_EQUAL_CURRENT_PASSWORD: "현재 비밀번호와 새로운 비밀번호는 같을 수 없습니다.",
        },
        UNAUTHORIZED: "인증 정보가 유효하지 않습니다.",
        JWT: {
          NO_TOKEN: "인증 정보가 없습니다.",
          NOT_SUPPORTED_TYPE: "지원하지 않는 인증 방식입니다.",
          EXPIRED: "인증 정보가 만료되었습니다.",
          NO_USER: "인증 정보와 일치하는 사용자가 없습니다.",
          INVALID: "인증 정보가 유효하지 않습니다.",
        },
      },
      SIGN_UP: {
        EMAIL: {
          DUPLICATED: "이메일이 이미 존재합니다.",
          FAIL: "메일 전송에 실패했습니다.",
          SUCCEED: "메일 전송에 성공했습니다.",
          VERIFICATION_CODE: {
            INCONSISTENT: "발송된 인증 코드와 다릅니다.",
            EXPIRED: "메일 인증이 만료되었습니다.",
            SUCCEED: "메일 인증이 완료되었습니다.",
          },
        },
        SUCCEED: "회원가입에 성공했습니다.",
      },
      LOG_IN: {
        LOCAL: {
          EMAIL: {
            NOT_FOUND: "이메일이 존재하지 않습니다.",
          },
          PASSWORD: {
            INCONSISTENT: "비밀번호가 일치하지 않습니다.",
          },
          SUCCEED: "로그인에 성공했습니다.",
        },
        GOOGLE: {
          EMAIL: {
            NOT_FOUND: "이메일이 존재하지 않습니다.",
          },
          SUCCEED: "구글 로그인에 성공했습니다.",
          FAIL: "구글 로그인에 실패했습니다.",
        },
        NAVER: {
          EMAIL: {
            NOT_FOUND: "이메일이 존재하지 않습니다.",
          },
          SUCCEED: "네이버 로그인에 성공했습니다.",
          FAIL: "네이버 로그인에 실패했습니다.",
        },
        KAKAO: {
          EMAIL: {
            NOT_FOUND: "이메일이 존재하지 않습니다.",
          },
          SUCCEED: "카카오 로그인에 성공했습니다.",
          FAIL: "카카오 로그인에 실패했습니다.",
        },
      },
      SIGN_OUT: {
        SUCCEED: "로그 아웃에 성공했습니다.",
      },
      REISSUE_TOKEN: {
        SUCCEED: "토큰 재발급에 성공했습니다.",
      },
    },
    USERS: {
      READ_ME: {
        SUCCEED: "내 정보 조회에 성공했습니다.",
      },
      UPDATE_ME: {
        EMAIL: {
          DUPLICATED: "이메일이 이미 존재합니다.",
        },
        PASSWORD: {
          CURRENT_PASSWORD_REQUIRED: "현재 비밀번호를 입력해 주세요.",
          CURRENT_PASSWORD_INCONSISTENT: "현재 비밀번호가 일치하지 않습니다.",
          NEW_PASSWORD_NOT_EQUAL_CURRENT_PASSWORD:
            "현재 비밀번호와 새로운 비밀번호는 같을 수 없습니다.",
        },
        SUCCEED: "내 정보 수정에 성공했습니다.",
      },
      COMMON: {
        NOT_FOUND: "유저가 존재하지 않습니다.",
      },
      POINT: {
        NOT_ENOUGH_POINT: "포인트가 충분하지 않습니다.",
      },
    },
    FILES: {
      CREATE: {
        UPLOAD_SUCCEED: "파일이 성공적으로 업로드되었습니다.",
      },
      DELETE: {
        DELETE_SUCCEED: "파일이 성공적으로 삭제되었습니다.",
      },
      NOT_EXISTS: "해당 카드에서 파일을 찾을 수 없습니다.",
    },
    CARD: {
      NOT_CARD: {
        CARD_NOT_FOUND: "존재하지 않는 카드입니다.",
      },
      LIST: {
        NOT_EXISTS: "해당 리스트가 존재하지 안습니다.",
      },
      CREATE_SUCCEED: "카드가 성공적으로 생성되었습니다.",
      DELETE_SUCCEED: "카드가 성공적으로 삭제되었습니다.",
      NOT_EXISTS: "존재하지 않는 카드입니다.",
    },
    CARDCOMMENT: {
      UPDATE_CONTENT_SUCCED: "댓글이 성공적으로 수정되었습니다.",
      DELETE_SUCCEED: "댓글을 성공적으로 삭제하였습니다.",
      UPDATE_DATE_SUCCEED: "카드에 날짜 수정되었습니다.",
      CREATE_CHECKLIST: "체크리스트가 추가되었습니다.",
      UPDATE_CHECKLIST: "체크리스트 변경사항되었습니다.",
      NOT_EXISTS_CHECKLIST: "없는 체크리스트입니다.",
      NOT_EXISTS: "해당 댓글을 찾을 수 없습니다.",
      NOT_AUTHORITY_UPDATE: "댓글을 수정할 권한이 없습니다.",
      NOT_AUTHORITY_DELETE: "댓글을 삭제할 권한이 없습니다.",
  
      CARD: {
        NOT_EXISTS: "없는 카드입니다.",
      },
    },
    BOARD: {
      CREATE_SUCCEED: "새로운 board가 생성되었습니다",
      UPDATE_SUCCEED: "해당 board가 수정되었습니다",
      DELETE_SUCCEED: "해당 보드가 삭제되었습니다",
      MAKE_INVITECODE: "초대링크가 생성되었습니다!",
      INVALID_ACCESSED: "유효하지 않은 접근입니다.",
    },
    LIST: {
      CREATE_SUCCEED: "리스트가 생성되었습니다.",
      DELETE_SUCCEED: "해당 리스트가 삭제되었습니다.",
      NOT_EXISTS: "해당 리스트가 존재하지 않습니다.",
    },
    MEMBER: {
      NOT_AUTHORIZATION:"권한이 없습니다.",
      GREATER_THEN_OR_EQUAL:"해당 유저는 당신과 동등하거나 더 높은 권한을 가지고 있습니다.",
      NOT_EXISTS_IN_BOARD:"해당 보드에 속한 유저가 아닙니다.",
      DELETE_SUCCEED:"해당유저가 성공적으로 강퇴되었습니다.",
      ALEADY_EXISTS:"이미 존재하는 멤버입니다!"
    },
    EVENTS: {
      ALERT_VIEW_SUCCED:"알림 조회에 성공했습니다.",
      UPDATE_CONTENT_SUCCED:'내용이 변경되었습니다.',
      UPDATE_BACKGROUNDCOLOR_SUCCED:'배경색이 변경되었습니다.',
      UPDATE_CARDMEMBER:'멤버가 변경되었습니다.',
      INIT_SOCKET_IO_SERVER:"Socket.IO 서버가 초기화되었습니다.",
      CONNECT_TO_CLIENT:`클라이언트가 연결되었습니다:`,
      INCONNECT_TO_CLIENT:`클라이언트가 연결이 해제되었습니다:`,
    },
    JOBS: {
      CREATE: {
        CREATE_SUCCEED: "성공적으로 생성되었습니다.",
      },
      READ: {
        READ_SUCCEED: "성공적으로 조회되었습니다.",
        NOT_VERIFY: "조회 권한이 없습니다."
      },
      UPDATE: {
        UPDATE_SUCCEED: "성공적으로 수정되었습니다.",
        NOT_VERIFY: "수정 권한이 없습니다.",
      },
      DELETE: {
        DELETE_SUCCEED: "성공적으로 삭제되었습니다.",
        NOT_VERIFY: "삭제 권한이 없습니다."
      },
      MATCHING: {
        MATCHING_SUCCEED: "성공적으로 매칭되었습니다.",
        NOT_VERIFY: "매칭 권한이 없습니다."
      },
      CANCEL: {
        CANCEL_SUCCEED: "성공적으로 취소되었습니다.",
        NOT_VERIFY: "취소 권한이 없습니다."
      },
      NOT_EXISTS: "존재하지 않는 내용입니다.",
    },
    JOBMATCH: {
      CREATE: {
        CREATE_SUCCEED: "성공적으로 신청되었습니다.",
      },
      READ: {
        READ_SUCCEED: "성공적으로 조회되었습니다.",
        NOT_VERIFY: "조회 권한이 없습니다."
      },
      DELETE: {
        DELETE_SUCCEED: "성공적으로 삭제되었습니다.",
        NOT_VERIFY: "삭제 권한이 없습니다."
      },
      MATCHING: {
        MATCHING_SUCCEED: "성공적으로 매칭되었습니다.",
        NOT_VERIFY: "매칭 권한이 없습니다."
      },
      REJECT: {
        REJECT_SUCCEED: "성공적으로 거정되었습니다.",
        NOT_VERIFY: "거절 권한이 없습니다."
      },
      NOT_EXISTS: "존재하지 않는 내용입니다.",
    },
  };
  