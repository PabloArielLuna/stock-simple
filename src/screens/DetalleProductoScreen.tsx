import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackProductos } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import Boton from '../components/Boton';
import { precioTexto } from '../utils/productos';
import { estilos } from '../styles/global';

type Props = NativeStackScreenProps<StackProductos, 'Detalle'> & { app: DatosApp };

export default function DetalleProductoScreen({ route, navigation, app }: Props) {
  const producto = app.productos.find((p) => p.id === route.params.productoId);
  const [error, setError] = useState('');
  if (!producto)
    return (
      <View style={estilos.centro}>
        <Text style={estilos.texto}>Producto no disponible.</Text>
      </View>
    );

  async function eliminar() {
    if (!producto || app.guardando) return;
    try {
      await app.eliminarProducto(producto.id);
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar.');
    }
  }
  function confirmar() {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Eliminar este producto?')) void eliminar();
    } else
      Alert.alert('Eliminar producto', '¿Querés eliminar este producto?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => void eliminar() },
      ]);
  }
  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.tarjeta}>
        {producto.foto && (
          <Image
            accessibilityLabel={`Foto de ${producto.nombre}`}
            source={{ uri: producto.foto }}
            style={{ width: 160, height: 160, borderRadius: 10, alignSelf: 'center' }}
          />
        )}
        <Text style={estilos.titulo}>{producto.nombre}</Text>
        <Text style={estilos.subtitulo}>{precioTexto(producto.precio)}</Text>
        <Text style={estilos.texto}>Cantidad: {producto.stock}</Text>
      </View>
      {!app.invitado && (
        <>
          <Boton
            titulo="Editar producto"
            secundario
            deshabilitado={app.guardando}
            onPress={() => navigation.navigate('Formulario', { productoId: producto.id })}
          />
          <Boton
            titulo="Eliminar producto"
            peligro
            deshabilitado={app.guardando}
            onPress={confirmar}
          />
        </>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={estilos.error}>
          {error}
        </Text>
      )}
    </ScrollView>
  );
}
