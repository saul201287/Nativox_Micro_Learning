import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";

export class ListarEjerciciosPorLeccionUseCase {
  constructor(private ejercicioRepository: EjercicioRepository) {}

  async execute(leccionId: string): Promise<Ejercicio[]> {
    return await this.ejercicioRepository.findByLeccionId(leccionId);
  }
}
