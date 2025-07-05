import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { LeccionEntity } from "./LeccionEntity";
import { RespuestaUsuarioEntity } from "./RespuestaUsuarioEntity";

@Entity("ejercicios")
export class EjercicioEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  leccion_id!: string;

  @Column({
    type: "enum",
    enum: ["selección", "rellenar", "verdadero_falso", "ordenar"],
    default: "selección",
  })
  tipo!: string;

  @Column({ type: "text" })
  enunciado!: string;

  @Column({ type: "json", nullable: true })
  opciones_json: any;

  @Column({ type: "text" })
  respuesta_correcta!: string;

  @Column({ type: "int", default: 0 })
  orden!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @ManyToOne(() => LeccionEntity, (leccion) => leccion.ejercicios, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "leccion_id" })
  leccion: LeccionEntity = new LeccionEntity();

  @OneToMany(() => RespuestaUsuarioEntity, (respuesta) => respuesta.ejercicio)
  respuestas!: RespuestaUsuarioEntity[];
}
