export interface ProgresoResponseDto {
  usuarioId: string;
  leccionId: string;
  porcentajeCompletado: number;
  ejerciciosResueltos: number;
  ejerciciosCorrectos: number;
  totalEjercicios: number;
  tiempoTotal: number;
}
