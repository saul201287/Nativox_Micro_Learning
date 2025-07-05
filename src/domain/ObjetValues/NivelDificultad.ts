export class NivelDificultad {
  private constructor(private readonly value: "basico" | "intermedio") {}

  static basico(): NivelDificultad {
    return new NivelDificultad("basico");
  }

  static intermedio(): NivelDificultad {
    return new NivelDificultad("intermedio");
  }

  static fromString(value: string): NivelDificultad {
    if (value === "basico" || value === "intermedio") {
      return new NivelDificultad(value);
    }
    throw new Error(`Nivel de dificultad inválido: ${value}`);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: NivelDificultad): boolean {
    return this.value === other.value;
  }
}
