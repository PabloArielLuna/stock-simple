import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colores } from '../styles/colores';

type Props = {
  titulo: string;
  onPress: () => void;
  secundario?: boolean;
  peligro?: boolean;
  deshabilitado?: boolean;
  cargando?: boolean;
};

export default function Boton({
  titulo,
  onPress,
  secundario,
  peligro,
  deshabilitado,
  cargando,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !!(deshabilitado || cargando) }}
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={[
        s.boton,
        secundario && s.secundario,
        peligro && s.peligro,
        (deshabilitado || cargando) && s.inactivo,
      ]}
    >
      {cargando && <ActivityIndicator color={secundario ? colores.azul : colores.blanco} />}
      <Text style={[s.texto, secundario && s.textoAzul, peligro && s.textoRojo]}>{titulo}</Text>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  boton: {
    backgroundColor: colores.azul,
    borderRadius: 9,
    padding: 14,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  secundario: { backgroundColor: colores.azulClaro },
  peligro: { backgroundColor: colores.rojoClaro },
  inactivo: { opacity: 0.5 },
  texto: { color: colores.blanco, fontSize: 16, fontWeight: '600' },
  textoAzul: { color: colores.azul },
  textoRojo: { color: colores.rojo },
});
