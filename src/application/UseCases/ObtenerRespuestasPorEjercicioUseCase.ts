import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";

export class ObtenerRespuestasPorEjercicioUseCase {
  constructor(private respuestaRepository: RespuestaUsuarioRepository) {}

  async execute(ejercicioId: string): Promise<RespuestaUsuario[]> {
    return await this.respuestaRepository.findByEjercicioId(ejercicioId);
  }
}
