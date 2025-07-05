import { Leccion } from "../../domain/Aggregates/Leccion";
import { NivelDificultad } from "../../domain/ObjetValues/NivelDificultad";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { FiltrosLeccionDto } from "../DTOs/FiltrosLeccionDto";

export class ListarLeccionesUseCase {
  constructor(private leccionRepository: LeccionRepository) {}

  async execute(filtros: FiltrosLeccionDto): Promise<Leccion[]> {
    if (filtros.nivel && filtros.idioma) {
      const leccionesPorNivel = await this.leccionRepository.findByNivel(
        NivelDificultad.fromString(filtros.nivel)
      );
      return leccionesPorNivel.filter((l) => l.getIdioma() === filtros.idioma);
    }

    if (filtros.nivel) {
      return await this.leccionRepository.findByNivel(
        NivelDificultad.fromString(filtros.nivel)
      );
    }

    if (filtros.idioma) {
      return await this.leccionRepository.findByIdioma(filtros.idioma);
    }

    // Si no hay filtros, podríamos implementar findAll con paginación
    throw new Error("Debe especificar al menos un filtro");
  }
}
