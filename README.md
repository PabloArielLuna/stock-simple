# Stock Simple

Aplicación de inventario con React Native, Expo y TypeScript. Permite cargar productos y consultar sus datos en un celular o en el navegador de una PC.

## Instalación y ejecución

Se necesita Node.js con npm.

```sh
git clone https://github.com/PabloArielLuna/stock-simple.git
cd stock-simple
npm ci
```

**Celular:**

```sh
npx expo start --go
```

Abrir Expo Go compatible con SDK 58 y escanear el QR. La PC y el teléfono deben estar en la misma Wi-Fi y la terminal debe permanecer abierta. Si Expo solicita una cuenta, usar la misma en ambos equipos. Si falla la red local, probar `npx expo start --go --tunnel`.

**PC:** ejecutar `npm run web` y abrir la dirección indicada en la terminal.

## Funciones

- Crear cuenta, ingresar con usuario y PIN o entrar como invitado.
- Listar productos con FlatList y consultar su detalle.
- Agregar, editar y eliminar productos con nombre, precio, cantidad y foto opcional.
- Sacar una foto con la cámara o elegirla de la galería. En PC se elige un archivo del equipo.
- Elegir qué productos puede consultar el invitado. El invitado no puede modificar datos.
- Conservar los usuarios y productos al cerrar la aplicación.

La aplicación comienza vacía. La navegación usa un único **Stack**: Lista, Detalle y Formulario. El ingreso se muestra antes de entrar al inventario. La cantidad se modifica desde Editar producto.

## Estructura de carpetas

La organización sigue el ejemplo de la clase 12. Las fotos de productos se guardan con los datos del usuario; no se necesita una carpeta assets con imágenes fijas.

```text
stock-simple/
├── README.md               Descripción e instrucciones
├── tsconfig.json           Configuración de TypeScript
├── App.tsx                 Entrada y carga inicial
├── index.ts                Registro de la app en Expo
├── app.json                Nombre y permisos
├── package.json            Dependencias y comandos
├── package-lock.json       Versiones de instalación
└── src/
    ├── components/         Boton, Campo y TarjetaProducto
    ├── screens/            Ingreso, Productos, Detalle y Formulario
    ├── navigation/         Configuración del Stack
    ├── hooks/useDatos.ts   Estado, sesión y guardado
    ├── types/              Modelos y parámetros
    ├── styles/             Colores y estilos comunes
    └── utils/              Validación y formato de precios
```

Los componentes reciben datos por props. Los formularios usan useState; la navegación recibe el ID del producto. AsyncStorage guarda un JSON y useEffect lo carga al abrir la aplicación. El guardado local es un valor agregado permitido por la consigna y conserva los inventarios de los usuarios.

## Dependencias

| Dependencia                                                  | Uso                                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `expo`, `react`, `react-native`                              | Base de la aplicación y componentes funcionales                            |
| `@react-navigation/native`, `@react-navigation/native-stack` | Navegar entre Lista, Detalle y Formulario                                  |
| `react-native-screens`, `react-native-safe-area-context`     | Pantallas nativas y espacio seguro alrededor de los controles del teléfono |
| `expo-image-picker`                                          | Cámara y galería para la foto del producto                                 |
| `@react-native-async-storage/async-storage`                  | Conservar usuarios y productos al cerrar la app                            |
| `expo-status-bar`                                            | Barra de estado legible sobre el fondo claro                               |
| `react-dom`, `react-native-web`, `@expo/metro-runtime`       | Ejecutar la interfaz en PC                                                 |
| `typescript`, `@types/react`                                 | Comprobar los tipos durante el desarrollo                                  |

Las versiones se indican en package.json y package-lock.json. FlatList, Switch, Alert y ActivityIndicator forman parte de React Native. Se utilizan para el listado, la visibilidad del producto, la confirmación de eliminación y el aviso de carga.

## Uso de IA

Se utilizó **ChatGPT/Codex** como asistencia para proponer la estructura, generar y modificar código, ejecutar verificaciones y preparar documentación. El uso se explicita también en la defensa oral, donde se debe comprender y justificar la implementación.

## Almacenamiento y alcance

Cada usuario administra sus productos. El invitado ve únicamente los marcados como visibles en esa instalación. Las cuentas y los datos son locales: **no se sincronizan entre PC y celular**. El PIN se guarda sin cifrado y no tiene recuperación.

Las fotos se conservan como texto base64, sin depender de un archivo temporal. El límite es de 900.000 caracteres por imagen y 1.500.000 en el archivo completo. Si falla la escritura se informa el error y se conservan los datos anteriores. Borrar los datos del sitio o desinstalar puede eliminar lo guardado.

## Verificación

```sh
npm run check
npx expo install --check
npx expo export --platform all
```

Verificado el 11/11/2026: TypeScript, reglas de datos, compatibilidad de dependencias y exportación de iOS, Android y web. En Chrome de escritorio y tamaño móvil se probaron los tres accesos, foto, alta, edición, baja, validaciones, reingreso, persistencia y separación entre usuarios. También se comprobó la lectura de productos de la versión anterior.

El usuario informó haber probado en el celular crear y editar productos, eliminar, sacar fotos, modo invitado, crear cuenta, ingresar, salir y volver a ingresar.
