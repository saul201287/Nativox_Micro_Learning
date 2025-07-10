import { UsuarioNotificableRepository } from "../Ports/UsuarioNotificableRepository";
import { EmailNotificationStrategy } from "../../infrastructure/Notifications/EmailNotificationStrategy";
import { PushNotificationStrategy } from "../../infrastructure/Notifications/PushNotificationStrategy";

export class ServicioDeNotificaciones {
  constructor(
    private readonly usuarioRepo: UsuarioNotificableRepository,
    private readonly emailStrategy: EmailNotificationStrategy,
    private readonly pushStrategy: PushNotificationStrategy
  ) {}

  async notificarLeccionCompletada(usuarioId: string, leccion: string) {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) return;

    const titulo = "¡Lección completada!";
    const mensaje = `¡Felicidades ${usuario.nombre}! Has completado la lección ${leccion}. Sigue aprendiendo.`;

    await this.enviarPush(usuario.fcmToken, titulo, mensaje);
    await this.enviarEmail(usuario.email, titulo, mensaje);
  }

  private async enviarPush(fcmToken: string, title: string, body: string) {
    await this.pushStrategy.sendPush(fcmToken, title, body);
  }

  private async enviarEmail(email: string, subject: string, body: string) {
    await this.emailStrategy.sendEmail(email, subject, body);
  }
}
