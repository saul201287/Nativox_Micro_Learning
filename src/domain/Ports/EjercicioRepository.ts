import { Ejercicio } from "../Entities/Ejercicio";

export interface EjercicioRepository {
  save(ejercicio: Ejercicio): Promise<void>;
  findById(id: string): Promise<Ejercicio | null>;
  findByLeccionId(leccionId: string): Promise<Ejercicio[]>;
}
