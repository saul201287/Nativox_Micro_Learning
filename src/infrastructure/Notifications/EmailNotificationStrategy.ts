import nodemailer from "nodemailer";

export class EmailNotificationStrategy {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: Number(process.env.PORT_EMAIL),
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.USER_EMAIL ?? "no-reply@microservicio.com",
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });
  }
}

