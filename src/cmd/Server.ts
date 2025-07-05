import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "../Config/Cors/Cors.config";
import { router } from "../infrastructure/HTTP/Routers/router";

export const app = express();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/usuarios", router);
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
