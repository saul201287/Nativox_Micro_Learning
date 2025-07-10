import { DataSource, Repository } from "typeorm";
import { UsuarioNotificableEntity } from "../../Config/db/entities/UsuarioNotificableEntity";
import { UsuarioNotificableRepository } from "../../domain/Ports/UsuarioNotificableRepository";

export class TypeOrmUsuarioNotificableRepository implements UsuarioNotificableRepository {
  private readonly repo: Repository<UsuarioNotificableEntity>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(UsuarioNotificableEntity);
  }

  async save(usuario: UsuarioNotificableEntity): Promise<void> {
    await this.repo.save(usuario);
  }

  async findById(usuarioId: string): Promise<UsuarioNotificableEntity | null> {
    return await this.repo.findOneBy({ usuarioId });
  }
} 