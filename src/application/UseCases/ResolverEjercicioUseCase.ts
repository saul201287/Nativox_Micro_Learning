import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { ServicioDeEvaluacion } from "../../domain/Services/ServicioDeEvaluacion";
import { ResolverEjercicioDto } from "../DTOs/ResolverEjercicioDto";

export class ResolverEjercicioUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private respuestaRepository: RespuestaUsuarioRepository,
    private servicioEvaluacion: ServicioDeEvaluacion,
    private eventPublisher: EventPublisher
  ) {}

  async execute(
    leccionId: string,
    dto: ResolverEjercicioDto
  ): Promise<RespuestaUsuario> {
    const leccion = await this.leccionRepository.findById(leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }

    const respuestaUsuario = leccion.resolverEjercicio(
      dto.usuarioId,
      dto.ejercicioId,
      dto.respuesta,
      dto.tiempoRespuesta
    );

    await this.respuestaRepository.save(respuestaUsuario);

    // Publicar eventos
    const eventos = leccion.getEventos();
    for (const evento of eventos) {
      await this.eventPublisher.publish(evento);
    }
    leccion.limpiarEventos();

    return respuestaUsuario;
  }
}
