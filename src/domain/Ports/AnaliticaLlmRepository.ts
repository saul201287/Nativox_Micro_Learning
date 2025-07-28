import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";
import { UsuarioNotificableEntity } from "../../Config/db/entities/UsuarioNotificableEntity";

export interface AnaliticaLlmRepository {
  create(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity>;
  findByUid(uid: string): Promise<AnaliticaLlmEntity | null>;
  update(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity>;
  findAll(): Promise<AnaliticaLlmEntity[]>;
  findByUsuarioId(usuarioId: string): Promise<UsuarioNotificableEntity | null>;
}
