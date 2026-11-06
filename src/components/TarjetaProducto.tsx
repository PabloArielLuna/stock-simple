import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Producto } from '../types/modelos';
import { precioTexto, stockBajo } from '../utils/productos';
import { colores } from '../styles/colores';

type Props = { producto: Producto; onPress: () => void };

export default function TarjetaProducto({ producto, onPress }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Ver ${producto.nombre}`}
      onPress={onPress}
      style={s.tarjeta}
    >
      {producto.foto ? (
        <Image
          source={{ uri: producto.foto }}
          accessibilityLabel={`Foto de ${producto.nombre}`}
          style={s.foto}
        />
      ) : (
        <View style={[s.foto, s.icono]}>
          <Ionicons name="cube-outline" size={26} color={colores.azul} />
        </View>
      )}
      <View style={s.datos}>
        <Text style={s.nombre}>{producto.nombre}</Text>
        <Text style={s.precio}>{precioTexto(producto.precio)}</Text>
        <Text style={[s.stock, stockBajo(producto) && s.bajo]}>
          {producto.stock} unidades{stockBajo(producto) ? ' · Stock bajo' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.gris} />
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.blanco,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  foto: { width: 62, height: 62, borderRadius: 9 },
  icono: { backgroundColor: colores.azulClaro, alignItems: 'center', justifyContent: 'center' },
  datos: { flex: 1, gap: 5 },
  nombre: { fontSize: 16, fontWeight: '600', color: colores.texto },
  precio: { color: colores.azul, fontSize: 15, fontWeight: '600' },
  stock: { color: colores.gris, fontSize: 13 },
  bajo: { color: colores.rojo },
});
