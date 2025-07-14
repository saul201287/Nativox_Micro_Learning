import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { 
  EjercicioResueltoSagaStarted,
  EjercicioResueltoSagaCompleted,
  EjercicioResueltoSagaFailed
} from "../../domain/Events/SagaEvents";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { ServicioDeEvaluacion } from "../../domain/Services/ServicioDeEvaluacion";
import { ResolverEjercicioDto } from "../DTOs/ResolverEjercicioDto";
import crypto from "crypto";

export class ResolverEjercicioUseCase {
  constructor(
    private readonly leccionRepository: LeccionRepository,
    private readonly respuestaRepository: RespuestaUsuarioRepository,
    private readonly servicioEvaluacion: ServicioDeEvaluacion,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(
    leccionId: string,
    dto: ResolverEjercicioDto
  ): Promise<RespuestaUsuario> {
    const sagaId = crypto.randomUUID();
    let respuestaId: string | null = null;
    
    try {
      await this.eventPublisher.publish(
        new EjercicioResueltoSagaStarted(
          leccionId,
          dto.usuarioId,
          dto.ejercicioId,
          dto,
          sagaId
        )
      );

      const leccion = await this.leccionRepository.findById(leccionId);
      if (!leccion) {
        throw new Error("Lección no encontrada");
      }

      const ejercicio = leccion.getEjercicios().find(e => e.getId() === dto.ejercicioId);
      if (!ejercicio) {
        throw new Error("Ejercicio no encontrado en esta lección");
      }

      const resultado = this.servicioEvaluacion.evaluarRespuesta(ejercicio, dto.respuesta);

      respuestaId = crypto.randomUUID();
      const respuestaUsuario = new RespuestaUsuario(
        respuestaId,
        dto.usuarioId,
        dto.ejercicioId,
        dto.respuesta,
        resultado
      );

      await this.respuestaRepository.save(respuestaUsuario);

      await this.eventPublisher.publish(
        new EjercicioResueltoSagaCompleted(
          leccionId,
          dto.usuarioId,
          dto.ejercicioId,
          respuestaId,
          sagaId
        )
      );

      return respuestaUsuario;
      
    } catch (error) {
      console.error(`[SAGA] Error en ResolverEjercicio: ${error}`);
      
      await this.eventPublisher.publish(
        new EjercicioResueltoSagaFailed(
          leccionId,
          dto.usuarioId,
          dto.ejercicioId,
          error instanceof Error ? error.message : "Error desconocido",
          sagaId
        )
      );
      
      throw error;
    }
  }
}
