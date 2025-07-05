import { ConsultarProgresoDto } from "../../../application/DTOs/ConsultarProgresoDto";
import { CrearLeccionDto } from "../../../application/DTOs/CrearLeccionDto";
import { ResolverEjercicioDto } from "../../../application/DTOs/ResolverEjercicioDto";
import { ConsultarProgresoUseCase } from "../../../application/UseCases/ConsultarProgresoUseCase";
import { CrearLeccionUseCase } from "../../../application/UseCases/CrearLeccionUseCase";
import { Request, Response } from 'express';
import { ResolverEjercicioUseCase } from "../../../application/UseCases/ResolverEjercicioUseCase";

export class LeccionController {
  constructor(
    private crearLeccionUseCase: CrearLeccionUseCase,
    private resolverEjercicioUseCase: ResolverEjercicioUseCase,
    private consultarProgresoUseCase: ConsultarProgresoUseCase
  ) {}

  async crearLeccion(req: Request, res: Response): Promise<void> {
    try {
      const dto: CrearLeccionDto = req.body;
      const id = await this.crearLeccionUseCase.execute(dto);
      res.status(201).json({ id });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async resolverEjercicio(req: Request, res: Response): Promise<void> {
    try {
      const { leccionId } = req.params;
      const dto: ResolverEjercicioDto = req.body;
      const respuesta = await this.resolverEjercicioUseCase.execute(leccionId, dto);
      res.status(200).json({
        id: respuesta.getId(),
        correcta: respuesta.esCorrecta(),
        timestamp: respuesta.getTimestamp()
      });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  async consultarProgreso(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, leccionId } = req.params;
      const dto: ConsultarProgresoDto = { usuarioId, leccionId };
      const progreso = await this.consultarProgresoUseCase.execute(dto);
      res.status(200).json({ progreso });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}
