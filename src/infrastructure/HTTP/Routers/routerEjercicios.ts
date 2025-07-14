import { Router } from "express";
import { ejerciciosController } from "../../Dependencies";
import { authMiddleware } from "../../../shared/middleware/auth-middleware";

export const routerEjercicios = Router();

routerEjercicios.post(
  "/ejercicios",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    ejerciciosController
      .crearEjercicio(req, res)
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

routerEjercicios.put(
  "/ejercicios/:ejercicioId",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    ejerciciosController
      .actualizarEjercicio(req, res)
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

routerEjercicios.get(
  "/lecciones/:leccionId/ejercicios",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    ejerciciosController
      .listarPorLeccion(req, res)
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

routerEjercicios.get(
  "/ejercicios/:ejercicioId",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    ejerciciosController
      .obtenerEjercicio(req, res)
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

routerEjercicios.get(
  "/ejercicios/:ejercicioId/respuestas",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    ejerciciosController
      .obtenerRespuestas(req, res)
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
