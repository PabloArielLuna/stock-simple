import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackProductos } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import TarjetaProducto from '../components/TarjetaProducto';
import Boton from '../components/Boton';
import { stockBajo } from '../utils/productos';
import { estilos } from '../styles/global';
import { colores } from '../styles/colores';

type Props = NativeStackScreenProps<StackProductos, 'Lista'> & { app: DatosApp };

export default function ProductosScreen({ navigation, app }: Props) {
  const [filtro, setFiltro] = useState<'todos' | 'bajo'>('todos');
  // Como el filtro Todas/Pendientes de la clase 8, aplicado a cantidades de stock.
  const visibles = app.productos.filter((producto) => filtro === 'todos' || stockBajo(producto));
  const bajos = app.productos.filter(stockBajo).length;
  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={visibles}
        keyExtractor={(p) => p.id}
        contentContainerStyle={estilos.contenido}
        ListHeaderComponent={
          <View style={s.cabecera}>
            <Text style={estilos.nota}>
              {app.productos.length} {app.productos.length === 1 ? 'producto' : 'productos'} ·{' '}
              {bajos} con stock bajo
            </Text>
            {!app.invitado && (
              <Boton titulo="Agregar producto" onPress={() => navigation.navigate('Formulario')} />
            )}
            <View style={estilos.fila}>
              {(['todos', 'bajo'] as const).map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filtro === opcion }}
                  onPress={() => setFiltro(opcion)}
                  style={[s.filtro, filtro === opcion && s.activo]}
                >
                  <Text style={[s.filtroTexto, filtro === opcion && s.activoTexto]}>
                    {opcion === 'todos' ? 'Todos' : 'Stock bajo'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TarjetaProducto
            producto={item}
            onPress={() => navigation.navigate('Detalle', { productoId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={estilos.tarjeta}>
            <Text style={estilos.texto}>
              {app.productos.length === 0
                ? app.invitado
                  ? 'No hay productos visibles para invitados.'
                  : 'Todavía no hay productos.'
                : 'No hay productos con stock bajo.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
const s = StyleSheet.create({
  cabecera: { gap: 16, marginBottom: 16 },
  filtro: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 44,
    backgroundColor: colores.blanco,
  },
  activo: { borderColor: colores.azul, backgroundColor: colores.azulClaro },
  filtroTexto: { color: colores.gris, fontWeight: '600' },
  activoTexto: { color: colores.azul },
});
