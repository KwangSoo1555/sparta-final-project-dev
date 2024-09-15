import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationMessagesEntity } from 'src/entities/notification-messages.entity';
import { NotificationLogsEntity } from 'src/entities/notification-logs.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { JobsEntity } from 'src/entities/jobs.entity';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RedisPubsubService } from 'src/database/redis/redis-pubsub.service';
import { ChatGateway } from 'src/modules/chat-gateway/chat.gateway';
import { Repository } from 'typeorm';
import { NotificationTypes } from 'src/common/customs/enums/enum-notifications';

describe('NotificationsService', () => {
    let service: NotificationsService;
    let notificationMessagesRepository: Repository<NotificationMessagesEntity>;
    let notificationLogsRepository: Repository<NotificationLogsEntity>;
    let usersRepository: Repository<UsersEntity>;
    let jobsRepository: Repository<JobsEntity>;
    let redisClient: Redis;
    let pubSub: RedisPubSub;
    let redisPubSubService: RedisPubsubService;
    let chatGateway: ChatGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                {
                    provide: getRepositoryToken(NotificationMessagesEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(NotificationLogsEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(UsersEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(JobsEntity),
                    useClass: Repository,
                },
                {
                    provide: 'REDIS_SUBSCRIBER_CLIENT',
                    useValue: new Redis(),
                },
                {
                    provide: 'REDIS_PUB_SUB_TOKEN',
                    useValue: new RedisPubSub(),
                },
                RedisPubsubService,
                ChatGateway,
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
        notificationMessagesRepository = module.get<Repository<NotificationMessagesEntity>>(getRepositoryToken(NotificationMessagesEntity));
        notificationLogsRepository = module.get<Repository<NotificationLogsEntity>>(getRepositoryToken(NotificationLogsEntity));
        usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
        jobsRepository = module.get<Repository<JobsEntity>>(getRepositoryToken(JobsEntity));
        redisClient = module.get<Redis>('REDIS_SUBSCRIBER_CLIENT');
        pubSub = module.get<RedisPubSub>('REDIS_PUB_SUB_TOKEN');
        redisPubSubService = module.get<RedisPubsubService>(RedisPubsubService);
        chatGateway = module.get<ChatGateway>(ChatGateway);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createApplyNotificationMessage', () => {
        it('should create a notification message and log', async () => {
            const jobsId = 1;
            const customerId = 2;
            const ownerId = 3;

            const mockNotificationMessage = {
                id: 1,
                title: '등록한 잡일에 지원자가 있습니다.',
                type: NotificationTypes.JOB_APPLIED, jobsId,
                senderId: customerId,
                receiverId: ownerId,
            };

            const mockUser = { id: ownerId, name: 'Owner' };

            jest.spyOn(notificationMessagesRepository, 'save').mockResolvedValue(mockNotificationMessage as any);
            jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockUser as any);
            jest.spyOn(notificationLogsRepository, 'create').mockReturnValue({} as any);
            jest.spyOn(notificationLogsRepository, 'save').mockResolvedValue({} as any);
            jest.spyOn(redisPubSubService, 'publish').mockResolvedValue();
            jest.spyOn(chatGateway, 'sendJobMatchingNotification').mockResolvedValue();

            await service.createApplyNotificationMessage(jobsId, customerId, ownerId);

            expect(notificationMessagesRepository.save).toHaveBeenCalledWith({
                title: '등록한 잡일에 지원자가 있습니다.',
                type: NotificationTypes.JOB_APPLIED,
                jobsId,
                senderId: customerId,
                receiverId: ownerId,
            });
            expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: ownerId });
            expect(notificationLogsRepository.create).toHaveBeenCalledWith({
                user: mockUser,
                notificationMessage: mockNotificationMessage,
            });
            expect(notificationLogsRepository.save).toHaveBeenCalled();
            expect(redisPubSubService.publish).toHaveBeenCalledWith(`userNotifications_${ownerId}`, {
                userId: ownerId,
                notificationMessage: mockNotificationMessage,
            });
            expect(chatGateway.sendJobMatchingNotification).toHaveBeenCalledWith(ownerId, mockNotificationMessage);
        });

        it('should throw an error if notification message creation fails', async () => {
            const jobsId = 1;
            const customerId = 2;
            const ownerId = 3;

            jest.spyOn(notificationMessagesRepository, 'save').mockRejectedValue(new Error('알림메시지 생성 실패'));

            await expect(service.createApplyNotificationMessage(jobsId, customerId, ownerId)).rejects.toThrow('알림메시지 생성 실패');
        });

        // 추가적인 테스트 케이스 작성
    });
});