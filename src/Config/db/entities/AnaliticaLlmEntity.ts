import { Entity, PrimaryColumn, Column, ObjectIdColumn, Generated } from "typeorm";

@Entity("analitica_llm")
export class AnaliticaLlmEntity {
  @PrimaryColumn()
  @Generated("uuid")
  uid!: string;

  @Column({ type: "varchar", length: 100 })
  usuario_id!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_registro!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  ultima_fecha_de_actividad!: Date;

  @Column({ type: "int", default: 0 })
  total_lecciones_completadas!: number;
}
