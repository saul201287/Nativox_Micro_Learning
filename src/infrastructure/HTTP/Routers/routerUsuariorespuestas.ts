import { Router } from "express";
import { usuarioController, analiticaLlmController } from "../../Dependencies";
import { authMiddleware } from "../../../shared/Middleware/auth-middleware";

export const routerUserResponse = Router();

routerUserResponse.get(
  "/usuarios/:usuarioId/respuestas",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    usuarioController
      .obtenerRespuestasUsuario(req, res)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: err.message, msg: "Error en el servidor" });
      });
  }
);

routerUserResponse.get(
  "/lecciones/:leccionId/estadisticas",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    usuarioController
      .obtenerEstadisticasLeccion(req, res)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        res
          .status(500)
          .send({ error: err.message, msg: "Error en el servidor" });
      });
  }
);

routerUserResponse.get("/analiticas_llm", (req, res) => {
  analiticaLlmController
    .getAll(req, res)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      res.status(500).send({ error: err.message, msg: "Error en el servidor" });
    });
});

routerUserResponse.post("/analiticas_llm", (req, res) => {
  analiticaLlmController
    .create(req, res)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      res.status(500).send({ error: err.message, msg: "Error en el servidor" });
    });
});