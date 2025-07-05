export abstract class Query {
  abstract getQueryName(): string;
}

export class ObtenerLeccionQuery extends Query {
  constructor(public readonly leccionId: string) {
    super();
  }

  getQueryName(): string {
    return "ObtenerLeccion";
  }
}

export class ListarLeccionesPorNivelQuery extends Query {
  constructor(
    public readonly nivel: string,
    public readonly limite?: number,
    public readonly offset?: number
  ) {
    super();
  }

  getQueryName(): string {
    return "ListarLeccionesPorNivel";
  }
}

export class ListarLeccionesPorIdiomaQuery extends Query {
  constructor(
    public readonly idioma: string,
    public readonly limite?: number,
    public readonly offset?: number
  ) {
    super();
  }

  getQueryName(): string {
    return "ListarLeccionesPorIdioma";
  }
}

export class ObtenerEjerciciosLeccionQuery extends Query {
  constructor(public readonly leccionId: string) {
    super();
  }

  getQueryName(): string {
    return "ObtenerEjerciciosLeccion";
  }
}

export class ConsultarProgresoUsuarioQuery extends Query {
  constructor(
    public readonly usuarioId: string,
    public readonly leccionId: string
  ) {
    super();
  }

  getQueryName(): string {
    return "ConsultarProgresoUsuario";
  }
}

export class ObtenerHistorialRespuestasQuery extends Query {
  constructor(
    public readonly usuarioId: string,
    public readonly leccionId?: string,
    public readonly ejercicioId?: string
  ) {
    super();
  }

  getQueryName(): string {
    return "ObtenerHistorialRespuestas";
  }
}

export class ObtenerEstadisticasLeccionQuery extends Query {
  constructor(public readonly leccionId: string) {
    super();
  }

  getQueryName(): string {
    return "ObtenerEstadisticasLeccion";
  }
}
