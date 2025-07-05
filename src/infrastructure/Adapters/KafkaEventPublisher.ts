import { Kafka, Producer } from "kafkajs";
import { DomainEvent } from "../../domain/Events/DomainEvent";
import { EventPublisher } from "../../domain/Ports/EventPublisher";

export class KafkaEventPublisher implements EventPublisher {
  private producer: Producer;

  constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async publish(event: DomainEvent): Promise<void> {
    const message = {
      key: event.aggregateId,
      value: JSON.stringify({
        eventName: event.getEventName(),
        aggregateId: event.aggregateId,
        occurredOn: event.occurredOn.toISOString(),
        payload: event,
      }),
    };

    await this.producer.send({
      topic: "learning-events",
      messages: [message],
    });
  }
}
