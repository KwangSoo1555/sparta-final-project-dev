import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisConfig } from "../redis/redis.config";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        const redisConfig = new RedisConfig(configService);
        return redisConfig.getClient();
      },
      inject: [ConfigService],
    },
    RedisConfig,
  ],
  exports: ["REDIS_CLIENT", RedisConfig],
})
export class RedisModule {}
