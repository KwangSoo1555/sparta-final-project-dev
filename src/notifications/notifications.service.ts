import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

// import { CreateNotificationDto } from "./notifications.dto/create-notificaion.dto";
import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { UsersEntity } from "src/entities/users.entity";
// import { ChatsEntity } from "src/entities/chats.entity";
// import { NoticesEntity } from "src/entities/notices.entity";

import { NotificationGateway } from "src/notifications/notification.gateway";

import { Repository } from "typeorm";
import { NotificationTypes } from "src/common/customs/enums/enum-notifications";
import { JobsEntity } from "src/entities/jobs.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationMessagesEntity)
    private readonly notificationMessagesRepository: Repository<NotificationMessagesEntity>,

    @InjectRepository(NotificationLogsEntity)
    private readonly notificationLogsRepository: Repository<NotificationLogsEntity>,

    // @InjectRepository(ChatsEntity)
    // private readonly chatsRepository: Repository<ChatsEntity>,

    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,

    // @InjectRepository(NoticesEntity)
    // private readonly noticesRepository: Repository<NoticesEntity>,

    private notificationGateway: NotificationGateway,
  ) {}

  //지원자 발생 시 푸시알림 생성 메서드
  async createApplyNotificationMessage(jobsId: number, customerId: number, ownerId: number) {
    try {
      //알림메시지 생성
      const notificationMessage = await this.notificationMessagesRepository.save({
        title: "등록한 잡일에 지원자가 있습니다.",
        data: JSON.stringify({ type: NotificationTypes.JOB_APPLIED, jobsId, customerId }),
      });

      //알림메시지 로그를 생성
      const notificationLog = this.notificationLogsRepository.create({
        user: await this.usersRepository.findOneBy({ id: ownerId }),
        notificationMessage,
      });
      //생성한 알림메시지 로그를 저장
      await this.notificationLogsRepository.save(notificationLog);

      //알림 발송
      await this.notificationGateway.sendNotification(
        [ownerId], //일감 owner에게 알림 발송
        { type: NotificationTypes.JOB_APPLIED, jobsId, customerId }, //유저의 id를 제외한 나머지 데이터를 처리
      );
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }
}
