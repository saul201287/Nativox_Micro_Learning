import { Request, Response } from "express";
import { ObtenerRespuestasUsuarioUseCase } from "../../../application/UseCases/ObtenerRespuestasUsuarioUseCase";
import { ObtenerEstadisticasLeccionUseCase } from "../../../application/UseCases/ObtenerEstadisticasLeccionUseCase";
import { EstadisticasLeccionDto } from "../../../application/DTOs/EstadisticasLeccionDto";

export class UsuarioController {
  constructor(
    private obtenerRespuestasUsuarioUseCase: ObtenerRespuestasUsuarioUseCase,
    private obtenerEstadisticasLeccionUseCase: ObtenerEstadisticasLeccionUseCase
  ) {}

  async obtenerRespuestasUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId } = req.params;
      const respuestas = await this.obtenerRespuestasUsuarioUseCase.execute(usuarioId);
      res.status(200).json(respuestas);
    } catch (error) {
      res.status(400).json({ error: error});
    }
  }

  async obtenerEstadisticasLeccion(req: Request, res: Response): Promise<void> {
    try {
      const { leccionId } = req.params;
      const dto: EstadisticasLeccionDto = { leccionId };
      const estadisticas = await this.obtenerEstadisticasLeccionUseCase.execute(dto);
      res.status(200).json(estadisticas);
    } catch (error) {
      res.status(400).json({ error: error});
    }
  }
}