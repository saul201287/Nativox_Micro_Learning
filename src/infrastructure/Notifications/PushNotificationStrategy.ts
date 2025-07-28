import admin from "../../Config/firebase/admin";

export class PushNotificationStrategy {
  async sendPush(fcmToken: string, title: string, body: string): Promise<void> {
    try {
      console.log("Enviando push a:", fcmToken);
      const message = {
        token: fcmToken,
        notification: {
          title,
          body,
        },
      };
      await admin.messaging().send(message);
    } catch (error) {
      console.error(`Error al enviar push2: ${error}`);
      throw error;
    }
  }
}
