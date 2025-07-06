import signale from "signale";
import { EjercicioRepository } from "../Ports/EjercicioRepository";
import { LeccionRepository } from "../Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../Ports/RespuestaUsuarioRepository";
import { EventPublisher } from "../Ports/EventPublisher";
import { NotificacionProgresoCompensada } from "../Events/SagaEvents";
import { ProgresoActualizado } from "../Events/DomainEvent";

export interface SagaCompensationService {
  compensarCreacionEjercicio(ejercicioId: string, leccionId: string): Promise<void>;
  compensarResolucionEjercicio(respuestaId: string, ejercicioId: string): Promise<void>;
  compensarActualizacionProgreso(usuarioId: string, leccionId: string): Promise<void>;
}

export class SagaCompensationServiceImpl implements SagaCompensationService {
  constructor(
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly leccionRepository: LeccionRepository,
    private readonly respuestaRepository: RespuestaUsuarioRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async compensarCreacionEjercicio(ejercicioId: string, leccionId: string): Promise<void> {
    try {
      signale.info(`[SAGA] Compensando creación de ejercicio: ${ejercicioId}`);
      
      await this.ejercicioRepository.deleteById(ejercicioId);
      
      const leccion = await this.leccionRepository.findById(leccionId);
      if (leccion) {
        leccion.removerEjercicio(ejercicioId);
        await this.leccionRepository.save(leccion);
      }
      
      signale.info(`[SAGA] Compensación de creación de ejercicio completada: ${ejercicioId}`);
    } catch (error) {
      signale.error(`[SAGA] Error en compensación de creación de ejercicio: ${error}`);
      throw error;
    }
  }

  async compensarResolucionEjercicio(respuestaId: string, ejercicioId: string): Promise<void> {
    try {
      signale.info(`[SAGA] Compensando resolución de ejercicio: ${respuestaId}`);
      
      await this.respuestaRepository.deleteById(respuestaId);
      
      signale.info(`[SAGA] Compensación de resolución de ejercicio completada: ${respuestaId}`);
    } catch (error) {
      signale.error(`[SAGA] Error en compensación de resolución de ejercicio: ${error}`);
      throw error;
    }
  }

  async compensarActualizacionProgreso(usuarioId: string, leccionId: string): Promise<void> {
    try {
      signale.info(`[SAGA] Compensando actualización de progreso para usuario: ${usuarioId}, lección: ${leccionId}`);
      
      const respuestasUsuario = await this.respuestaRepository.findByUsuarioId(usuarioId);
      const leccion = await this.leccionRepository.findById(leccionId);
      
      if (!leccion) {
        signale.warn(`[SAGA] Lección no encontrada para compensación: ${leccionId}`);
        return;
      }
      
      const respuestasLeccion = respuestasUsuario.filter((r) =>
        leccion.getEjercicios().some((ej) => ej.getId() === r.getEjercicioId())
      );
      
      const respuestasCorrectas = respuestasLeccion.filter((r) =>
        r.getResultado().esAcierto()
      ).length;
      
      const totalEjercicios = leccion.getEjercicios().length;
      const progresoActual = totalEjercicios > 0 
        ? (respuestasCorrectas / totalEjercicios) * 100 
        : 0;
      
      const compensacionEvent = new NotificacionProgresoCompensada(
        leccionId,
        usuarioId,
        leccionId,
        progresoActual,
        `comp-${Date.now()}`
      );
      
      await this.eventPublisher.publish(compensacionEvent);
      signale.info(`[SAGA] Notificación de compensación enviada a Kafka - Usuario: ${usuarioId}, Lección: ${leccionId}, Progreso: ${progresoActual}%`);
      
      const reversoEvent = new ProgresoActualizado(
        leccionId,
        usuarioId,
        progresoActual
      );
      
      await this.eventPublisher.publish(reversoEvent);
      signale.info(`[SAGA] Evento de reversión de progreso enviado a Kafka - Progreso corregido: ${progresoActual}%`);
      
      signale.info(`[SAGA] Compensación de actualización de progreso completada`);
    } catch (error) {
      signale.error(`[SAGA] Error en compensación de actualización de progreso: ${error}`);
      throw error;
    }
  }
} 