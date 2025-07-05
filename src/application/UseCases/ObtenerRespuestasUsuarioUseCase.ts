import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";

export class ObtenerRespuestasUsuarioUseCase {
  constructor(private respuestaRepository: RespuestaUsuarioRepository) {}

  async execute(usuarioId: string): Promise<RespuestaUsuario[]> {
    return await this.respuestaRepository.findByUsuarioId(usuarioId);
  }
}
