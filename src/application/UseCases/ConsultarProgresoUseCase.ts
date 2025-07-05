import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { ServicioDeProgreso } from "../../domain/Services/ServicioDeProgreso";
import { ConsultarProgresoDto } from "../DTOs/ConsultarProgresoDto";

export class ConsultarProgresoUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private servicioProgreso: ServicioDeProgreso,
    private eventPublisher: EventPublisher
  ) {}

  async execute(dto: ConsultarProgresoDto): Promise<number> {
    const leccion = await this.leccionRepository.findById(dto.leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }

    const progreso = await this.servicioProgreso.calcularProgreso(
      leccion,
      dto.usuarioId
    );

    // Publicar eventos
    const eventos = leccion.getEventos();
    for (const evento of eventos) {
      await this.eventPublisher.publish(evento);
    }
    leccion.limpiarEventos();

    return progreso;
  }
}
