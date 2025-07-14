import { Leccion } from "../../domain/Aggregates/Leccion";
import { NivelDificultad } from "../../domain/ObjetValues/NivelDificultad";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { CrearLeccionDto } from "../DTOs/CrearLeccionDto";
import crypto from "crypto";

export class CrearLeccionUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(dto: CrearLeccionDto): Promise<string> {
    try {
      const id = crypto.randomUUID();
      const nivel = NivelDificultad.fromString(dto.nivel);

      const leccion = new Leccion(
        id,
        dto.titulo,
        nivel,
        dto.contenidoJson,
        dto.idioma
      );

      const leccionGuardada = await this.leccionRepository.save(leccion);
      console.log("Leccion guardada:", leccionGuardada);
      // Publicar eventos
      const eventos = leccion.getEventos();
      for (const evento of eventos) {
        await this.eventPublisher.publish(evento);
      }
      leccion.limpiarEventos();

      return id;
    } catch (error) {
      console.error("Error al crear la leccion:", error);
      throw error;
    }
  }
}
