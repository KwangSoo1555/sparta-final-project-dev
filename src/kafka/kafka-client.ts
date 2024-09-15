import { Inject, Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class KafkaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("KAFKA_CLIENT") private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit(): Promise<void> {
    const topics = ['sum', 'max'];
    topics.forEach((topic) => this.kafkaClient.subscribeToResponseOf(topic));
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }
}