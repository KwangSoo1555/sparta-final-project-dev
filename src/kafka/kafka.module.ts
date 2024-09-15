import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KAFKA_OPTION } from "./kafka-config";
import { KafkaClient } from "./kafka-client";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: KAFKA_OPTION.options,
      },
    ]),
  ],
  providers: [KafkaClient],
  exports: [KafkaClient],
})
export class KafkaModule {}
