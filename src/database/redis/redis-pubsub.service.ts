import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisPubSub } from "graphql-redis-subscriptions";

@Injectable()
export class RedisPubsubService extends RedisPubSub implements OnModuleInit {
  constructor() {
    super({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        db: Number(process.env.MYSQL_URI) || 0,
      },
    });
  }

  async onModuleInit() {}
}
