import { Request, Response } from "express";
import { CrearAnaliticaLlmUseCase } from "../../../application/UseCases/CrearAnaliticaLlmUseCase";
import { AnaliticaLlmEntity } from "../../../Config/db/entities/AnaliticaLlmEntity";
import { ListarAnaliticaLlmUseCase } from "../../../application/UseCases/ListarAnaliticaLlmUseCase";

export class AnaliticaLlmController {
  private readonly crearAnaliticaLlmUseCase: CrearAnaliticaLlmUseCase;
  private readonly listarAnaliticaLlmUseCase: ListarAnaliticaLlmUseCase;

  constructor(
    crearAnaliticaLlmUseCase: CrearAnaliticaLlmUseCase,
    listarAnaliticaLlmUseCase: ListarAnaliticaLlmUseCase
  ) {
    this.crearAnaliticaLlmUseCase = crearAnaliticaLlmUseCase;
    this.listarAnaliticaLlmUseCase = listarAnaliticaLlmUseCase;
  }

  async create(request: Request, response: Response) {
    try {
      const analiticaLlm = new AnaliticaLlmEntity();
      analiticaLlm.fecha_registro = request.body.fecha_registro;
      analiticaLlm.total_lecciones_completadas =
        request.body.total_lecciones_completadas;
      analiticaLlm.ultima_fecha_de_actividad =
        request.body.ultima_fecha_de_actividad;

      const analiticaLlmCreada =
        await this.crearAnaliticaLlmUseCase.execute(analiticaLlm);
      response.status(201).json(analiticaLlmCreada);
    } catch (error) {
      console.error("Error al crear la analítica LLM:", error);
      response.status(500).json({ message: error });
    }
  }

  async getAll(request: Request, response: Response) {
    try {
      const analiticasLlm = await this.listarAnaliticaLlmUseCase.execute();
      response.status(200).json(analiticasLlm);
    } catch (error) {
      console.error("Error al listar las analíticas LLM:", error);
      response.status(500).json({ message: error });
    }
  }
}
