import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import Boton from './src/components/Boton';
import { useDatos } from './src/hooks/useDatos';
import { estilos } from './src/styles/global';
import { colores } from './src/styles/colores';

export default function App() {
  const app = useDatos();
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {app.cargando ? (
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color={colores.azul} />
        </View>
      ) : app.errorCarga ? (
        <View style={estilos.centro}>
          <Text style={estilos.error}>{app.errorCarga}</Text>
          <Boton titulo="Volver a intentar" onPress={() => void app.cargar()} />
        </View>
      ) : (
        <AppNavigator app={app} />
      )}
    </SafeAreaProvider>
  );
}
