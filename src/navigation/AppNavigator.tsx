import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackProductos, Tabs } from '../types/navegacion';
import { DatosApp } from '../hooks/useDatos';
import IngresoScreen from '../screens/IngresoScreen';
import ProductosScreen from '../screens/ProductosScreen';
import DetalleProductoScreen from '../screens/DetalleProductoScreen';
import FormularioProductoScreen from '../screens/FormularioProductoScreen';
import CuentaScreen from '../screens/CuentaScreen';
import { colores } from '../styles/colores';

const Stack = createNativeStackNavigator<StackProductos>();
const Tab = createBottomTabNavigator<Tabs>();

function ProductosNavigator({ app }: { app: DatosApp }) {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colores.texto, headerShadowVisible: false }}>
      <Stack.Screen name="Lista" options={{ title: 'Productos' }}>
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
  );
}

export default function AppNavigator({ app }: { app: DatosApp }) {
  if (!app.sesion) return <IngresoScreen app={app} />;
  return (
    <SafeAreaView style={s.pantalla} edges={['left', 'right']}>
      {app.invitado && (
        <SafeAreaView edges={['top']} style={s.aviso}>
          <View style={s.fila}>
            <Text style={s.texto}>Invitado · Solo lectura</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Ingresar"
              onPress={app.salir}
              style={s.ingresar}
            >
              <Text style={s.enlace}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
      <NavigationContainer key={app.sesion.id}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: { minHeight: 64 },
            tabBarLabelStyle: { fontSize: 12, lineHeight: 18 },
            tabBarActiveTintColor: colores.azul,
            tabBarInactiveTintColor: colores.gris,
            tabBarActiveBackgroundColor: colores.azulClaro,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name={route.name === 'Productos' ? 'cube-outline' : 'person-outline'}
                color={color}
                size={size}
              />
            ),
            headerShadowVisible: false,
          })}
        >
          <Tab.Screen name="Productos" options={{ headerShown: false }}>
            {() => <ProductosNavigator app={app} />}
          </Tab.Screen>
          <Tab.Screen name="Cuenta" options={{ title: 'Mi cuenta' }}>
            {() => <CuentaScreen app={app} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.blanco },
  aviso: { backgroundColor: colores.azulClaro },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  texto: { color: colores.gris, fontSize: 12 },
  ingresar: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 6 },
  enlace: { color: colores.azul, fontSize: 14, fontWeight: '600' },
});
