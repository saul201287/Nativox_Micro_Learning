import { ProgresoActualizadoEvent } from "../../domain/Events/DomainEvent";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { ServicioDeProgreso } from "../../domain/Services/ServicioDeProgreso";
import { ActualizarProgresoCommand } from "../Commands/QueriesLectura";

export class ActualizarProgresoUseCase {
  constructor(
    private readonly leccionRepository: LeccionRepository,
    private readonly respuestaRepository: RespuestaUsuarioRepository,
    private readonly servicioProgreso: ServicioDeProgreso,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: ActualizarProgresoCommand): Promise<void> {
    // Buscar lección
    const leccion = await this.leccionRepository.findById(command.leccionId);
    if (!leccion) {
      throw new Error(`Lección no encontrada: ${command.leccionId}`);
    }

    // Obtener respuestas del usuario para esta lección
    const respuestasUsuario = await this.respuestaRepository.findByUsuarioId(
      command.usuarioId
    );
    const respuestasLeccion = respuestasUsuario.filter((r) =>
      leccion.getEjercicios().some((ej) => ej.getId() === r.getEjercicioId())
    );

    // Calcular progreso
    const respuestasCorrectas = respuestasLeccion.filter((r) =>
      r.getResultado().esCorrecta()
    ).length;

    const totalEjercicios = leccion.getEjercicios().length;
    const porcentajeAvance = this.servicioProgreso.calcularPorcentajeAvance(
      respuestasCorrectas,
      totalEjercicios
    );

    const nivelCompletado =
      this.servicioProgreso.determinarNivelCompletado(porcentajeAvance);

    // Publicar evento
    const event = new ProgresoActualizadoEvent(
      `prog-${Date.now()}`,
      command.leccionId,
      new Date(),
      {
        usuarioId: command.usuarioId,
        leccionId: command.leccionId,
        porcentajeAvance,
        nivelCompletado,
      }
    );

    await this.eventPublisher.publish(event);
  }
}
