import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Boton from '../components/Boton';
import Campo from '../components/Campo';
import { DatosApp } from '../hooks/useDatos';
import { estilos } from '../styles/global';
import { colores } from '../styles/colores';

export default function IngresoScreen({ app }: { app: DatosApp }) {
  const [crear, setCrear] = useState(false);
  const [nombre, setNombre] = useState('');
  const [pin, setPin] = useState('');
  const [repeticion, setRepeticion] = useState('');
  const [error, setError] = useState('');

  async function enviar() {
    setError('');
    try {
      if (crear) {
        if (pin !== repeticion) throw new Error('Los PIN no coinciden.');
        await app.registrar(nombre, pin);
      } else app.ingresar(nombre, pin);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos ingresar.');
    }
  }

  function cambiarModo(nuevo: boolean) {
    setCrear(nuevo);
    setPin('');
    setRepeticion('');
    setError('');
  }

  return (
    <SafeAreaView style={estilos.pantalla}>
      <KeyboardAvoidingView
        style={estilos.pantalla}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">
          <Text style={s.marca}>Stock Simple</Text>
          <View style={estilos.tarjeta}>
            <View style={s.tabs}>
              {[false, true].map((modo) => (
                <TouchableOpacity
                  key={String(modo)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: crear === modo, disabled: app.guardando }}
                  disabled={app.guardando}
                  onPress={() => cambiarModo(modo)}
                  style={[s.tab, crear === modo && s.activo]}
                >
                  <Text style={[s.tabTexto, crear === modo && s.seleccionado]}>
                    {modo ? 'Crear cuenta' : 'Ingresar'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Campo
              label="Usuario"
              value={nombre}
              onChangeText={setNombre}
              maxLength={40}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!app.guardando}
            />
            <Campo
              label="PIN de 4 números"
              value={pin}
              onChangeText={(v) => setPin(v.replace(/\D/g, ''))}
              maxLength={4}
              keyboardType="number-pad"
              secureTextEntry
              editable={!app.guardando}
            />
            {crear && (
              <Campo
                label="Repetir PIN"
                value={repeticion}
                onChangeText={(v) => setRepeticion(v.replace(/\D/g, ''))}
                maxLength={4}
                keyboardType="number-pad"
                secureTextEntry
                editable={!app.guardando}
              />
            )}
            {!!error && (
              <Text accessibilityRole="alert" style={estilos.error}>
                {error}
              </Text>
            )}
            <Boton
              titulo={crear ? 'Crear cuenta' : 'Ingresar'}
              cargando={app.guardando}
              deshabilitado={
                nombre.trim().length < 2 || pin.length !== 4 || (crear && repeticion.length !== 4)
              }
              onPress={() => void enviar()}
            />
            {crear && (
              <Text style={estilos.nota}>Cuenta local. Recordá tu PIN para volver a ingresar.</Text>
            )}
          </View>
          <Boton
            titulo="Entrar como invitado"
            secundario
            deshabilitado={app.guardando}
            onPress={app.explorar}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  marca: { fontSize: 28, fontWeight: '700', color: colores.azul, marginVertical: 12 },
  tabs: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: colores.fondo,
    padding: 4,
    marginBottom: 6,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  activo: { backgroundColor: colores.azul },
  tabTexto: { fontSize: 14, fontWeight: '600', color: colores.gris },
  seleccionado: { color: colores.blanco },
});
