import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule as IoRedisModule } from "@nestjs-modules/ioredis";
import { RedisConfig } from "./redis.config";
import { RedisPubsubService } from "./redis-pubsub.service";

@Global()
@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "single",
        options: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
          password: configService.get("REDIS_PASSWORD"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        const redisConfig = new RedisConfig(configService);
        return redisConfig.getClient();
      },
      inject: [ConfigService],
    },
    {
      provide: "REDIS_SUBSCRIBER_CLIENT",
      useFactory: (configService: ConfigService) => {
        const redisConfig = new RedisConfig(configService);
        return redisConfig.getClient();
      },
      inject: [ConfigService],
    },
    RedisPubsubService,
    {
      provide: "REDIS_PUB_SUB_TOKEN",
      useValue: new RedisPubsubService(),
    },
    RedisConfig,
  ],
  exports: [
    "REDIS_CLIENT",
    "REDIS_SUBSCRIBER_CLIENT",
    "REDIS_PUB_SUB_TOKEN",
    RedisConfig,
    IoRedisModule,
  ],
})
export class RedisModule {}
