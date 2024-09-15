import { KafkaOptions, Transport } from "@nestjs/microservices";

export const KAFKA_OPTION: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: "nestjs",
      brokers: ["localhost:3333"],
    },
    consumer: {
      groupId: "nestjs-consumer",
    },
  },
};