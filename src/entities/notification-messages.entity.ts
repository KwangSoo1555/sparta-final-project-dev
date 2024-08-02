import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationLogsEntity } from "./notification-logs.entity";

@Entity("notification_messages")
export class NotificationMessagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  jobId: number;

  @Column({ nullable: true })
  noticeId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  //알림메시지 발송 기록(생성은 한 번, 발송은 여러 번)
  @OneToMany(() => NotificationLogsEntity, (notificationLog) => notificationLog.notificationMessage)
  @JoinColumn({ name: "notification_log" })
  notificaionLog: NotificationLogsEntity;
}
