import { DataSource, Repository } from "typeorm";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioEntity } from "../../Config/db/entities/EjercicioEntity";
import { EjercicioMapper } from "../../shared/Mappers";
import { LeccionEntity } from "../../Config/db/entities/LeccionEntity";

export class TypeOrmEjercicioRepository implements EjercicioRepository {
  private repository: Repository<EjercicioEntity>;
  private repositoryLeccion: Repository<LeccionEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EjercicioEntity);
    this.repositoryLeccion = dataSource.getRepository(LeccionEntity);
  }

  async save(ejercicio: Ejercicio): Promise<void> {
    try {
      const leccionId = ejercicio.getLeccionId();
      const entity = EjercicioMapper.toEntity(ejercicio);
      const leccion = await this.repositoryLeccion.findOne({
        where: { id: leccionId },
      });
      if (!leccion) {
        throw "error: no se encontro la entidad leccion";
      }
      entity.leccion = leccion
      
      await this.repository.save(entity);
    } catch (error) {
      throw "error: " + error;
    }
  }

  async findById(id: string): Promise<Ejercicio | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      return entity ? EjercicioMapper.toDomain(entity) : null;
    } catch (error) {
      console.error("Error buscando ejercicio por ID:", error);
      throw error;
    }
  }

  async findByLeccionId(leccionId: string): Promise<Ejercicio[]> {
    try {
      const entities = await this.repository.find({
        where: { leccion_id: leccionId },
      });
      return entities.map(EjercicioMapper.toDomain);
    } catch (error) {
      console.error("Error buscando ejercicios por lección:", error);
      throw error;
    }
  }
}
