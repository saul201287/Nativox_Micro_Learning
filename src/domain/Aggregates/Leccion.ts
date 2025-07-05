import { Ejercicio } from "../Entities/Ejercicio";
import { RespuestaUsuario } from "../Entities/RespuestaUsuario";
import {
  DomainEvent,
  LeccionCreada,
  EjercicioResuelto,
  ProgresoActualizado,
} from "../Events/DomainEvent";
import { NivelDificultad } from "../ObjetValues/NivelDificultad";
import { ResultadoRespuesta } from "../ObjetValues/ResultadoRespuesta";

export class Leccion {
  private ejercicios: Ejercicio[] = [];
  private eventos: DomainEvent[] = [];

  constructor(
    private readonly id: string,
    private titulo: string,
    private readonly nivel: NivelDificultad,
    private readonly contenidoJson: any,
    private readonly idioma: string
  ) {
    this.eventos.push(new LeccionCreada(id, titulo, nivel.getValue(), idioma));
  }

  getId(): string {
    return this.id;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getNivel(): NivelDificultad {
    return this.nivel;
  }

  getContenidoJson(): any {
    return this.contenidoJson;
  }

  getIdioma(): string {
    return this.idioma;
  }

  getEjercicios(): Ejercicio[] {
    return [...this.ejercicios];
  }

  agregarEjercicio(ejercicio: Ejercicio): void {
    if (ejercicio.getLeccionId() !== this.id) {
      throw new Error("El ejercicio no pertenece a esta lección");
    }
    this.ejercicios.push(ejercicio);
  }

  resolverEjercicio(
    usuarioId: string,
    ejercicioId: string,
    respuesta: string,
    tiempoRespuesta: number
  ): RespuestaUsuario {
    const ejercicio = this.ejercicios.find((e) => e.getId() === ejercicioId);
    if (!ejercicio) {
      throw new Error("Ejercicio no encontrado en esta lección");
    }

    const esCorrecta = ejercicio.evaluarRespuesta(respuesta);
    const resultado = new ResultadoRespuesta(esCorrecta, tiempoRespuesta);

    const respuestaUsuario = new RespuestaUsuario(
      crypto.randomUUID(),
      usuarioId,
      ejercicioId,
      respuesta,
      resultado
    );

    this.eventos.push(
      new EjercicioResuelto(
        this.id,
        usuarioId,
        ejercicioId,
        esCorrecta,
        tiempoRespuesta
      )
    );

    return respuestaUsuario;
  }

  calcularProgreso(
    usuarioId: string,
    respuestasUsuario: RespuestaUsuario[]
  ): number {
    const ejerciciosResueltos = respuestasUsuario.filter(
      (r) =>
        r.getUsuarioId() === usuarioId &&
        this.ejercicios.some((e) => e.getId() === r.getEjercicioId())
    );

    if (this.ejercicios.length === 0) return 0;

    const progreso =
      (ejerciciosResueltos.length / this.ejercicios.length) * 100;

    this.eventos.push(new ProgresoActualizado(this.id, usuarioId, progreso));

    return progreso;
  }

  getEventos(): DomainEvent[] {
    return [...this.eventos];
  }

  limpiarEventos(): void {
    this.eventos = [];
  }
}
