import { Kafka } from "kafkajs";
import { UsuarioNotificableRepository } from "../../domain/Ports/UsuarioNotificableRepository";
import { UsuarioNotificableEntity } from "../../Config/db/entities/UsuarioNotificableEntity";

export class UsuarioRegistradoConsumer {
  constructor(
    private readonly kafka: Kafka,
    private readonly usuarioRepo: UsuarioNotificableRepository
  ) {}

  async start() {
    const consumer = this.kafka.consumer({ groupId: "notificaciones" });
    await consumer.connect();
    await consumer.subscribe({
      topic: "user-domain-events",
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const data = JSON.parse(message.value.toString());
        if (data.eventType !== "UsuarioRegistrado") return;
        const usuarioRegistrado = await this.usuarioRepo.findById(data.usuarioId);
        if (usuarioRegistrado) {
          console.log("usuarioRegistrado: ", usuarioRegistrado.email);
        }
        const usuario = new UsuarioNotificableEntity();
        usuario.usuarioId = data.usuarioId;
        usuario.email = data.email;
        usuario.nombre = data.nombre;
        usuario.fcmToken = data.fcmToken;
        await this.usuarioRepo.save(usuario);
        console.log("nuevo usuario registrado: ", usuario.email);
      },
    });
  }
}
