import { StyleSheet } from 'react-native';
import { colores } from './colores';

export const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: {
    padding: 20,
    gap: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    paddingBottom: 32,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: colores.fondo,
  },
  tarjeta: {
    padding: 18,
    gap: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.blanco,
  },
  titulo: { fontSize: 24, fontWeight: '700', color: colores.texto },
  subtitulo: { fontSize: 18, fontWeight: '600', color: colores.texto },
  texto: { fontSize: 15, lineHeight: 22, color: colores.texto },
  nota: { fontSize: 13, lineHeight: 20, color: colores.gris },
  error: { fontSize: 14, lineHeight: 21, color: colores.rojo },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
});
