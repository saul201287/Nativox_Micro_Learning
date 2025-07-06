import { KafkaClient } from "../kafka/KafkaClient";
import { SagaCompensationService } from "../../domain/Services/SagaCompensationService";

export class SagaEventHandler {
  private readonly kafkaClient: KafkaClient;
  private readonly compensationService: SagaCompensationService;

  constructor(kafkaClient: KafkaClient, compensationService: SagaCompensationService) {
    this.kafkaClient = kafkaClient;
    this.compensationService = compensationService;
  }

  async startListening(): Promise<void> {
    await this.kafkaClient.connectConsumer();
    await this.kafkaClient.subscribe("learning-events");
    
    await this.kafkaClient.runConsumer(async (message) => {
      await this.handleEvent(message);
    });
  }

  private async handleEvent(message: any): Promise<void> {
    try {
      const eventData = JSON.parse(message.value);
      const eventName = eventData.eventName;

      console.log(`[SAGA] Procesando evento: ${eventName}`);

      switch (eventName) {
        case "EjercicioCreadoSagaFailed":
          await this.handleEjercicioCreadoSagaFailed(eventData.payload);
          break;
        case "EjercicioResueltoSagaFailed":
          await this.handleEjercicioResueltoSagaFailed(eventData.payload);
          break;
        case "ProgresoActualizadoSagaFailed":
          await this.handleProgresoActualizadoSagaFailed(eventData.payload);
          break;
        default:
          console.log(`[SAGA] Evento no manejado: ${eventName}`);
      }
    } catch (error) {
      console.error(`[SAGA] Error procesando evento: ${error}`);
    }
  }

  private async handleEjercicioCreadoSagaFailed(payload: any): Promise<void> {
    try {
      console.log(`[SAGA] Ejecutando compensación para EjercicioCreadoSagaFailed`);
      
      const { ejercicioId, leccionId } = payload;
      
      if (ejercicioId && leccionId) {
        await this.compensationService.compensarCreacionEjercicio(ejercicioId, leccionId);
      }
    } catch (error) {
      console.error(`[SAGA] Error en compensación de EjercicioCreadoSagaFailed: ${error}`);
    }
  }

  private async handleEjercicioResueltoSagaFailed(payload: any): Promise<void> {
    try {
      console.log(`[SAGA] Ejecutando compensación para EjercicioResueltoSagaFailed`);
      
      const { respuestaId, ejercicioId } = payload;
      
      if (respuestaId && ejercicioId) {
        await this.compensationService.compensarResolucionEjercicio(respuestaId, ejercicioId);
      }
    } catch (error) {
      console.error(`[SAGA] Error en compensación de EjercicioResueltoSagaFailed: ${error}`);
    }
  }

  private async handleProgresoActualizadoSagaFailed(payload: any): Promise<void> {
    try {
      console.log(`[SAGA] Ejecutando compensación para ProgresoActualizadoSagaFailed`);
      
      const { usuarioId, leccionId } = payload;
      
      if (usuarioId && leccionId) {
        await this.compensationService.compensarActualizacionProgreso(usuarioId, leccionId);
      }
    } catch (error) {
      console.error(`[SAGA] Error en compensación de ProgresoActualizadoSagaFailed: ${error}`);
    }
  }

  async stopListening(): Promise<void> {
    await this.kafkaClient.disconnectConsumer();
  }
} 