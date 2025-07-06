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

    const ejercicio = leccion.getEjercicios().find(e => e.getId() === dto.ejercicioId);
    if (!ejercicio) {
      throw new Error("Ejercicio no encontrado en esta lección");
    }

    const resultado = this.servicioEvaluacion.evaluarRespuesta(ejercicio, dto.respuesta);

    const respuestaUsuario = new RespuestaUsuario(
      crypto.randomUUID(),
      dto.usuarioId,
      dto.ejercicioId,
      dto.respuesta,
      resultado
    );

    await this.respuestaRepository.save(respuestaUsuario);

    // Publicar eventos si es necesario
    // (puedes agregar aquí la lógica de eventos de dominio si lo requieres)

    return respuestaUsuario;
  }
}
