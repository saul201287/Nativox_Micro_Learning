import { Ejercicio } from "../Entities/Ejercicio";
import { ResultadoRespuesta } from "../ObjetValues/ResultadoRespuesta";

export interface ServicioDeEvaluacion {
  evaluarRespuesta(ejercicio: Ejercicio, respuesta: string): ResultadoRespuesta;
}

export class ServicioDeEvaluacionImpl implements ServicioDeEvaluacion {
  evaluarRespuesta(
    ejercicio: Ejercicio,
    respuesta: string
  ): ResultadoRespuesta {
    const inicioEvaluacion = Date.now();
    const esCorrecta = ejercicio.evaluarRespuesta(respuesta);
    const tiempoEvaluacion = Date.now() - inicioEvaluacion;

    return new ResultadoRespuesta(esCorrecta, tiempoEvaluacion);
  }
}
