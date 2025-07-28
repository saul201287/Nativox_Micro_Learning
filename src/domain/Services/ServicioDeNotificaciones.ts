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
    console.log("notificando lección completada a usuario:", usuario);
    if (!usuario) {
      console.error(`Usuario no encontrado: ${usuarioId}`);
      return;
    }

    const titulo = "¡Lección completada!";
    const mensaje = `¡Felicidades ${usuario.nombre}! Has completado la lección ${leccion}. Sigue aprendiendo.`;
    if (usuario.fcmToken != null && usuario.fcmToken != "web_platform_token") {
      console.log("enviando push a:", usuario.fcmToken);
      await this.enviarPush(usuario.fcmToken, titulo, mensaje);
    }
    console.log("enviando email a:", usuario.email);
    await this.enviarEmail(usuario.email, titulo, mensaje);
  }

  private async enviarPush(fcmToken: string, title: string, body: string) {
    await this.pushStrategy.sendPush(fcmToken, title, body);
  }

  private async enviarEmail(email: string, subject: string, body: string) {
    console.log("enviando email a:", email);
    
    await this.emailStrategy.sendEmail(email, subject, body);
  }
}
