import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EjercicioEntity } from "./EjercicioEntity";

@Entity("lecciones")
export class LeccionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({
    type: "enum",
    enum: ["básico", "intermedio"],
    default: "básico",
  })
  nivel!: string;

  @Column({ type: "json" })
  contenido_json: any;

  @Column({
    type: "enum",
    enum: ["tzeltal", "zapoteco"],
    default: "tzeltal",
  })
  idioma!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @OneToMany(() => EjercicioEntity, (ejercicio) => ejercicio.leccion)
  ejercicios!: EjercicioEntity[];
}
