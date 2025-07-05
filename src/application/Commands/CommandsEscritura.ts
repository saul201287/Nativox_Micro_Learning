export abstract class Command {
  abstract getCommandName(): string;
}

export class CrearLeccionCommand extends Command {
  constructor(
    public readonly titulo: string,
    public readonly nivel: string,
    public readonly contenidoJson: any,
    public readonly idioma: string
  ) {
    super();
  }

  getCommandName(): string {
    return "CrearLeccion";
  }
}

export class CrearEjercicioCommand extends Command {
  constructor(
    public readonly leccionId: string,
    public readonly tipo: string,
    public readonly enunciado: string,
    public readonly opciones: string[],
    public readonly imagenes: string[],
    public readonly respuestaCorrecta: string
  ) {
    super();
  }

  getCommandName(): string {
    return "CrearEjercicio";
  }
}

export class ResolverEjercicioCommand extends Command {
  constructor(
    public readonly leccionId: string,
    public readonly usuarioId: string,
    public readonly ejercicioId: string,
    public readonly respuesta: string,
    public readonly tiempoRespuesta: number
  ) {
    super();
  }

  getCommandName(): string {
    return "ResolverEjercicio";
  }
}

export class ActualizarLeccionCommand extends Command {
  constructor(
    public readonly leccionId: string,
    public readonly titulo?: string,
    public readonly contenidoJson?: any
  ) {
    super();
  }

  getCommandName(): string {
    return "ActualizarLeccion";
  }
}

export class EliminarLeccionCommand extends Command {
  constructor(public readonly leccionId: string) {
    super();
  }

  getCommandName(): string {
    return "EliminarLeccion";
  }
}
