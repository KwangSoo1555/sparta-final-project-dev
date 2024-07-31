import { NotificationTypes } from "src/common/customs/enums/enum-job-notifications";

export class CreateNotificationDto {
  //푸시알림의 제목
  title: string;
  //푸시알림 내용
  data: {
    type: NotificationTypes;
    jobId?: number;
    noticeId?: number;
  };
  //알림받을 사용자 목록(알림받기 '허용' 상태인 유저 중 조건에 맞는 유저)
  userIds: number[];
}
