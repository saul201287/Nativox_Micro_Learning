import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";

export interface AnaliticaLlmRepository {
  create(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity>;
  findByUid(uid: string): Promise<AnaliticaLlmEntity | null>;
  update(analitica: AnaliticaLlmEntity): Promise<AnaliticaLlmEntity>;
  findAll(): Promise<AnaliticaLlmEntity[]>;
}
