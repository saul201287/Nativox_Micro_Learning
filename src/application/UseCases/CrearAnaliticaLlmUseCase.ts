import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";
import { AnaliticaLlmRepository } from "../../domain/Ports/AnaliticaLlmRepository";

export class CrearAnaliticaLlmUseCase {
  private readonly analiticaLlmRepository: AnaliticaLlmRepository;

  constructor(analiticaLlmRepository: AnaliticaLlmRepository) {
    this.analiticaLlmRepository = analiticaLlmRepository;
  }

  async execute(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity> {
    try {
      return this.analiticaLlmRepository.create(analitica);
    } catch (error) {
      throw new Error("Error al crear la analítica");
    }
  }
}
