import { app } from "./cmd/Server";
import helmet from "helmet";
import { Signale } from "signale";
import { database } from "./Config/db/connect";
import { eventPublisher } from "./infrastructure/Dependencies";

async function bootstrap() {
  try {
    await database.connect();
    const dataSource = database.getDataSource();

    app.use(helmet.hidePoweredBy());
    app.use(
      helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      })
    );

    app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        service: "usuario-service",
        database: dataSource.isInitialized ? "connected" : "disconnected",
      });
    });

    const port = process.env.PORT || 3000;
    const options = {
      secrets: ["([0-9]{4}-?)+"],
    };

    const logger = new Signale(options);
    const server = app.listen(port, () => {
      logger.success(`Server listening on port: ${port}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await eventPublisher.disconnect();
          await database.disconnect();
          console.log("Servidor cerrado exitosamente");
          process.exit(0);
        } catch (error) {
          console.error("Error durante el shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
