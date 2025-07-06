import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "../Config/Cors/Cors.config";
import { routerLecciones } from "../infrastructure/HTTP/Routers/routerLeccion";
import { routerEjercicios } from "../infrastructure/HTTP/Routers/routerEjercicios"
import { routerUserResponse } from "../infrastructure/HTTP/Routers/routerUsuariorespuestas";

export const app = express();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lecciones", routerLecciones);
app.use("/ejercicios", routerEjercicios);
app.use("/userResponse", routerUserResponse);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

