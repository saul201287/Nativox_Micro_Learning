import { Repository, DataSource } from "typeorm";
import { LeccionEntity } from "../../Config/db/entities/LeccionEntity";
import { Leccion } from "../../domain/Aggregates/Leccion";
import { NivelDificultad } from "../../domain/ObjetValues/NivelDificultad";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { LeccionMapper } from "../../shared/Mappers";

export class TypeOrmLeccionRepository implements LeccionRepository {
  private repository: Repository<LeccionEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(LeccionEntity);
  }

  async save(leccion: Leccion): Promise<void> {
    const entity = LeccionMapper.toEntity(leccion);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Leccion | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ["ejercicios"],
    });
    return entity ? LeccionMapper.toDomain(entity) : null;
  }

  async findByNivel(nivel: NivelDificultad): Promise<Leccion[]> {
    const entities = await this.repository.find({
      where: { nivel: nivel.getValue() },
      relations: ["ejercicios"],
    });
    return entities.map(LeccionMapper.toDomain);
  }

  async findByIdioma(idioma: string): Promise<Leccion[]> {
    const entities = await this.repository.find({
      where: { idioma },
      relations: ["ejercicios"],
    });
    return entities.map(LeccionMapper.toDomain);
  }
}

