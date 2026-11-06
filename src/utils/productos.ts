import { Datos, FormularioProducto, Producto } from '../types/modelos';

export function precioTexto(precio: number) {
  return (
    '$ ' + precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

export function stockBajo(producto: Producto) {
  return producto.stock <= producto.minimo;
}

export function validarProducto(producto: FormularioProducto): string {
  if (producto.nombre.trim().length < 2 || producto.nombre.length > 60)
    return 'Escribí un nombre de 2 a 60 caracteres.';
  if (!Number.isFinite(producto.precio) || producto.precio <= 0 || producto.precio > 99999999)
    return 'Ingresá un precio mayor a cero y menor a 100 millones.';
  if (!Number.isInteger(producto.stock) || producto.stock < 0 || producto.stock > 99999)
    return 'La cantidad debe ser un entero entre 0 y 99999.';
  if (!Number.isInteger(producto.minimo) || producto.minimo < 0 || producto.minimo > 99999)
    return 'El mínimo debe ser un entero entre 0 y 99999.';
  if (
    producto.foto !== null &&
    (!producto.foto.startsWith('data:image/') || producto.foto.length > 1000000)
  )
    return 'Elegí una foto más pequeña.';
  return '';
}

// Se comprueba el JSON antes de usarlo. Un archivo dañado no se reemplaza por uno vacío.
export function datosValidos(datos: Datos): boolean {
  if (!datos || !Array.isArray(datos.usuarios) || !Array.isArray(datos.productos)) return false;
  const usuariosValidos = datos.usuarios.every(
    (u) =>
      u &&
      typeof u.id === 'string' &&
      u.id.length > 0 &&
      u.id !== 'invitado' &&
      typeof u.nombre === 'string' &&
      u.nombre.trim().length >= 2 &&
      u.nombre.length <= 40 &&
      typeof u.pin === 'string' &&
      /^\d{4}$/.test(u.pin),
  );
  if (!usuariosValidos) return false;
  const productosValidos = datos.productos.every(
    (p) =>
      p &&
      typeof p.id === 'string' &&
      p.id.length > 0 &&
      typeof p.nombre === 'string' &&
      (p.foto === null || typeof p.foto === 'string') &&
      datos.usuarios.some((u) => u.id === p.usuarioId) &&
      validarProducto(p) === '',
  );
  if (!productosValidos) return false;
  const idsUsuarios = datos.usuarios.map((u) => u.id);
  const idsProductos = datos.productos.map((p) => p.id);
  const nombres = datos.usuarios.map((u) => u.nombre.toLowerCase());
  return (
    usuariosValidos &&
    productosValidos &&
    idsUsuarios.every((id, indice) => idsUsuarios.indexOf(id) === indice) &&
    idsProductos.every((id, indice) => idsProductos.indexOf(id) === indice) &&
    nombres.every((nombre, indice) => nombres.indexOf(nombre) === indice)
  );
}
