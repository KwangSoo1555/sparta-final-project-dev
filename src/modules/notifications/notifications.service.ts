import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";

import { NotificationMessagesEntity } from "src/entities/notification-messages.entity";
import { NotificationLogsEntity } from "src/entities/notification-logs.entity";
import { UsersEntity } from "src/entities/users.entity";

import { NotificationGateway } from "src/modules/notifications/notification.gateway";

import { Repository } from "typeorm";
import { NotificationTypes } from "src/common/customs/enums/enum-notifications";
import { JobsEntity } from "src/entities/jobs.entity";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { RedisPubsubService } from "src/database/redis/redis-pubsub.service";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationMessagesEntity)
    private readonly notificationMessagesRepository: Repository<NotificationMessagesEntity>,

    @InjectRepository(NotificationLogsEntity)
    private readonly notificationLogsRepository: Repository<NotificationLogsEntity>,

    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,

    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,

    private notificationGateway: NotificationGateway,

    @Inject("REDIS_SUBSCRIBER_CLIENT")
    private readonly redisClient: Redis,

    @Inject("REDIS_PUB_SUB_TOKEN")
    private readonly pubSub: RedisPubSub,

    private readonly redisPubSubService: RedisPubsubService,
  ) {
    this.pubSub.subscribe("chatMessageCreated", async (message) => {
      console.log("channel name : chatMessageCreated, ", "message : ", message);
      const { chatRoomId, receiverId, senderId } = JSON.parse(message);
      await this.createChatMessageReceiveNotification(chatRoomId, receiverId, senderId);
    });

    this.pubSub.subscribe("jobMatching", async (message) => {
      console.log("channel name : jobMatching, ", "message : ", message);
      const { type, jobsId, ownerId, customerId } = message;
      if (type === NotificationTypes.JOB_APPLIED) {
        await this.createApplyNotificationMessage(jobsId, customerId, ownerId);
      } else if (type === NotificationTypes.JOB_MATCHED) {
        await this.createMatchedNotificationMessage(jobsId, customerId, ownerId);
      } else if (type === NotificationTypes.JOB_DENIED) {
        await this.createDeniedNotificationMessage(jobsId, customerId, ownerId);
      }
    });
  }

  //지원자 발생 시 푸시알림 생성 메서드
  async createApplyNotificationMessage(jobsId: number, customerId: number, ownerId: number) {
    try {
      const senderId = customerId;
      const receiverId = ownerId;
      //알림메시지 생성

      const notificationMessage = await this.notificationMessagesRepository.save({
        title: "job matching applied",
        type: NotificationTypes.JOB_APPLIED,
        jobsId,
        senderId,
        receiverId,
      });

      console.log(notificationMessage);

      //알림메시지 로그를 생성
      const notificationLog = this.notificationLogsRepository.create({
        user: await this.usersRepository.findOneBy({ id: receiverId }),
        notificationMessage,
      });
      //생성한 알림메시지 로그를 저장
      await this.notificationLogsRepository.save(notificationLog);

      //알림 발송
      this.redisPubSubService.publish(`userNotifications_${receiverId}`, {
        userId: receiverId,
        notificationMessage,
      });
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }

  //매치 수락
  async createMatchedNotificationMessage(jobsId: number, customerId: number, ownerId: number) {
    try {
      const senderId = ownerId;
      const receiverId = customerId;

      //알림메시지 생성
      const notificationMessage = await this.notificationMessagesRepository.save({
        title: "지원한 잡일이 수락되었습니다.",
        type: NotificationTypes.JOB_MATCHED,
        jobsId,
        senderId,
        receiverId,
      });

      //알림메시지 로그를 생성
      const notificationLog = this.notificationLogsRepository.create({
        user: await this.usersRepository.findOneBy({ id: receiverId }),
        notificationMessage,
      });
      //생성한 알림메시지 로그를 저장
      await this.notificationLogsRepository.save(notificationLog);

      //알림 발송
      this.redisPubSubService.publish(`userNotifications_${receiverId}`, {
        userId: receiverId,
        notificationMessage,
      });
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }

  //매치 거절
  async createDeniedNotificationMessage(jobsId: number, customerId: number, ownerId: number) {
    try {
      const senderId = ownerId;
      const receiverId = customerId;

      //알림메시지 생성
      const notificationMessage = await this.notificationMessagesRepository.save({
        title: "지원한 잡일이 거절되었습니다.",
        type: NotificationTypes.JOB_DENIED,
        jobsId,
        senderId,
        receiverId,
      });

      //알림메시지 로그를 생성
      const notificationLog = this.notificationLogsRepository.create({
        user: await this.usersRepository.findOneBy({ id: receiverId }),
        notificationMessage,
      });
      //생성한 알림메시지 로그를 저장
      await this.notificationLogsRepository.save(notificationLog);

      //알림 발송
      this.redisPubSubService.publish(`userNotifications_${receiverId}`, {
        userId: receiverId,
        notificationMessage,
      });
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }

  //채팅 알림
  async createChatMessageReceiveNotification(
    chatRoomId: number,
    receiverId: number,
    senderId: number,
  ) {
    try {
      //알림메시지 생성
      const sender = await this.usersRepository.findOneBy({ id: senderId });
      const notificationMessage = await this.notificationMessagesRepository.save({
        title: `${sender.name}유저로부터 새로운 채팅이 도착했습니다.`,
        type: NotificationTypes.NEW_CHAT,
        chatRoomId,
        senderId,
        receiverId,
      });

      console.log(notificationMessage);

      //알림메시지 로그를 생성
      const notificationLog = this.notificationLogsRepository.create({
        user: await this.usersRepository.findOneBy({ id: receiverId }),
        notificationMessage,
      });
      //생성한 알림메시지 로그를 저장
      await this.notificationLogsRepository.save(notificationLog);

      //알림 발송
      this.redisPubSubService.publish(`userNotifications_${receiverId}`, {
        userId: receiverId,
        notificationMessage,
      });
    } catch (error) {
      throw new Error("알림메시지 생성 실패");
    }
  }

  //알림 목록 조회
  async findAllNotifications(receiverId: number) {
    //notificationLog와 notificationMessage relation으로 logData 생성
    const logData = await this.notificationLogsRepository.find({
      relations: ["notificationMessage"],
      select: {
        id: true,
        createdAt: true,
        notificationMessage: {
          id: true,
          type: true,
          title: true,
          jobsId: true,
          chatRoomId: true,
          senderId: true,
        },
      },
      where: { user: { id: receiverId } },
      order: { createdAt: "DESC" },
    });

    const notificationData = await Promise.all(
      logData.map(async (log) => {
        const sender = await this.usersRepository.findOneBy({
          id: log.notificationMessage.senderId,
        });
        return {
          id: log.id,
          title: log.notificationMessage.title,
          jobsId: log.notificationMessage.jobsId,
          chatRoomId: log.notificationMessage.chatRoomId,
          type: log.notificationMessage.type,
          createdAt: log.createdAt,
          notificationMessageId: log.notificationMessage.id,
          senderName: sender ? sender.name : null,
        };
      }),
    );

    return notificationData;
  }

  //알림 전체 삭제
  async deleteAllNotifications(receiverId: number) {
    await this.notificationLogsRepository.delete({ user: { id: receiverId } });
  }

  //알림 하나 삭제
  async deleteSpecificNotifications(receiverId: number, notificationLogId: number) {
    const notificationLog = await this.notificationLogsRepository.findOne({
      where: {
        id: notificationLogId,
        user: { id: receiverId },
      },
    });

    if (!notificationLog) {
      throw new NotFoundException("알림이 존재하지 않습니다.");
    }

    await this.notificationLogsRepository.delete(notificationLogId);
  }
}
