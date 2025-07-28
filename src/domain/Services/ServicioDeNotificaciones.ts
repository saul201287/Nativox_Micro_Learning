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
    try {
      const usuario = await this.usuarioRepo.findById(usuarioId);
      console.log("notificandon a:", usuario);
      if (!usuario) {
        console.error(`Usuario no encontrado: ${usuarioId}`);
        return;
      }

      const titulo = "¡Lección completada!";
      const mensaje = `¡Felicidades ${usuario.nombre}! Has completado la lección ${leccion}. Sigue aprendiendo.`;
      console.log("enviando email a:", usuario.email);
      await this.enviarEmail(usuario.email, titulo, mensaje);
      if (usuario.fcmToken != "web_platform_token") {
        console.log("enviando push a:", usuario.fcmToken);
        await this.enviarPush(usuario.fcmToken, titulo, mensaje);
      }
    } catch (error) {
      console.error(`Error al notificar lección completada: ${error}`);
      throw error;
    }
  }

  private async enviarPush(fcmToken: string, title: string, body: string) {
    try {
      await this.pushStrategy.sendPush(fcmToken, title, body);
    } catch (error) {
      console.error(`Error al enviar push: ${error}`);
      throw error;
    }
  }

  private async enviarEmail(email: string, subject: string, body: string) {
    console.log("enviando email a:", email);

    await this.emailStrategy.sendEmail(email, subject, body);
  }
}
