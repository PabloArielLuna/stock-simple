import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackProductos } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import { validarProducto } from '../utils/productos';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
import { estilos } from '../styles/global';

type Props = NativeStackScreenProps<StackProductos, 'Formulario'> & { app: DatosApp };

export default function FormularioProductoScreen({ app, route, navigation }: Props) {
  const id = route.params?.productoId;
  const producto = app.productos.find((p) => p.id === id);
  const [nombre, setNombre] = useState(producto?.nombre ?? '');
  const [precio, setPrecio] = useState(producto ? String(producto.precio) : '');
  const [stock, setStock] = useState(producto ? String(producto.stock) : '');
  const [minimo, setMinimo] = useState(producto ? String(producto.minimo) : '2');
  const [foto, setFoto] = useState<string | null>(producto?.foto ?? null);
  const [publico, setPublico] = useState(producto?.publico ?? false);
  const [cargandoFoto, setCargandoFoto] = useState(false);
  const [error, setError] = useState('');
  const ocupado = app.guardando || cargandoFoto;

  async function elegirFoto(camara: boolean) {
    if (ocupado) return;
    setError('');
    setCargandoFoto(true);
    try {
      if (Platform.OS !== 'web') {
        const permiso = camara
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted)
          throw new Error(
            'Permití el acceso desde los ajustes del teléfono para agregar una foto.',
          );
      }
      const opciones: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      };
      const resultado = camara
        ? await ImagePicker.launchCameraAsync(opciones)
        : await ImagePicker.launchImageLibraryAsync(opciones);
      if (!resultado.canceled) {
        const imagen = resultado.assets[0];
        if (!imagen.base64 || imagen.base64.length > 900000)
          throw new Error('La foto es muy grande. Elegí una imagen más pequeña.');
        setFoto(
          `data:${Platform.OS === 'web' ? imagen.mimeType || 'image/jpeg' : 'image/jpeg'};base64,${imagen.base64}`,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos abrir la foto.');
    } finally {
      setCargandoFoto(false);
    }
  }

  async function guardar() {
    if (ocupado) return;
    const form = {
      nombre: nombre.trim(),
      precio: Number(precio.replace(',', '.')),
      stock: Number(stock),
      minimo: Number(minimo),
      foto,
      publico,
    };
    const mensaje =
      !precio.trim() || !stock.trim() || !minimo.trim()
        ? 'Completá precio, cantidad y mínimo.'
        : validarProducto(form);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    try {
      await app.guardarProducto(form, id);
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar.');
    }
  }

  if (app.invitado || (id && !producto))
    return (
      <View style={estilos.centro}>
        <Text style={estilos.texto}>Producto no disponible.</Text>
      </View>
    );
  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
        <Campo
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          maxLength={60}
          editable={!ocupado}
        />
        <Campo
          label="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
          maxLength={12}
          editable={!ocupado}
        />
        <Campo
          label="Cantidad"
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
          maxLength={5}
          editable={!ocupado}
        />
        <Campo
          label="Avisar con esta cantidad o menos"
          value={minimo}
          onChangeText={setMinimo}
          keyboardType="number-pad"
          maxLength={5}
          editable={!ocupado}
        />
        <View style={[estilos.fila, { justifyContent: 'space-between' }]}>
          <Text style={estilos.texto}>Visible para invitados</Text>
          <Switch
            accessibilityLabel="Visible para invitados"
            value={publico}
            onValueChange={setPublico}
            disabled={ocupado}
          />
        </View>
        <View style={estilos.tarjeta}>
          <Text style={estilos.subtitulo}>Foto opcional</Text>
          {foto && (
            <Image
              accessibilityLabel="Foto del producto"
              source={{ uri: foto }}
              style={{ width: 140, height: 140, borderRadius: 8, alignSelf: 'center' }}
            />
          )}
          {Platform.OS !== 'web' && (
            <Boton
              titulo="Sacar foto"
              secundario
              deshabilitado={ocupado}
              onPress={() => void elegirFoto(true)}
            />
          )}
          <Boton
            titulo="Elegir foto"
            secundario
            cargando={cargandoFoto}
            deshabilitado={app.guardando}
            onPress={() => void elegirFoto(false)}
          />
          {foto && (
            <Boton
              titulo="Quitar foto"
              secundario
              deshabilitado={ocupado}
              onPress={() => setFoto(null)}
            />
          )}
        </View>
        {!!error && (
          <Text accessibilityRole="alert" style={estilos.error}>
            {error}
          </Text>
        )}
        <Boton
          titulo="Guardar producto"
          cargando={app.guardando}
          deshabilitado={cargandoFoto}
          onPress={() => void guardar()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
