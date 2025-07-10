import { DataSource, Repository } from "typeorm";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { RespuestaUsuarioEntity } from "../../Config/db/entities/RespuestaUsuarioEntity";
import { RespuestaUsuarioMapper } from "../../shared/Mappers";

export class TypeOrmRespuestaUsuarioRepository
  implements RespuestaUsuarioRepository
{
  private readonly repository: Repository<RespuestaUsuarioEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(RespuestaUsuarioEntity);
  }

  async save(respuesta: RespuestaUsuario): Promise<void> {
    try {
      
      const entity = RespuestaUsuarioMapper.toEntity(respuesta);
      await this.repository.save(entity);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findById(id: string): Promise<RespuestaUsuario | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      return entity ? RespuestaUsuarioMapper.toDomain(entity) : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findByUsuarioId(usuarioId: string): Promise<RespuestaUsuario[]> {
    try {
      const entities = await this.repository.find({
        where: { usuario_id: usuarioId },
      });
      return entities.map(RespuestaUsuarioMapper.toDomain);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async findByEjercicioId(ejercicioId: string): Promise<RespuestaUsuario[]> {
    try {
      const entities = await this.repository.find({
        where: { ejercicio_id: ejercicioId },
      });
      return entities.map(RespuestaUsuarioMapper.toDomain);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      console.error("Error eliminando respuesta de usuario:", error);
      throw error;
    }
  }
}
