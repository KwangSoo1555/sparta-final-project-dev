import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationLogsEntity } from "./notification-logs.entity";
import { UsersEntity } from "./users.entity";

@Entity("notification_messages")
export class NotificationMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  jobsId: number;

  @Column()
  receiverId: number;

  @Column()
  senderId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  //알림메시지 발송 기록(생성은 한 번, 발송은 여러 번 되는 경우 있음)
  @OneToMany(() => NotificationLogsEntity, (notificationLog) => notificationLog.notificationMessage)
  @JoinColumn({ name: "notification_log" })
  notificaionLog: NotificationLogsEntity;

  //알림메시지 발송받을 유저는 한 번 참조(OtM), 유저는 알림메시지 여러번 수취(MtO)
  @OneToMany(() => UsersEntity, (users) => users.notificationMessage)
  @JoinColumn({ name: "users" })
  users: UsersEntity;
}
