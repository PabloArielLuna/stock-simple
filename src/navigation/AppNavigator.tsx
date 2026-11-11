import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackProductos } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import IngresoScreen from '../screens/IngresoScreen';
import ProductosScreen from '../screens/ProductosScreen';
import DetalleProductoScreen from '../screens/DetalleProductoScreen';
import FormularioProductoScreen from '../screens/FormularioProductoScreen';
import { colores } from '../styles/colores';
import { estilos } from '../styles/global';

const Stack = createNativeStackNavigator<StackProductos>();

export default function AppNavigator({ app }: { app: DatosApp }) {
  if (!app.sesion) return <IngresoScreen app={app} />;
  return (
    <SafeAreaView style={estilos.pantalla} edges={['left', 'right', 'bottom']}>
      <NavigationContainer key={app.sesion.id}>
        <Stack.Navigator
          screenOptions={{ headerTintColor: colores.texto, headerShadowVisible: false }}
        >
          <Stack.Screen
            name="Lista"
            options={{
              title: app.invitado ? 'Invitado' : 'Productos',
              headerRight: () => (
                <Button
                  title={app.invitado ? 'Ingresar' : 'Salir'}
                  color={colores.azul}
                  disabled={app.guardando}
                  onPress={app.salir}
                />
              ),
            }}
          >
            {(props) => <ProductosScreen {...props} app={app} />}
          </Stack.Screen>
          <Stack.Screen name="Detalle" options={{ title: 'Detalle del producto' }}>
            {(props) => <DetalleProductoScreen {...props} app={app} />}
          </Stack.Screen>
          {!app.invitado && (
            <Stack.Screen
              name="Formulario"
              options={({ route }) => ({
                title: route.params?.productoId ? 'Editar producto' : 'Agregar producto',
              })}
            >
              {(props) => <FormularioProductoScreen {...props} app={app} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
