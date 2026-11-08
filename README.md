# Stock Simple

Aplicación de inventario con React Native, Expo y TypeScript. Permite crear usuarios, cargar productos y guardar los cambios en el celular o en el navegador de una PC.

## Descargar y ejecutar

Se necesita Node.js con npm.

```sh
git clone https://github.com/PabloArielLuna/stock-simple.git
cd stock-simple
npm ci
```

**En PC:** ejecutar `npm run web` y abrir la dirección que aparece en la terminal.

**En celular:** ejecutar `npm start`, abrir Expo Go compatible con SDK 58 y escanear el QR. La PC y el teléfono deben estar en la misma Wi-Fi; mantener la terminal abierta. Si Expo solicita una cuenta, usar la misma en la PC (`npx expo login`) y en Expo Go. Si falla la conexión local, probar `npx expo start --go --tunnel`.

GitHub conserva el código. Para usar la aplicación hay que ejecutarla con los pasos anteriores.

## Qué permite hacer

- Crear una cuenta e ingresar con usuario y PIN de cuatro números.
- Agregar, consultar, editar y eliminar productos con nombre, precio, cantidad, mínimo y foto opcional.
- Filtrar **Todos / Stock bajo**, usando `filter` como en la clase 8. Stock bajo significa cantidad menor o igual al mínimo.
- Descontar una unidad sin permitir cantidades negativas.
- Elegir qué productos son **visibles para invitados**. El invitado puede verlos y filtrarlos; no puede modificarlos.
- Elegir fotos del equipo en PC y usar cámara o galería en el teléfono.
- Compartir nombre, precio y cantidad desde el menú del teléfono.
- Cerrar y volver a abrir conservando usuarios y productos.

La aplicación comienza vacía. Los productos se cargan desde una cuenta. No incorpora inventarios ficticios ni rellena datos al ingresar. Un producto nuevo es privado hasta activar Visible para invitados; los productos de versiones anteriores también siguen privados.

## Organización y temas de clase

| Carpeta                   | Contenido                                        | Clases relacionadas                             |
| ------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| `src/components`          | Botón, campo y tarjeta reutilizables             | 2 y 3: componentes y props                      |
| `src/navigation`          | Pestañas y pila de pantallas, parámetros tipados | 4, 5 y 6: navegación                            |
| `src/screens`             | Ingreso, lista, detalle, formulario y cuenta     | 7, 8 y 9: estado, listas, formularios y eventos |
| `src/styles`              | Colores, Flexbox y estilos comunes               | 10: estilos                                     |
| `src/hooks/useDatos.ts`   | Usuarios, sesión y guardado                      | 12: hooks y organización                        |
| `src/types` y `src/utils` | Tipos, formato de precio y validación            | TypeScript y funciones                          |

Se usan `ActivityIndicator` para el guardado y confirmación antes de eliminar, como en la clase 11. El estado se pasa por props y la navegación recibe el ID del producto.

Para conservar la información se usa AsyncStorage, con una carga inicial mediante useEffect. Para las fotos se usa expo-image-picker y para compartir, Share de React Native. Son los complementos necesarios para la persistencia y las funciones del teléfono; la clase 6 anuncia AsyncStorage para clases posteriores.

## Guardado local

Cada usuario administra su inventario. El invitado ve únicamente los productos marcados como visibles, dentro de esa misma instalación. Los cambios se guardan antes de actualizar la pantalla; si falla la escritura, se informa el error y se conservan los datos anteriores.

Las cuentas y los productos son **locales a cada dispositivo o navegador**. No hay sincronización entre PC y celular, servidor ni recuperación de PIN. El PIN se guarda sin cifrado en el almacenamiento local. Borrar los datos de Expo Go, desinstalar o limpiar los datos del sitio puede eliminar la información.

Las fotos se guardan como base64 para conservarlas sin depender de una ruta temporal. Se admite hasta 900.000 caracteres por imagen y 1.500.000 en el archivo completo. Al alcanzar el límite se pide quitar fotos o elegir imágenes más pequeñas. Vender una unidad descuenta la cantidad; no genera factura ni historial contable. Compartir abre el menú del sistema y no confirma que se haya enviado un mensaje.

## Verificación

```sh
npm run check
npx expo install --check
npx expo export --platform all
```

Verificado el 08/11/2026: TypeScript, 5 pruebas de reglas y recorrido en Chrome de escritorio y tamaño móvil. Se comprobó publicar y ocultar productos reales para el invitado, además de: crear usuarios, cargar y editar un producto con foto, filtrar, descontar stock, cerrar sesión, volver a ingresar, recargar y comprobar aislamiento. La exportación genera las versiones de iOS, Android y web. La cámara, los permisos y el menú para compartir requieren además una prueba física en el teléfono.

Fuentes: [Expo Go](https://expo.dev/go), [ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/), [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage/), [Share](https://reactnative.dev/docs/share).
