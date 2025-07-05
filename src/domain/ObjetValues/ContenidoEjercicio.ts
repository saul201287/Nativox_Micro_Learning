export class ContenidoEjercicio {
  constructor(
    private readonly texto: string,
    private readonly imagenes: string[],
    private readonly opciones: string[]
  ) {
    if (!texto.trim()) {
      throw new Error("El texto del ejercicio no puede estar vacío");
    }
  }

  getTexto(): string {
    return this.texto;
  }

  getImagenes(): string[] {
    return [...this.imagenes];
  }

  getOpciones(): string[] {
    return [...this.opciones];
  }

  equals(other: ContenidoEjercicio): boolean {
    return (
      this.texto === other.texto &&
      JSON.stringify(this.imagenes) === JSON.stringify(other.imagenes) &&
      JSON.stringify(this.opciones) === JSON.stringify(other.opciones)
    );
  }
}
