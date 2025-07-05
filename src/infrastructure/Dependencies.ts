import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";
import { ConsultarProgresoUseCase } from "../application/UseCases/ConsultarProgresoUseCase";
import { CrearLeccionUseCase } from "../application/UseCases/CrearLeccionUseCase";
import { ResolverEjercicioUseCase } from "../application/UseCases/ResolverEjercicioUseCase";
import { ServicioDeEvaluacionImpl } from "../domain/Services/ServicioDeEvaluacion";
import { ServicioDeProgresoImpl } from "../domain/Services/ServicioDeProgreso";
import { KafkaEventPublisher } from "./Adapters/KafkaEventPublisher";
import { TypeOrmEjercicioRepository } from "./Adapters/TypeOrmEjercicioRepository";
import { TypeOrmLeccionRepository } from "./Adapters/TypeOrmLeccionRepository";
import { TypeOrmRespuestaUsuarioRepository } from "./Adapters/TypeOrmRespuestaUsuarioRepository";
import { LeccionController } from "./HTTP/Controllers/LeccionControlle";
import { database } from "../Config/db/connect";
import { ObtenerLeccionUseCase } from "../application/UseCases/ObtenerLeccionUseCase";
import { ListarLeccionesUseCase } from "../application/UseCases/ListarLeccionesUseCase";
import { CrearEjercicioUseCase } from "../application/UseCases/CrearEjercicioUseCase";
import { ActualizarLeccionUseCase } from "../application/UseCases/ActualizarLeccionUseCase";
import { ActualizarEjercicioUseCase } from "../application/UseCases/ActualizarEjercicioUseCase";
import { ListarEjerciciosPorLeccionUseCase } from "../application/UseCases/ListarEjerciciosPorLeccionUseCase";
import { ObtenerEjercicioUseCase } from "../application/UseCases/ObtenerEjercicioUseCase";
import { ObtenerRespuestasPorEjercicioUseCase } from "../application/UseCases/ObtenerRespuestasPorEjercicioUseCase";
import { ObtenerRespuestasUsuarioUseCase } from "../application/UseCases/ObtenerRespuestasUsuarioUseCase";
import { ObtenerEstadisticasLeccionUseCase } from "../application/UseCases/ObtenerEstadisticasLeccionUseCase";
import { EjercicioController } from "./HTTP/Controllers/EjercicioController";

dotenv.config();

const dataSource = database.getDataSource();

if (!process.env.CLIENT_ID || !process.env.BROKER) {
  throw new Error("Credenciales de Kafka nulas");
}

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID,
  brokers: [process.env.BROKER],
});

export const eventPublisher = new KafkaEventPublisher(kafka);

dataSource.initialize();
eventPublisher.connect();

const leccionRepository = new TypeOrmLeccionRepository(dataSource);
const ejercicioRepository = new TypeOrmEjercicioRepository(dataSource);
const respuestaRepository = new TypeOrmRespuestaUsuarioRepository(dataSource);

const servicioEvaluacion = new ServicioDeEvaluacionImpl();
const servicioProgreso = new ServicioDeProgresoImpl(respuestaRepository);

// Use Cases
const crearLeccionUseCase = new CrearLeccionUseCase(
  leccionRepository,
  eventPublisher
);
const resolverEjercicioUseCase = new ResolverEjercicioUseCase(
  leccionRepository,
  respuestaRepository,
  servicioEvaluacion,
  eventPublisher
);
const consultarProgresoUseCase = new ConsultarProgresoUseCase(
  leccionRepository,
  servicioProgreso,
  eventPublisher
);

const obtenerLeccionUseCase = new ObtenerLeccionUseCase(leccionRepository);
const listarLeccionesUseCase = new ListarLeccionesUseCase(leccionRepository);
const crearEjercicioUseCase = new CrearEjercicioUseCase(
  leccionRepository,
  ejercicioRepository,
  eventPublisher
);
const actualizarLeccionUseCase = new ActualizarLeccionUseCase(
  leccionRepository,
  eventPublisher
);
const actualizarEjercicioUseCase = new ActualizarEjercicioUseCase(
  ejercicioRepository,
  eventPublisher
);
const listarEjerciciosPorLeccionUseCase = new ListarEjerciciosPorLeccionUseCase(
  ejercicioRepository
);
const obtenerEjercicioUseCase = new ObtenerEjercicioUseCase(
  ejercicioRepository
);
const obtenerRespuestasPorEjercicioUseCase =
  new ObtenerRespuestasPorEjercicioUseCase(respuestaRepository);
const obtenerRespuestasUsuarioUseCase = new ObtenerRespuestasUsuarioUseCase(
  respuestaRepository
);
const obtenerEstadisticasLeccionUseCase = new ObtenerEstadisticasLeccionUseCase(
  leccionRepository,
  respuestaRepository
);

// Controllers
export const leccionController = new LeccionController(
  crearLeccionUseCase,
  resolverEjercicioUseCase,
  consultarProgresoUseCase
);

export const ejerciciosController = new EjercicioController(
  crearEjercicioUseCase,
  actualizarEjercicioUseCase,
  listarEjerciciosPorLeccionUseCase,
  obtenerEjercicioUseCase,
  obtenerRespuestasPorEjercicioUseCase
);
