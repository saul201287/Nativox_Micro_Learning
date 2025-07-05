import { DomainEvent } from "../Events/DomainEvent";

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
