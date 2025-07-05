export class ResultadoRespuesta {
  constructor(
    private readonly acierto: boolean,
    private readonly tiempoRespuesta: number
  ) {
    if (tiempoRespuesta < 0) {
      throw new Error("El tiempo de respuesta no puede ser negativo");
    }
  }

  esAcierto(): boolean {
    return this.acierto;
  }

  getTiempoRespuesta(): number {
    return this.tiempoRespuesta;
  }

  equals(other: ResultadoRespuesta): boolean {
    return (
      this.acierto === other.acierto &&
      this.tiempoRespuesta === other.tiempoRespuesta
    );
  }
}
