import { Request, Response } from "express";
import { CrearEjercicioUseCase } from "../../../application/UseCases/CrearEjercicioUseCase";
import { ActualizarEjercicioUseCase } from "../../../application/UseCases/ActualizarEjercicioUseCase";
import { ListarEjerciciosPorLeccionUseCase } from "../../../application/UseCases/ListarEjerciciosPorLeccionUseCase";
import { ObtenerEjercicioUseCase } from "../../../application/UseCases/ObtenerEjercicioUseCase";
import { ObtenerRespuestasPorEjercicioUseCase } from "../../../application/UseCases/ObtenerRespuestasPorEjercicioUseCase";
import { CrearEjercicioDto } from "../../../application/DTOs/CrearEjercicioDto";
import { ActualizarEjercicioDto } from "../../../application/DTOs/ActualizarEjercicioDto";

export class EjercicioController {
  constructor(
    private crearEjercicioUseCase: CrearEjercicioUseCase,
    private actualizarEjercicioUseCase: ActualizarEjercicioUseCase,
    private listarEjerciciosPorLeccionUseCase: ListarEjerciciosPorLeccionUseCase,
    private obtenerEjercicioUseCase: ObtenerEjercicioUseCase,
    private obtenerRespuestasPorEjercicioUseCase: ObtenerRespuestasPorEjercicioUseCase
  ) {}

  async crearEjercicio(req: Request, res: Response): Promise<void> {
    try {
      const dto: CrearEjercicioDto = req.body;
      const id = await this.crearEjercicioUseCase.execute(dto);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async actualizarEjercicio(req: Request, res: Response): Promise<void> {
    try {
      const { ejercicioId } = req.params;
      const dto: ActualizarEjercicioDto = req.body;
      await this.actualizarEjercicioUseCase.execute(ejercicioId, dto);
      res.status(200).json({ message: "Ejercicio actualizado" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async listarPorLeccion(req: Request, res: Response): Promise<void> {
    try {
      const { leccionId } = req.params;
      const ejercicios = await this.listarEjerciciosPorLeccionUseCase.execute(leccionId);
      res.status(200).json(ejercicios);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async obtenerEjercicio(req: Request, res: Response): Promise<void> {
    try {
      const { ejercicioId } = req.params;
      const ejercicio = await this.obtenerEjercicioUseCase.execute(ejercicioId);
      res.status(200).json(ejercicio);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  }

  async obtenerRespuestas(req: Request, res: Response): Promise<void> {
    try {
      const { ejercicioId } = req.params;
      const respuestas = await this.obtenerRespuestasPorEjercicioUseCase.execute(ejercicioId);
      res.status(200).json(respuestas);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}