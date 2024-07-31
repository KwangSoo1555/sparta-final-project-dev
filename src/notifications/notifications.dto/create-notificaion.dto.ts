import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";

export class CreateNotificationDto {
  title: string;
  data: {
    type: string;
    jobId?: number;
    noticeId?: number;
  };
}
