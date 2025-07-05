import { Leccion } from "../../domain/Aggregates/Leccion";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { ActualizarLeccionDto } from "../DTOs/ActualizarLeccionDto";

export class ActualizarLeccionUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(leccionId: string, dto: ActualizarLeccionDto): Promise<void> {
    const leccion = await this.leccionRepository.findById(leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }

    // Crear nueva instancia con datos actualizados
    const leccionActualizada = new Leccion(
      leccion.getId(),
      dto.titulo || leccion.getTitulo(),
      leccion.getNivel(),
      dto.contenidoJson || leccion.getContenidoJson(),
      leccion.getIdioma()
    );

    // Mantener ejercicios existentes
    leccion.getEjercicios().forEach((ejercicio) => {
      leccionActualizada.agregarEjercicio(ejercicio);
    });

    await this.leccionRepository.save(leccionActualizada);
  }
}
