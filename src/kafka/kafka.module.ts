import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "nestjs",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "nestjs-consumer",
          },
        },
      },
    ]),
  ],
})
export class KafkaModule {}