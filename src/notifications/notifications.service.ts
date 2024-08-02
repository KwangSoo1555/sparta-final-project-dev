import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateNotificationDto } from "./notifications.dto/create-notificaion.dto";
import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { UsersEntity } from "src/entities/users.entity";
import { ChatsEntity } from "src/entities/chats.entity";
import { NoticesEntity } from "src/entities/notices.entity";

import { Repository } from "typeorm";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationMessagesEntity)
    private readonly notificationMessagesRepository: Repository<NotificationMessagesEntity>,

    @InjectRepository(NotificationLogsEntity)
    private readonly notificationLogsRepository: Repository<NotificationLogsEntity>,

    @InjectRepository(ChatsEntity)
    private readonly chatsRepository: Repository<ChatsEntity>,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,

    @InjectRepository(NoticesEntity)
    private readonly noticesRepository: Repository<NoticesEntity>,
  ) {}

  //푸시알림 생성 메서드
  async createNotificationMessage(createNotificationDto: CreateNotificationDto) {
    const {
      title,
      data: { type, jobId, noticeId },
      userIds,
    } = createNotificationDto;

    try {
      //알림메시지 생성
      const notificationMessage = await this.notificationMessagesRepository.save({
        title: title,
        data: JSON.stringify({ type, jobId, noticeId }),
      });

      //알림메시지 로그 생성(보낸 알림메시지의 모든 기록)
      const notificationLogs = await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.usersRepository.findOneBy({ id: userId });
          //만약 유저를 찾지 못했다면 null 반환 = 알림메시지 발송X
          if (!user) {
            return null;
          }

          //알림메시지 로그를 생성
          const notificationLog = this.notificationLogsRepository.create({
            user,
            notificationMessage,
          });
          //생성한 알림메시지 로그를 저장
          await this.notificationLogsRepository.save(notificationLog);
        }),
      );
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }
}
