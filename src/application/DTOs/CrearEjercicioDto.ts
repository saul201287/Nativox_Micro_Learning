export interface CrearEjercicioDto {
  leccionId: string;
  tipo: string;
  enunciado: string;
  opciones: string[];
  imagenes?: string[];
  respuestaCorrecta: string;
}
