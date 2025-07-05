import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { EstadisticasLeccionDto } from "../DTOs/EstadisticasLeccionDto";

export class ObtenerEstadisticasLeccionUseCase {
  constructor(
    private leccionRepository: LeccionRepository,
    private respuestaRepository: RespuestaUsuarioRepository
  ) {}

  async execute(dto: EstadisticasLeccionDto): Promise<any> {
    const leccion = await this.leccionRepository.findById(dto.leccionId);
    if (!leccion) {
      throw new Error("Lección no encontrada");
    }

    const ejercicios = leccion.getEjercicios();
    const estadisticas = {
      leccionId: dto.leccionId,
      titulo: leccion.getTitulo(),
      totalEjercicios: ejercicios.length,
      ejercicios: [] as Array<{
        ejercicioId: string;
        enunciado: string;
        totalRespuestas: number;
        respuestasCorrectas: number;
        porcentajeAcierto: number;
      }>,
    };

    for (const ejercicio of ejercicios) {
      const respuestas = await this.respuestaRepository.findByEjercicioId(
        ejercicio.getId()
      );
      const respuestasCorrectas = respuestas.filter((r) => r.esCorrecta());

      estadisticas.ejercicios.push({
        ejercicioId: ejercicio.getId(),
        enunciado: ejercicio.getEnunciado(),
        totalRespuestas: respuestas.length,
        respuestasCorrectas: respuestasCorrectas.length,
        porcentajeAcierto:
          respuestas.length > 0
            ? (respuestasCorrectas.length / respuestas.length) * 100
            : 0,
      });
    }

    return estadisticas;
  }
}
