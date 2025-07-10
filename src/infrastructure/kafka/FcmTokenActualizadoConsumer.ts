import { Kafka } from "kafkajs";
import { UsuarioNotificableRepository } from "../../domain/Ports/UsuarioNotificableRepository";

export class FcmTokenActualizadoConsumer {
  constructor(
    private readonly kafka: Kafka,
    private readonly usuarioRepo: UsuarioNotificableRepository
  ) {}

  async start() {
    const consumer = this.kafka.consumer({ groupId: "notificaciones-fcm" });
    await consumer.connect();
    await consumer.subscribe({ topic: "user-domain-events", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const data = JSON.parse(message.value.toString());

        if (data.eventType !== "FcmTokenActualizado") return;

        const usuario = await this.usuarioRepo.findById(data.usuarioId);
        if (usuario) {
          usuario.fcmToken = data.fcmToken;
          await this.usuarioRepo.save(usuario);
          console.log("usuario actualizado: ", usuario.email);
        }else{
           console.log(" no se encontro este usuario: ", data.email);
        }
      },
    });
  }
}
