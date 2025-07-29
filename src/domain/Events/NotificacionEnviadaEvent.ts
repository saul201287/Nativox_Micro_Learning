import { DomainEvent } from "./DomainEvent";

export class NotificacionEnviadaEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly titulo: string,
    public readonly mensaje: string,
    public readonly tipo: 'email' | 'push',
    public readonly metadata?: Record<string, any>
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'notificacion.enviada';
  }
}
