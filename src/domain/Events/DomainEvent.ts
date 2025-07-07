export abstract class DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly occurredOn: Date = new Date()
  ) {}

  abstract getEventName(): string;
}

export class LeccionCreada extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly titulo: string,
    public readonly nivel: string,
    public readonly idioma: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "LeccionCreada";
  }
}

export class EjercicioResuelto extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly correcta: boolean,
    public readonly tiempoRespuesta: number
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioResuelto";
  }
}

export class ProgresoActualizado extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly usuarioId: string,
    public readonly porcentajeCompletado: number
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "ProgresoActualizado";
  }
}

export class EjercicioCreado extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    public readonly tipo: string
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return "EjercicioCreado";
  }
}

export class RespuestaEvaluadaEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly leccionId: string,
    occurredOn: Date,
    public readonly data: {
      usuarioId: string;
      ejercicioId: string;
      esCorrecta: boolean;
      tiempoRespuesta: number;
    }
  ) {
    super(aggregateId, occurredOn);
  }

  getEventName(): string {
    return "RespuestaEvaluada";
  }
}