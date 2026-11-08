import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Boton from '../components/Boton';
import { DatosApp } from '../hooks/useDatos';
import { estilos } from '../styles/global';

export default function CuentaScreen({ app }: { app: DatosApp }) {
  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>{app.sesion?.nombre}</Text>
        <Text style={estilos.texto}>
          {app.invitado
            ? 'Catálogo · Solo lectura'
            : `${app.productos.length} ${app.productos.length === 1 ? 'producto guardado' : 'productos guardados'}`}
        </Text>
        {!app.invitado && (
          <Text style={estilos.nota}>Los datos quedan en este dispositivo o navegador.</Text>
        )}
      </View>
      <Boton
        titulo={app.invitado ? 'Ingresar o crear cuenta' : 'Cerrar sesión'}
        secundario
        deshabilitado={app.guardando}
        onPress={app.salir}
      />
    </ScrollView>
  );
}
