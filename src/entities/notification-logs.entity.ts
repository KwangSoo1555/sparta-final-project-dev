import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { NotificationMessagesEntity } from "./notification-messages.entity";

@Entity("notificaion_logs")
export class NotificationLogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(
    () => NotificationMessagesEntity,
    (NotificationMessage) => NotificationMessage.notificaionLog,
  )
  @JoinColumn({ name: "notification_message_id" })
  notificationMessage: NotificationMessagesEntity;

  //알림을 받을 유저 저장, 한 유저가 여러 알림을 받을 수 있으니 MTO관계
  @ManyToOne(() => UsersEntity, (user) => user.notificationLogs)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
