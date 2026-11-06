# Stock Simple

App de inventario para el trabajo integrador de Desarrollo de Aplicaciones para Dispositivos Móviles. Proyecto independiente de NEXA pro.

## Ejecutar

```powershell
cd "C:\Users\Pablo\GPT Work\stock-simple"
npm ci
npx expo start --go
```

Actualizar Expo Go a una versión compatible con **SDK 58**. PC e iPhone deben estar en la misma Wi-Fi. Escanear el QR con la cámara del iPhone y abrirlo con Expo Go. Mantener la terminal abierta. Si Expo pide iniciar sesión, usar la misma cuenta gratuita en la PC (`npx expo login`) y en Expo Go. Si falla la red local, probar `npx expo start --go --tunnel`.

Para computadora: `npm run web`. No necesita compilar ni publicarse en una tienda para la demostración en Expo Go.

## Funciones

- Crear un usuario local e ingresar con nombre y PIN de cuatro números.
- Entrar como invitado y consultar tres productos ficticios, sin editar datos.
- Agregar, ver, editar y eliminar productos: nombre, precio, cantidad, mínimo y foto opcional.
- Filtrar **Todos / Stock bajo**. Stock bajo significa cantidad menor o igual al mínimo.
- Descontar una unidad desde el detalle del producto, sin permitir stock negativo.
- Tomar una foto con la cámara o elegirla de la galería.
- Compartir nombre, precio y cantidad desde el menú del teléfono. No confirma el envío.
- Conservar datos al cerrar y abrir. Cada usuario ve sus productos.

En navegador se puede elegir una foto desde el equipo. La cámara y el menú nativo para compartir se demuestran en el teléfono.

## Organización

```text
App.tsx                Carga inicial y entrada a la navegación
src/components/        Botón, campo de texto y tarjeta reutilizables
src/screens/           Ingreso, productos, detalle, formulario y cuenta
src/navigation/        Stack de productos dentro de las pestañas
src/hooks/useDatos.ts   Estado, sesión y guardado local
src/types/             Producto, usuario y parámetros de navegación
src/styles/            Colores y estilos comunes
src/utils/             Validación, formato de precio y condición de stock bajo
src/data/              Productos ficticios del invitado
```

El estado se comparte por **props**. La navegación recibe solo el ID del producto. `useDatos` guarda un JSON con usuarios y productos usando AsyncStorage; primero escribe y después actualiza el estado. Si falla la lectura, muestra un error y permite reintentar, sin reemplazar datos por una lista vacía. No hay servidor ni sincronización entre teléfonos o navegadores.

## Relación con los apuntes recibidos

| Tema                                                | Clase | Dónde se usa                            |
| --------------------------------------------------- | ----- | --------------------------------------- |
| Componentes funcionales, props, TypeScript, estilos | 2 y 3 | Boton, Campo, TarjetaProducto           |
| Stack y pestañas                                    | 4 y 5 | AppNavigator                            |
| Parámetros entre pantallas                          | 6     | productoId en detalle y edición         |
| Formularios y useState                              | 7     | Ingreso y formulario de producto        |
| Condicionales, FlatList y filtros                   | 8     | Todos / Stock bajo y vista del invitado |
| Eventos y callbacks                                 | 9     | Guardar, vender y eliminar              |
| Flexbox y estilos comunes                           | 10    | styles y tarjetas                       |
| ActivityIndicator y confirmaciones                  | 11    | Guardado y eliminación                  |
| Carpetas y hooks                                    | 12    | Estructura de src                       |

**Complementos necesarios para la consigna:** persistencia con AsyncStorage y carga con useEffect; cámara/galería con expo-image-picker y menú Share de React Native. La clase 6 anuncia la persistencia para clases posteriores; los archivos recibidos no incluyen su explicación completa. Estos complementos se mantienen concentrados en `useDatos` y el formulario. No se presenta su contenido como si estuviera desarrollado en esos apuntes.

## Alcance de esta versión

El PIN es de práctica: se guarda sin cifrado en AsyncStorage, junto con los datos. Usar cuentas y productos ficticios para la entrega. No tiene recuperación de PIN, autenticación remota, cifrado, biometría, presupuestos PDF ni historial de ventas. Vender una unidad solo actualiza la cantidad.

La foto se guarda como texto base64 para que no dependa de una ruta temporal. Se admite hasta 900.000 caracteres de base64 por imagen y 1.500.000 caracteres en todo el archivo, para mantener pequeña esta demostración y respetar el almacenamiento local de Android. Si se supera el límite o falla la escritura, conserva los datos anteriores y muestra un error. Borrar los datos de Expo Go, desinstalar o limpiar el sitio del navegador puede eliminar lo guardado. Stock Simple no lee ni migra datos de NEXA.

## Comprobación

```sh
npm run check
npx expo install --check
npx expo export --platform all
```

Las pruebas de reglas no reemplazan probar cámara, permisos, teclado y compartir en un iPhone/Android real. El recorrido manual recomendado es: invitado → crear cuenta A → agregar foto/producto → filtrar → vender una unidad → editar → salir → crear B → comprobar que está vacío → reingresar a A y verificar persistencia.

Fuentes de los complementos: [ImagePicker de Expo](https://docs.expo.dev/versions/latest/sdk/imagepicker/), [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage/), [Share de React Native](https://reactnative.dev/docs/share), [Expo Go](https://expo.dev/go).

Comprobado el 06/11/2026: tipos TypeScript y 4 pruebas de reglas; recorrido en Chrome de escritorio y tamaño móvil con invitado, filtros, cuenta, foto, alta/edición/baja, cantidad, PIN y aislamiento. Las capturas y el programa de prueba del navegador se conservan fuera de este proyecto. La cámara, los permisos y Share necesitan todavía una prueba física en el teléfono.

La exportación para iOS, Android y web también pasó. La instalación registró 5 avisos moderados de dependencias; no se aplicaron actualizaciones forzadas que cambien de SDK.
