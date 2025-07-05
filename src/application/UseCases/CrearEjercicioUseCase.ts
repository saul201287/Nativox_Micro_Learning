import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioCreado } from "../../domain/Events/DomainEvent";
import { ContenidoEjercicio } from "../../domain/ObjetValues/ContenidoEjercicio";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { CrearEjercicioDto } from "../DTOs/CrearEjercicioDto";

export class CrearEjercicioUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private ejercicioRepository: EjercicioRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(dto: CrearEjercicioDto): Promise<string> {
    const leccion = await this.leccionRepository.findById(dto.leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }

    const ejercicioId = crypto.randomUUID();
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

    // Publicar evento
    await this.eventPublisher.publish(
      new EjercicioCreado(ejercicioId, dto.leccionId, dto.tipo)
    );

    return ejercicioId;
  }
}
