import { Leccion } from "../../domain/Aggregates/Leccion";
import { NivelDificultad } from "../../domain/ObjetValues/NivelDificultad";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { CrearLeccionDto } from "../DTOs/CrearLeccionDto";

export class CrearLeccionUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(dto: CrearLeccionDto): Promise<string> {
    const id = crypto.randomUUID();
    const nivel = NivelDificultad.fromString(dto.nivel);

    const leccion = new Leccion(
      id,
      dto.titulo,
      nivel,
      dto.contenidoJson,
      dto.idioma
    );

    await this.leccionRepository.save(leccion);

    // Publicar eventos
    const eventos = leccion.getEventos();
    for (const evento of eventos) {
      await this.eventPublisher.publish(evento);
    }
    leccion.limpiarEventos();

    return id;
  }
}
