import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackProductos } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import TarjetaProducto from '../components/TarjetaProducto';
import Boton from '../components/Boton';
import { estilos } from '../styles/global';

type Props = NativeStackScreenProps<StackProductos, 'Lista'> & { app: DatosApp };

export default function ProductosScreen({ navigation, app }: Props) {
  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={app.productos}
        keyExtractor={(p) => p.id}
        contentContainerStyle={estilos.contenido}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 16 }}>
            <Text style={estilos.nota}>
              {app.invitado ? 'Solo lectura' : app.sesion?.nombre} · {app.productos.length}{' '}
              {app.productos.length === 1 ? 'producto' : 'productos'}
            </Text>
            {!app.invitado && (
              <Boton titulo="Agregar producto" onPress={() => navigation.navigate('Formulario')} />
            )}
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
              {app.invitado
                ? 'No hay productos visibles para invitados.'
                : 'Todavía no hay productos.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
