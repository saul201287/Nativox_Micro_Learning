import { Repository, DataSource } from "typeorm";
import { LeccionEntity } from "../../Config/db/entities/LeccionEntity";
import { Leccion } from "../../domain/Aggregates/Leccion";
import { NivelDificultad } from "../../domain/ObjetValues/NivelDificultad";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { LeccionMapper } from "../../shared/Mappers";

export class TypeOrmLeccionRepository implements LeccionRepository {
  private readonly repository: Repository<LeccionEntity>;

  constructor(dataSource: DataSource) {
    try {
      this.repository = dataSource.getRepository(LeccionEntity);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async save(leccion: Leccion): Promise<void> {
    try {
      const entity = LeccionMapper.toEntity(leccion);
      await this.repository.save(entity);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Leccion | null> {
    try {
      
      const entity = await this.repository.findOne({
        where: { id },
        relations: ["ejercicios"],
      });
      
      return entity ? LeccionMapper.toDomain(entity) : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findByNivel(nivel: NivelDificultad): Promise<Leccion[]> {
    try {
      const entities = await this.repository.find({
        where: { nivel: nivel.getValue() },
        relations: ["ejercicios"],
      });
      return entities.map(LeccionMapper.toDomain);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findByIdioma(idioma: string): Promise<Leccion[]> {
    try {
      const entities = await this.repository.find({
        where: { idioma },
        relations: ["ejercicios"],
      });
      return entities.map(LeccionMapper.toDomain);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }
}
