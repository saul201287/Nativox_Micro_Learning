import { Leccion } from "../../domain/Aggregates/Leccion";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";

export class ObtenerLeccionUseCase {
  constructor(private leccionRepository: LeccionRepository) {}

  async execute(leccionId: string): Promise<Leccion> {
    const leccion = await this.leccionRepository.findById(leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }
    return leccion;
  }
}
