import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { EjercicioEntity } from "./EjercicioEntity";

@Entity("respuestas_usuario")
@Index("idx_usuario_ejercicio", ["usuario_id", "ejercicio_id"])
@Index("idx_usuario_timestamp", ["usuario_id", "timestamp"])
export class RespuestaUsuarioEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  usuario_id!: string;

  @Column({ type: "uuid" })
  ejercicio_id!: string;

  @Column({ type: "text" })
  respuesta_dada!: string;

  @Column({ type: "boolean", default: false })
  correcta!: boolean;

  @Column({ type: "int", default: 0 })
  tiempo_respuesta!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp!: Date;

  @ManyToOne(() => EjercicioEntity, (ejercicio) => ejercicio.respuestas, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ejercicio_id" })
  ejercicio!: EjercicioEntity;
}
