import { EjercicioEntity } from "../Config/db/entities/EjercicioEntity";
import { LeccionEntity } from "../Config/db/entities/LeccionEntity";
import { RespuestaUsuarioEntity } from "../Config/db/entities/RespuestaUsuarioEntity";
import { Leccion } from "../domain/Aggregates/Leccion";
import { Ejercicio } from "../domain/Entities/Ejercicio";
import { RespuestaUsuario } from "../domain/Entities/RespuestaUsuario";
import { ContenidoEjercicio } from "../domain/ObjetValues/ContenidoEjercicio";
import { NivelDificultad } from "../domain/ObjetValues/NivelDificultad";
import { ResultadoRespuesta } from "../domain/ObjetValues/ResultadoRespuesta";

export class LeccionMapper {
  static toDomain(entity: LeccionEntity): Leccion {
    const nivel = NivelDificultad.fromString(entity.nivel);
    const leccion = new Leccion(
      entity.id,
      entity.titulo,
      nivel,
      entity.contenido_json,
      entity.idioma
    );

    if (entity.ejercicios) {
      entity.ejercicios.forEach((ejercicioEntity) => {
        const ejercicio = EjercicioMapper.toDomain(ejercicioEntity);
        leccion.agregarEjercicio(ejercicio);
      });
    }

    return leccion;
  }

  static toEntity(leccion: Leccion): LeccionEntity {
    const entity = new LeccionEntity();
    entity.id = leccion.getId();
    entity.titulo = leccion.getTitulo();
    entity.nivel = leccion.getNivel().getValue();
    entity.contenido_json = leccion.getContenidoJson();
    entity.idioma = leccion.getIdioma();
    return entity;
  }
}

export class EjercicioMapper {
  static toDomain(entity: EjercicioEntity): Ejercicio {
    const contenido = new ContenidoEjercicio(
      entity.enunciado,
      entity.opciones_json.imagenes || [],
      entity.opciones_json.opciones || []
    );

    return new Ejercicio(
      entity.id,
      entity.leccion_id,
      entity.tipo,
      entity.enunciado,
      contenido,
      entity.respuesta_correcta
    );
  }

  static toEntity(ejercicio: Ejercicio): EjercicioEntity {
    const entity = new EjercicioEntity();
    entity.id = ejercicio.getId();
    entity.leccion_id = ejercicio.getLeccionId();
    entity.tipo = ejercicio.getTipo();
    entity.enunciado = ejercicio.getEnunciado();
    entity.opciones_json = {
      imagenes: ejercicio.getContenido().getImagenes(),
      opciones: ejercicio.getContenido().getOpciones(),
    };
    entity.respuesta_correcta = ejercicio.getContenido().getTexto();
    return entity;
  }
}

export class RespuestaUsuarioMapper {
  static toDomain(entity: RespuestaUsuarioEntity): RespuestaUsuario {
    const resultado = new ResultadoRespuesta(entity.correcta, 0); 
    
    return new RespuestaUsuario(
      entity.id,
      entity.usuario_id,
      entity.ejercicio_id,
      entity.respuesta_dada,
      resultado,
      entity.timestamp
    );
  }

  static toEntity(respuesta: RespuestaUsuario): RespuestaUsuarioEntity {
    const entity = new RespuestaUsuarioEntity();
    entity.id = respuesta.getId();
    entity.usuario_id = respuesta.getUsuarioId();
    entity.ejercicio_id = respuesta.getEjercicioId();
    entity.respuesta_dada = respuesta.getRespuestaDada();
    entity.correcta = respuesta.esCorrecta();
    entity.timestamp = respuesta.getTimestamp();
    return entity;
  }
}
