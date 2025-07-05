import { RespuestaUsuario } from "../Entities/RespuestaUsuario";

export interface RespuestaUsuarioRepository {
  save(respuesta: RespuestaUsuario): Promise<void>;
  findById(id: string): Promise<RespuestaUsuario | null>;
  findByUsuarioId(usuarioId: string): Promise<RespuestaUsuario[]>;
  findByEjercicioId(ejercicioId: string): Promise<RespuestaUsuario[]>;
}

