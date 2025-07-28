import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";
import { ConsultarProgresoUseCase } from "../application/UseCases/ConsultarProgresoUseCase";
import { CrearLeccionUseCase } from "../application/UseCases/CrearLeccionUseCase";
import { ResolverEjercicioUseCase } from "../application/UseCases/ResolverEjercicioUseCase";
import { ServicioDeEvaluacionImpl } from "../domain/Services/ServicioDeEvaluacion";
import { ServicioDeProgresoImpl } from "../domain/Services/ServicioDeProgreso";
import { SagaCompensationServiceImpl } from "../domain/Services/SagaCompensationService";
import { KafkaEventPublisher } from "./Adapters/KafkaEventPublisher";
import { TypeOrmEjercicioRepository } from "./Adapters/TypeOrmEjercicioRepository";
import { TypeOrmLeccionRepository } from "./Adapters/TypeOrmLeccionRepository";
import { TypeOrmRespuestaUsuarioRepository } from "./Adapters/TypeOrmRespuestaUsuarioRepository";
import { SagaEventHandler } from "./Adapters/SagaEventHandler";
import { KafkaClient } from "./kafka/KafkaClient";
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
import { LeccionQueryController } from "./HTTP/Controllers/LeccionQueryController";
import { UsuarioController } from "./HTTP/Controllers/UsuarioController";
import { TypeOrmUsuarioNotificableRepository } from "./Adapters/TypeOrmUsuarioNotificableRepository";
import { TypeOrmAnaliticaLlmRepository } from "./Adapters/TypeOrmAnaliticaLlmRepository";
import { EmailNotificationStrategy } from "./Notifications/EmailNotificationStrategy";
import { PushNotificationStrategy } from "./Notifications/PushNotificationStrategy";
import { ServicioDeNotificaciones } from "../domain/Services/ServicioDeNotificaciones";
import { ActualizarProgresoUseCase } from "../application/UseCases/ActualizarProgresoUseCase";
import { FcmTokenActualizadoConsumer } from "./kafka/FcmTokenActualizadoConsumer";
import { UsuarioRegistradoConsumer } from "./kafka/UsuarioRegistradoConsumer";
import { CrearAnaliticaLlmUseCase } from "../application/UseCases/CrearAnaliticaLlmUseCase";
import { ListarAnaliticaLlmUseCase } from "../application/UseCases/ListarAnaliticaLlmUseCase";
import { AnaliticaLlmController } from "./HTTP/Controllers/AnaliticaLlmController";
import { CrearAnaliticaLlmAutomaticoUseCase } from "../application/UseCases/CrearAnaliticaLlmAutomaticoUseCase";

dotenv.config();

const dataSource = database.getDataSource();

if (!process.env.CLIENT_KAFKA_ID || !process.env.BROKER) {
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

const sagaCompensationService = new SagaCompensationServiceImpl(
  ejercicioRepository,
  leccionRepository,
  respuestaRepository,
  eventPublisher
);

const kafkaClient = new KafkaClient([process.env.BROKER || 'localhost:9092']);
const sagaEventHandler = new SagaEventHandler(kafkaClient, sagaCompensationService);

const usuarioNotificableRepository = new TypeOrmUsuarioNotificableRepository(dataSource);
const analiticaLlmRepository = new TypeOrmAnaliticaLlmRepository(dataSource);
const emailNotificationStrategy = new EmailNotificationStrategy();
const pushNotificationStrategy = new PushNotificationStrategy();

export const servicioDeNotificaciones = new ServicioDeNotificaciones(
  usuarioNotificableRepository,
  emailNotificationStrategy,
  pushNotificationStrategy
);

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
const actualizarProgresoUseCase = new ActualizarProgresoUseCase(
  leccionRepository,
  respuestaRepository,
  servicioProgreso,
  eventPublisher,
  servicioDeNotificaciones
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
const crearAnaliticaLlmUseCase = new CrearAnaliticaLlmUseCase(
  analiticaLlmRepository
);
const listarAnaliticaLlmUseCase = new ListarAnaliticaLlmUseCase(
  analiticaLlmRepository
);
const crearAnaliticaLlmAutomaticoUseCase = new CrearAnaliticaLlmAutomaticoUseCase(
  analiticaLlmRepository,
  usuarioNotificableRepository,
  leccionRepository,
  respuestaRepository
);
export const analiticaLlmController = new AnaliticaLlmController(
  crearAnaliticaLlmUseCase,
  listarAnaliticaLlmUseCase,
  crearAnaliticaLlmAutomaticoUseCase
);

export const leccionController = new LeccionController(
  crearLeccionUseCase,
  resolverEjercicioUseCase,
  consultarProgresoUseCase,
  actualizarProgresoUseCase
);

export const ejerciciosController = new EjercicioController(
  crearEjercicioUseCase,
  actualizarEjercicioUseCase,
  listarEjerciciosPorLeccionUseCase,
  obtenerEjercicioUseCase,
  obtenerRespuestasPorEjercicioUseCase
);

export const leccionQueryController = new LeccionQueryController(
  obtenerLeccionUseCase,
  listarLeccionesUseCase,
  actualizarLeccionUseCase
);

export const usuarioController = new UsuarioController(
  obtenerRespuestasUsuarioUseCase,
  obtenerEstadisticasLeccionUseCase
);

export { sagaEventHandler };

const fcmTokenActualizadoConsumer = new FcmTokenActualizadoConsumer(
  kafka,
  usuarioNotificableRepository
);
const usuarioRegistradoConsumer = new UsuarioRegistradoConsumer(
  kafka,
  usuarioNotificableRepository
);

usuarioRegistradoConsumer.start();
fcmTokenActualizadoConsumer.start();
