import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioCreado } from "../../domain/Events/DomainEvent";
import { 
  EjercicioCreadoSagaStarted,
  EjercicioCreadoSagaCompleted,
  EjercicioCreadoSagaFailed
} from "../../domain/Events/SagaEvents";
import { ContenidoEjercicio } from "../../domain/ObjetValues/ContenidoEjercicio";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { CrearEjercicioDto } from "../DTOs/CrearEjercicioDto";
import crypto from "crypto";

export class CrearEjercicioUseCase {
  constructor(
    private readonly leccionRepository: LeccionRepository,
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(dto: CrearEjercicioDto): Promise<string> {
    const sagaId = crypto.randomUUID();
    let ejercicioId: string | null = null;
    
    try {
      await this.eventPublisher.publish(
        new EjercicioCreadoSagaStarted(
          dto.leccionId,
          dto.leccionId,
          dto,
          sagaId
        )
      );

      const leccion = await this.leccionRepository.findById(dto.leccionId);
      if (!leccion) {
        throw new Error("Lección no encontrada");
      }
      
      ejercicioId = crypto.randomUUID();
      const contenido = new ContenidoEjercicio(
        dto.enunciado,
        dto.imagenes || [],
        dto.opciones
      );

      const ejercicio = new Ejercicio(
        ejercicioId,
        dto.leccionId,
        dto.tipo,
        dto.enunciado,
        contenido,
        dto.respuestaCorrecta
      );
      
      await this.ejercicioRepository.save(ejercicio);
      
      leccion.agregarEjercicio(ejercicio);
      await this.leccionRepository.save(leccion);

      await this.eventPublisher.publish(
        new EjercicioCreadoSagaCompleted(
          ejercicioId,
          dto.leccionId,
          ejercicioId,
          sagaId
        )
      );

      await this.eventPublisher.publish(
        new EjercicioCreado(ejercicioId, dto.leccionId, dto.tipo)
      );

      return ejercicioId;
      
    } catch (error) {
      console.error(`[SAGA] Error en CrearEjercicio: ${error}`);
      
      await this.eventPublisher.publish(
        new EjercicioCreadoSagaFailed(
          dto.leccionId,
          dto.leccionId,
          error instanceof Error ? error.message : "Error desconocido",
          sagaId
        )
      );
      
      throw error;
    }
  }
}
