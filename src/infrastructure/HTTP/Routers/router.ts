import express from "express";
import { leccionController, ejerciciosController} from "../../Dependencies";

export const router = express.Router();

router.post(
  "/lecciones",
  leccionController.crearLeccion.bind(leccionController)
);
router.post(
  "/lecciones/:leccionId/ejercicios/resolver",
  leccionController.resolverEjercicio.bind(leccionController)
);
router.get(
  "/usuarios/:usuarioId/lecciones/:leccionId/progreso",
  leccionController.consultarProgreso.bind(leccionController)
);
