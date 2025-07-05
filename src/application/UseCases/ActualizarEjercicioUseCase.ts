import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { ContenidoEjercicio } from "../../domain/ObjetValues/ContenidoEjercicio";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { ActualizarEjercicioDto } from "../DTOs/ActualizarEjercicioDto";

export class ActualizarEjercicioUseCase {
  constructor(
    private ejercicioRepository: EjercicioRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(
    ejercicioId: string,
    dto: ActualizarEjercicioDto
  ): Promise<void> {
    const ejercicio = await this.ejercicioRepository.findById(ejercicioId);
    if (!ejercicio) {
      throw new Error("Ejercicio no encontrado");
    }

    const contenidoActualizado = new ContenidoEjercicio(
      dto.enunciado || ejercicio.getEnunciado(),
      dto.imagenes || ejercicio.getContenido().getImagenes(),
      dto.opciones || ejercicio.getContenido().getOpciones()
    );

    const ejercicioActualizado = new Ejercicio(
      ejercicio.getId(),
      ejercicio.getLeccionId(),
      ejercicio.getTipo(),
      dto.enunciado || ejercicio.getEnunciado(),
      contenidoActualizado,
      dto.respuestaCorrecta || ejercicio.getContenido().getTexto()
    );

    await this.ejercicioRepository.save(ejercicioActualizado);
  }
}
