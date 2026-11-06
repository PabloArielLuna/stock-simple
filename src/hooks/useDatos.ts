import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Datos, FormularioProducto, Producto, Sesion } from '../types/modelos';
import { datosValidos, validarProducto } from '../utils/productos';
import { ejemplos } from '../data/ejemplos';

const CLAVE = '@stock-simple/datos-v1';
const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function useDatos(): DatosApp {
  const [datos, setDatos] = useState<Datos>({ usuarios: [], productos: [] });
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');
  const invitado = sesion?.id === 'invitado';

  async function cargar() {
    setCargando(true);
    setErrorCarga('');
    try {
      const texto = await AsyncStorage.getItem(CLAVE);
      if (texto !== null) {
        const guardados = JSON.parse(texto);
        if (!datosValidos(guardados)) throw new Error('Datos inválidos');
        setDatos(guardados);
      }
    } catch {
      setErrorCarga('No pudimos leer los datos guardados. Volvé a intentar sin borrar la app.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargar();
  }, []);

  // Primero guarda y después actualiza la pantalla. Si falla, conserva el estado anterior.
  async function guardar(nuevos: Datos) {
    if (guardando) throw new Error('Esperá a que termine el guardado.');
    const texto = JSON.stringify(nuevos);
    if (texto.length > 1500000)
      throw new Error(
        'No queda espacio en esta versión simple. Quitá alguna foto o elegí fotos más pequeñas.',
      );
    setGuardando(true);
    try {
      await AsyncStorage.setItem(CLAVE, texto);
      setDatos(nuevos);
    } catch {
      throw new Error('No se pudo guardar. Liberá espacio y volvé a intentar.');
    } finally {
      setGuardando(false);
    }
  }

  async function registrar(nombre: string, pin: string) {
    nombre = nombre.trim();
    if (nombre.length < 2 || nombre.length > 40)
      throw new Error('El nombre debe tener de 2 a 40 caracteres.');
    if (!/^\d{4}$/.test(pin)) throw new Error('El PIN debe tener 4 números.');
    if (datos.usuarios.some((u) => u.nombre.toLowerCase() === nombre.toLowerCase()))
      throw new Error('Ese usuario ya existe. Elegí Ingresar.');
    const usuario = { id: nuevoId(), nombre, pin };
    await guardar({ ...datos, usuarios: [...datos.usuarios, usuario] });
    setSesion({ id: usuario.id, nombre });
  }

  function ingresar(nombre: string, pin: string) {
    const usuario = datos.usuarios.find(
      (u) => u.nombre.toLowerCase() === nombre.trim().toLowerCase() && u.pin === pin,
    );
    if (!usuario) throw new Error('Usuario o PIN incorrectos.');
    setSesion({ id: usuario.id, nombre: usuario.nombre });
  }

  async function guardarProducto(form: FormularioProducto, id?: string) {
    if (!sesion || invitado) throw new Error('Ingresá con tu usuario para guardar productos.');
    const error = validarProducto(form);
    if (error) throw new Error(error);
    if (id && !datos.productos.some((p) => p.id === id && p.usuarioId === sesion.id))
      throw new Error('No encontramos ese producto.');
    const producto = {
      ...form,
      nombre: form.nombre.trim(),
      id: id ?? nuevoId(),
      usuarioId: sesion.id,
    };
    const productos = id
      ? datos.productos.map((p) => (p.id === id ? producto : p))
      : [...datos.productos, producto];
    await guardar({ ...datos, productos });
  }

  async function eliminarProducto(id: string) {
    if (!sesion || invitado) throw new Error('Ingresá con tu usuario.');
    if (!datos.productos.some((p) => p.id === id && p.usuarioId === sesion.id))
      throw new Error('No encontramos ese producto.');
    await guardar({ ...datos, productos: datos.productos.filter((p) => p.id !== id) });
  }

  return {
    sesion,
    invitado,
    cargando,
    guardando,
    errorCarga,
    cargar,
    registrar,
    ingresar,
    guardarProducto,
    eliminarProducto,
    productos: invitado ? ejemplos : datos.productos.filter((p) => p.usuarioId === sesion?.id),
    explorar: () => setSesion({ id: 'invitado', nombre: 'Invitado' }),
    salir: () => {
      if (!guardando) setSesion(null);
    },
  };
}

export type DatosApp = {
  sesion: Sesion | null;
  invitado: boolean;
  cargando: boolean;
  guardando: boolean;
  errorCarga: string;
  productos: Producto[];
  cargar: () => Promise<void>;
  registrar: (nombre: string, pin: string) => Promise<void>;
  ingresar: (nombre: string, pin: string) => void;
  guardarProducto: (form: FormularioProducto, id?: string) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  explorar: () => void;
  salir: () => void;
};
