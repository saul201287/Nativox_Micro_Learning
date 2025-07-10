import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "usuarios_notificables" })
export class UsuarioNotificableEntity {
  @PrimaryColumn()
  usuarioId!: string;

  @Column()
  email!: string;

  @Column()
  nombre!: string;

  @Column()
  fcmToken!: string;
}
