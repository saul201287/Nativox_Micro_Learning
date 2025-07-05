import { ResultadoRespuesta } from "../ObjetValues/ResultadoRespuesta";

export class RespuestaUsuario {
  constructor(
    private readonly id: string,
    private readonly usuarioId: string,
    private readonly ejercicioId: string,
    private readonly respuestaDada: string,
    private readonly resultado: ResultadoRespuesta,
    private readonly timestamp: Date = new Date()
  ) {}

  getId(): string {
    return this.id;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getEjercicioId(): string {
    return this.ejercicioId;
  }

  getRespuestaDada(): string {
    return this.respuestaDada;
  }

  getResultado(): ResultadoRespuesta {
    return this.resultado;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  esCorrecta(): boolean {
    return this.resultado.esAcierto();
  }
}
