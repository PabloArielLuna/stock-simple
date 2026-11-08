export type Usuario = { id: string; nombre: string; pin: string };
export type Sesion = { id: string; nombre: string };

export type Producto = {
  id: string;
  usuarioId: string;
  nombre: string;
  precio: number;
  stock: number;
  minimo: number;
  foto: string | null;
  publico?: boolean;
};

export type Datos = { usuarios: Usuario[]; productos: Producto[] };
export type FormularioProducto = {
  nombre: string;
  precio: number;
  stock: number;
  minimo: number;
  foto: string | null;
  publico?: boolean;
};
