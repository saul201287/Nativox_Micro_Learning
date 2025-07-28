// src/application/UseCases/CrearAnaliticaLlmAutomaticoUseCase.ts
import { AnaliticaLlmEntity } from "../../Config/db/entities/AnaliticaLlmEntity";
import { AnaliticaLlmRepository } from "../../domain/Ports/AnaliticaLlmRepository";
import { LeccionRepository } from "../../domain/Ports/LeccionRepository";
import { UsuarioNotificableRepository } from "../../domain/Ports/UsuarioNotificableRepository";
import { RespuestaUsuarioRepository } from "../../domain/Ports/RespuestaUsuarioRepository";
import { CrearAnaliticaLlmAutomaticoDto } from "../DTOs/CrearAnaliticaLlmAutomaticoDto";

export class CrearAnaliticaLlmAutomaticoUseCase {
  constructor(
    private readonly analiticaLlmRepository: AnaliticaLlmRepository,
    private readonly usuarioNotificableRepository: UsuarioNotificableRepository,
    private readonly leccionRepository: LeccionRepository,
    private readonly respuestaUsuarioRepository: RespuestaUsuarioRepository
  ) {}

  async execute(dto: CrearAnaliticaLlmAutomaticoDto): Promise<AnaliticaLlmEntity> {
    try {
      // 1. Obtener la información del usuario notificable
      const usuarioNotificable = await this.usuarioNotificableRepository.findById(dto.usuarioId);
      if (!usuarioNotificable) {
        throw new Error("Usuario no encontrado en la tabla de notificables");
      }

      // 2. Obtener todas las lecciones
      const lecciones = await this.leccionRepository.findAll();
      
      // 3. Calcular el total de lecciones completadas
      let totalLeccionesCompletadas = 0;
      
      for (const leccion of lecciones) {
        const respuestas = await this.respuestaUsuarioRepository.findByUsuarioId(dto.usuarioId);
        const progreso = leccion.calcularProgreso(dto.usuarioId, respuestas);
        
        if (progreso >= 100) {
          totalLeccionesCompletadas++;
        }
      }

      // 4. Obtener la última fecha de actividad del usuario
      const respuestas = await this.respuestaUsuarioRepository.findByUsuarioId(dto.usuarioId);
      let ultimaFechaActividad = new Date(0); // Fecha mínima
      
      if (respuestas.length > 0) {
        // Asumiendo que las respuestas tienen una propiedad 'fecha' de tipo Date
        ultimaFechaActividad = respuestas.reduce((latest, respuesta) => {
          const fechaRespuesta = new Date(respuesta.getTimestamp());
          return fechaRespuesta > latest ? fechaRespuesta : latest;
        }, new Date(0));
      }

      // 5. Crear o actualizar el registro de analítica
      const analitica = new AnaliticaLlmEntity();
      analitica.usuario_id = dto.usuarioId;
      analitica.fecha_registro = usuarioNotificable.timestamp || new Date();
      analitica.ultima_fecha_de_actividad = ultimaFechaActividad.getTime() > 0 ? 
        ultimaFechaActividad : 
        (usuarioNotificable.timestamp || new Date());
      analitica.total_lecciones_completadas = totalLeccionesCompletadas;

      // Verificar si ya existe un registro para este usuario
      const usuario = await this.analiticaLlmRepository.findByUsuarioId(dto.usuarioId);
      
      if (usuario) {
        // Actualizar el registro existente
        analitica.uid = usuario.usuarioId;
        return this.analiticaLlmRepository.update(analitica);
      } else {
        // Crear un nuevo registro
        return this.analiticaLlmRepository.create(analitica);
      }
    } catch (error) {
      console.error("Error al crear analítica automática:", error);
      throw new Error("Error al crear analítica automática");
    }
  }
}