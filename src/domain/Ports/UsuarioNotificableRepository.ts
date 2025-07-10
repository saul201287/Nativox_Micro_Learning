import { UsuarioNotificableEntity } from "../../Config/db/entities/UsuarioNotificableEntity";

export interface UsuarioNotificableRepository {
  save(usuario: UsuarioNotificableEntity): Promise<void>;
  findById(usuarioId: string): Promise<UsuarioNotificableEntity | null>;
}
