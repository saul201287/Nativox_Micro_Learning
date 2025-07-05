import { DomainEvent } from "../Events/DomainEvent";
import { ContenidoEjercicio } from "../ObjetValues/ContenidoEjercicio";

export class Ejercicio {
  private eventos: DomainEvent[] = [];

  constructor(
    private readonly id: string,
    private readonly leccionId: string,
    private readonly tipo: string,
    private readonly enunciado: string,
    private readonly contenido: ContenidoEjercicio,
    private readonly respuestaCorrecta: string
  ) {}

  getId(): string {
    return this.id;
  }

  getLeccionId(): string {
    return this.leccionId;
  }

  getTipo(): string {
    return this.tipo;
  }

  getEnunciado(): string {
    return this.enunciado;
  }

  getContenido(): ContenidoEjercicio {
    return this.contenido;
  }

  evaluarRespuesta(respuesta: string): boolean {
    return (
      this.respuestaCorrecta.toLowerCase().trim() ===
      respuesta.toLowerCase().trim()
    );
  }

  getEventos(): DomainEvent[] {
    return [...this.eventos];
  }

  limpiarEventos(): void {
    this.eventos = [];
  }
}
