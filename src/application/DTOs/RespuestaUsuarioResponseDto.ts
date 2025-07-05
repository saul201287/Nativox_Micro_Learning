export interface RespuestaUsuarioResponseDto {
  id: string;
  usuarioId: string;
  ejercicioId: string;
  respuestaDada: string;
  correcta: boolean;
  timestamp: Date;
  tiempoRespuesta: number;
}
