import { RespuestaUsuario } from "../../domain/Entities/RespuestaUsuario";
import { RespuestaEvaluadaEvent } from "../../domain/Events/DomainEvent";
import { EjercicioRepository } from "../../domain/Ports/EjercicioRepository";
import { EventPublisher } from "../../domain/Ports/EventPublisher";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { ServicioDeEvaluacion } from "../../domain/Services/ServicioDeEvaluacion";
import { EvaluarRespuestaCommand } from "../Commands/QueriesLectura";

export class EvaluarRespuestaUseCase {
  constructor(
    private readonly leccionRepository: LeccionRepository,
    private readonly ejercicioRepository: EjercicioRepository,
    private readonly respuestaRepository: RespuestaUsuarioRepository,
    private readonly servicioEvaluacion: ServicioDeEvaluacion,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: EvaluarRespuestaCommand): Promise<RespuestaUsuario> {
    // Buscar ejercicio
    const ejercicio = await this.ejercicioRepository.findById(
      command.ejercicioId
    );
    if (!ejercicio) {
      throw new Error(`Ejercicio no encontrado: ${command.ejercicioId}`);
    }

    // Evaluar respuesta
    const esCorrecta = this.servicioEvaluacion.calcularRespuestaCorrecta(
      ejercicio,
      command.respuesta
    );

    const resultado = this.servicioEvaluacion.generarResultado(
      esCorrecta,
      command.tiempoRespuesta
    );

    // Crear respuesta de usuario
    const respuestaUsuario = new RespuestaUsuario(
      command.respuestaId,
      command.usuarioId,
      command.ejercicioId,
      command.respuesta,
      resultado
    );

    // Guardar
    await this.respuestaRepository.save(respuestaUsuario);

    // Publicar evento
    const event = new RespuestaEvaluadaEvent(
      `resp-${Date.now()}`,
      ejercicio.getLeccionId(),
      new Date(),
      {
        usuarioId: command.usuarioId,
        ejercicioId: command.ejercicioId,
        esCorrecta,
        tiempoRespuesta: command.tiempoRespuesta,
      }
    );

    await this.eventPublisher.publish(event);

    return respuestaUsuario;
  }
}
