import { Args, Resolver, Subscription } from "@nestjs/graphql";
import { RedisPubsubService } from "../../database/redis/redis-pubsub.service";
import { PubSub } from "graphql-subscriptions";
import { Notification } from "src/entities/notification.entity";
import { Inject } from "@nestjs/common";

const pubSub = new PubSub();

@Resolver()
export class NotificationsResolver {
  constructor(
    @Inject("REDIS_PUB_SUB_TOKEN")
    private readonly redisPubSub: RedisPubsubService,
  ) {}
  @Subscription(() => Notification, {
    filter: (payload, variables) => payload.userId === variables.userId,
  })
  userNotificatonEvent(@Args("userId") userId: string) {
    return pubSub.asyncIterator(`userNotifications_${userId}`);
  }
}
