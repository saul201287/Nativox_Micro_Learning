import { Repository } from "typeorm";
import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";
import { AnaliticaLlmRepository } from "../../domain/Ports/AnaliticaLlmRepository";

export class TypeOrmAnaliticaLlmRepository implements AnaliticaLlmRepository {
  private readonly repository: Repository<AnaliticaLlmEntity>;

  constructor(repository: Repository<AnaliticaLlmEntity>) {
    this.repository = repository;
  }

  async create(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity> {
    try {
      const analiticaCreada = await this.repository.save(analitica);
      return analiticaCreada;
    } catch (error: any) {
      if (error.code === "23505") {
        throw new Error(`La analítica LLM ya existe: ${error.message}`);
      } else {
        throw new Error(`Error al crear analítica LLM: ${error.message}`);
      }
    }
  }

  async findByUid(uid: string): Promise<AnaliticaLlmEntity | null> {
    try {
      const analitica = await this.repository.findOne({ where: { uid: uid } });
      return analitica;
    } catch (error: any) {
      throw new Error(
        `Error al buscar analítica LLM por UID: ${error.message}`
      );
    }
  }

  async update(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity> {
    try {
      const analiticaActualizada = await this.repository.save(analitica);
      return analiticaActualizada;
    } catch (error: any) {
      if (error.code === "23505") {
        throw new Error(`La analítica LLM ya existe: ${error.message}`);
      } else {
        throw new Error(`Error al actualizar analítica LLM: ${error.message}`);
      }
    }
  }

  async findAll(): Promise<AnaliticaLlmEntity[]> {
    try {
      const analiticas = await this.repository.find();
      return analiticas;
    } catch (error: any) {
      throw new Error(`Error al listar analíticas LLM: ${error.message}`);
    }
  }
}
