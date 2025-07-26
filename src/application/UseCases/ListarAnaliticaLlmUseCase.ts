import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";
import { AnaliticaLlmRepository } from "../../domain/Ports/AnaliticaLlmRepository";

export class ListarAnaliticaLlmUseCase {
  private readonly analiticaLlmRepository: AnaliticaLlmRepository;

  constructor(analiticaLlmRepository: AnaliticaLlmRepository) {
    this.analiticaLlmRepository = analiticaLlmRepository;
  }

  async execute(): Promise<AnaliticaLlmEntity[]> {
    try {
       return this.analiticaLlmRepository.findAll();
    } catch (error) {
       throw new Error("Error al listar las analíticas");
    }
   
  }
}
