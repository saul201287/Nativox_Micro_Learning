export interface EjercicioResponseDto {
  id: string;
  leccionId: string;
  tipo: string;
  enunciado: string;
  opciones: string[];
  imagenes: string[];
}
