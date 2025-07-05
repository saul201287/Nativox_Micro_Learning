import { Leccion } from "../Aggregates/Leccion";
import { RespuestaUsuarioRepository } from "../Ports/RespuestaUsuarioRepository";

export interface ServicioDeProgreso {
  calcularProgreso(leccion: Leccion, usuarioId: string): Promise<number>;
}

export class ServicioDeProgresoImpl implements ServicioDeProgreso {
  constructor(private respuestaRepository: RespuestaUsuarioRepository) {}

  async calcularProgreso(leccion: Leccion, usuarioId: string): Promise<number> {
    const respuestas = await this.respuestaRepository.findByUsuarioId(
      usuarioId
    );
    return leccion.calcularProgreso(usuarioId, respuestas);
  }
}
