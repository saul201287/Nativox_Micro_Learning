import { Leccion } from "../Aggregates/Leccion";
import { NivelDificultad } from "../ObjetValues/NivelDificultad";

export interface LeccionRepository {
  save(leccion: Leccion): Promise<void>;
  findById(id: string): Promise<Leccion | null>;
  findByNivel(nivel: NivelDificultad): Promise<Leccion[]>;
  findByIdioma(idioma: string): Promise<Leccion[]>;
}