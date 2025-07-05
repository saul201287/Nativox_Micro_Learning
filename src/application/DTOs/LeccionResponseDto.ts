import { EjercicioResponseDto } from "./EjercicioResponseDto";

export interface LeccionResponseDto {
  id: string;
  titulo: string;
  nivel: string;
  idioma: string;
  contenidoJson: any;
  ejercicios?: EjercicioResponseDto[];
}
