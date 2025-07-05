import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";

export class ObtenerEjercicioUseCase {
  constructor(private ejercicioRepository: EjercicioRepository) {}

  async execute(ejercicioId: string): Promise<Ejercicio> {
    const ejercicio = await this.ejercicioRepository.findById(ejercicioId);
    if (!ejercicio) {
      throw new Error("Ejercicio no encontrado");
    }
    return ejercicio;
  }
}
