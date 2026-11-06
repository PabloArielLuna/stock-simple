import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colores } from '../styles/colores';

type Props = TextInputProps & { label: string };

export default function Campo({ label, ...props }: Props) {
  return (
    <View style={s.grupo}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colores.gris}
        style={s.input}
      />
    </View>
  );
}
const s = StyleSheet.create({
  grupo: { gap: 7 },
  label: { color: colores.texto, fontSize: 14, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    padding: 13,
    minHeight: 48,
    fontSize: 16,
    color: colores.texto,
    backgroundColor: colores.blanco,
  },
});
