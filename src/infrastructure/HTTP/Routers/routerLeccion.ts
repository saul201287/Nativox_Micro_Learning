import { Router } from "express";
import { leccionController, leccionQueryController } from "../../Dependencies";
import { authMiddleware } from "../../../shared/middleware/auth-middleware";

export const routerLecciones = Router();

routerLecciones.post(
  "/lecciones",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionController
      .crearLeccion(req, res)
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

routerLecciones.post(
  "/lecciones/:leccionId/ejercicios/resolver",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionController
      .resolverEjercicio(req, res)
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

routerLecciones.get(
  "/usuarios/:usuarioId/lecciones/:leccionId/progreso",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionController
      .consultarProgreso(req, res)
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

routerLecciones.post(
  "/usuarios/:usuarioId/lecciones/:leccionId/progreso/actualizar",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    req.body.usuarioId = req.params.usuarioId;
    req.body.leccionId = req.params.leccionId;
    leccionController
      .actualizarProgreso(req, res)
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

routerLecciones.get(
  "/lecciones/:leccionId",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionQueryController
      .obtenerLeccion(req, res)
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

routerLecciones.get(
  "/lecciones",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionQueryController
      .listarLecciones(req, res)
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

routerLecciones.put(
  "/lecciones/:leccionId",
  (req, res, next) => {
    authMiddleware(req, res, next);
  },
  (req, res) => {
    leccionQueryController
      .actualizarLeccion(req, res)
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
