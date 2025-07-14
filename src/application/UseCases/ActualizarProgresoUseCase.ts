import { ProgresoActualizado } from "../../domain/Events/DomainEvent";
import { 
  ProgresoActualizadoSagaStarted,
  ProgresoActualizadoSagaCompleted,
  ProgresoActualizadoSagaFailed
} from "../../domain/Events/SagaEvents";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { ServicioDeProgreso } from "../../domain/Services/ServicioDeProgreso";
import { ActualizarProgresoCommand } from "../Commands/CommandsEscritura";
import { ServicioDeNotificaciones } from "../../domain/Services/ServicioDeNotificaciones";
import crypto from "crypto";

export class ActualizarProgresoUseCase {
  constructor(
    private readonly leccionRepository: LeccionRepository,
    private readonly respuestaRepository: RespuestaUsuarioRepository,
    private readonly servicioProgreso: ServicioDeProgreso,
    private readonly eventPublisher: EventPublisher,
    private readonly servicioDeNotificaciones: ServicioDeNotificaciones
  ) {}

  async execute(command: ActualizarProgresoCommand): Promise<void> {
    const sagaId = crypto.randomUUID();
    
    try {
      await this.eventPublisher.publish(
        new ProgresoActualizadoSagaStarted(
          command.leccionId,
          command.usuarioId,
          command.leccionId,
          sagaId
        )
      );

      const leccion = await this.leccionRepository.findById(command.leccionId);
      if (!leccion) {
        throw new Error(`Lección no encontrada: ${command.leccionId}`);
      }

      const respuestasUsuario = await this.respuestaRepository.findByUsuarioId(
        command.usuarioId
      );
      const respuestasLeccion = respuestasUsuario.filter((r) =>
        leccion.getEjercicios().some((ej) => ej.getId() === r.getEjercicioId())
      );

      const respuestasCorrectas = respuestasLeccion.filter((r) =>
        r.getResultado().esAcierto()
      ).length;

      const totalEjercicios = leccion.getEjercicios().length;
      const porcentajeAvance = totalEjercicios > 0 
        ? (respuestasCorrectas / totalEjercicios) * 100 
        : 0;

      await this.eventPublisher.publish(
        new ProgresoActualizadoSagaCompleted(
          command.leccionId,
          command.usuarioId,
          command.leccionId,
          porcentajeAvance,
          sagaId
        )
      );

      const event = new ProgresoActualizado(
        command.leccionId,
        command.usuarioId,
        porcentajeAvance
      );

      await this.eventPublisher.publish(event);

      if (porcentajeAvance === 100) {
        await this.servicioDeNotificaciones.notificarLeccionCompletada(command.usuarioId, leccion.getTitulo());
      }
      
    } catch (error) {
      console.error(`[SAGA] Error en ActualizarProgreso: ${error}`);
      
      await this.eventPublisher.publish(
        new ProgresoActualizadoSagaFailed(
          command.leccionId,
          command.usuarioId,
          command.leccionId,
          error instanceof Error ? error.message : "Error desconocido",
          sagaId
        )
      );
        
      throw error;
    }
  }
}
