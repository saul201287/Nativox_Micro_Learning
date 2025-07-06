import { DomainEvent } from "./DomainEvent";

export class EjercicioCreadoSagaStarted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    public readonly ejercicioData: any,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioCreadoSagaStarted";
  }
}

export class EjercicioCreadoSagaCompleted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    public readonly ejercicioId: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioCreadoSagaCompleted";
  }
}

export class EjercicioCreadoSagaFailed extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    public readonly error: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioCreadoSagaFailed";
  }
}

export class EjercicioCreadoSagaCompensated extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    public readonly ejercicioId: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioCreadoSagaCompensated";
  }
}

export class EjercicioResueltoSagaStarted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly respuestaData: any,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioResueltoSagaStarted";
  }
}

export class EjercicioResueltoSagaCompleted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly respuestaId: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioResueltoSagaCompleted";
  }
}

export class EjercicioResueltoSagaFailed extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly error: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioResueltoSagaFailed";
  }
}

export class EjercicioResueltoSagaCompensated extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly respuestaId: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioResueltoSagaCompensated";
  }
}

export class ProgresoActualizadoSagaStarted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly leccionId: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "ProgresoActualizadoSagaStarted";
  }
}

export class ProgresoActualizadoSagaCompleted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly leccionId: string,
    public readonly porcentajeAvance: number,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "ProgresoActualizadoSagaCompleted";
  }
}

export class ProgresoActualizadoSagaFailed extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly leccionId: string,
    public readonly error: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "ProgresoActualizadoSagaFailed";
  }
}

export class ProgresoNotificacionCompensada extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly leccionId: string,
    public readonly motivo: string,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "ProgresoNotificacionCompensada";
  }
}

export class NotificacionProgresoCompensada extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly leccionId: string,
    public readonly porcentajeAvance: number,
    public readonly sagaId: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "NotificacionProgresoCompensada";
  }
}