import { DataSource, Repository } from "typeorm";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { Ejercicio } from "../../domain/Entities/Ejercicio";
import { EjercicioEntity } from "../../Config/db/entities/EjercicioEntity";
import { EjercicioMapper } from "../../shared/Mappers";

export class TypeOrmEjercicioRepository implements EjercicioRepository {
  private repository: Repository<EjercicioEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EjercicioEntity);
  }

  async save(ejercicio: Ejercicio): Promise<void> {
    const entity = EjercicioMapper.toEntity(ejercicio);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Ejercicio | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? EjercicioMapper.toDomain(entity) : null;
  }

  async findByLeccionId(leccionId: string): Promise<Ejercicio[]> {
    const entities = await this.repository.find({
      where: { leccion_id: leccionId },
    });
    return entities.map(EjercicioMapper.toDomain);
  }
}
