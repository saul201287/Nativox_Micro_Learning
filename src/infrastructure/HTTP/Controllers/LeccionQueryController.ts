import { Request, Response } from "express";
import { ObtenerLeccionUseCase } from "../../../application/UseCases/ObtenerLeccionUseCase";
import { ListarLeccionesUseCase } from "../../../application/UseCases/ListarLeccionesUseCase";
import { ActualizarLeccionUseCase } from "../../../application/UseCases/ActualizarLeccionUseCase";
import { FiltrosLeccionDto } from "../../../application/DTOs/FiltrosLeccionDto";
import { ActualizarLeccionDto } from "../../../application/DTOs/ActualizarLeccionDto";

export class LeccionQueryController {
  constructor(
    private obtenerLeccionUseCase: ObtenerLeccionUseCase,
    private listarLeccionesUseCase: ListarLeccionesUseCase,
    private actualizarLeccionUseCase: ActualizarLeccionUseCase
  ) {}

  async obtenerLeccion(req: Request, res: Response): Promise<void> {
    try {
      const { leccionId } = req.params;
      const leccion = await this.obtenerLeccionUseCase.execute(leccionId);
      res.status(200).json(leccion);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  }

  async listarLecciones(req: Request, res: Response): Promise<void> {
    try {
      const filtros: FiltrosLeccionDto = req.query;
      const lecciones = await this.listarLeccionesUseCase.execute(filtros);
      
      res.status(200).json({
        success: true,
        data: lecciones,
        count: lecciones.length,
        message: "Lecciones obtenidas exitosamente"
      });
    } catch (error) {
      console.error("Error al listar lecciones:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor",
        message: "Error al obtener las lecciones"
      });
    }
  }

  async actualizarLeccion(req: Request, res: Response): Promise<void> {
    try {
      const { leccionId } = req.params;
      const dto: ActualizarLeccionDto = req.body;
      await this.actualizarLeccionUseCase.execute(leccionId, dto);
      res.status(200).json({ message: "Lección actualizada" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}