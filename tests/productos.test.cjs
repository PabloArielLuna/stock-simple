const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (modulo, archivo) =>
  modulo._compile(
    ts.transpileModule(fs.readFileSync(archivo, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    archivo,
  );
const { validarProducto, stockBajo, datosValidos } = require('../src/utils/productos.ts');
const producto = {
  id: 'p1',
  usuarioId: 'u1',
  nombre: 'Cable USB',
  precio: 1200.5,
  stock: 2,
  minimo: 2,
  foto: null,
};
const datos = { usuarios: [{ id: 'u1', nombre: 'Ana', pin: '1234' }], productos: [producto] };

test('El filtro incluye la cantidad mínima y el stock agotado', () => {
  assert.equal(stockBajo(producto), true);
  assert.equal(stockBajo({ ...producto, stock: 0 }), true);
  assert.equal(stockBajo({ ...producto, stock: 3 }), false);
});
test('No acepta cantidades negativas o fraccionarias ni precios no finitos', () => {
  assert.equal(validarProducto(producto), '');
  for (const stock of [-1, 1.5, NaN, Infinity])
    assert.notEqual(validarProducto({ ...producto, stock }), '');
  for (const precio of [-1, 0, NaN, Infinity])
    assert.notEqual(validarProducto({ ...producto, precio }), '');
});
test('El archivo exige un usuario existente para cada producto', () => {
  assert.equal(datosValidos(datos), true);
  assert.equal(datosValidos({ ...datos, productos: [{ ...producto, usuarioId: 'otro' }] }), false);
});
test('Rechaza datos incompletos, usuarios duplicados y archivos inválidos', () => {
  for (const invalido of [
    null,
    {},
    { usuarios: [null], productos: [] },
    { usuarios: [], productos: [null] },
    { ...datos, usuarios: [...datos.usuarios, datos.usuarios[0]] },
  ])
    assert.equal(datosValidos(invalido), false);
});

test('La visibilidad es opcional para conservar los productos anteriores', () => {
  assert.equal(datosValidos(datos), true);
  assert.equal(validarProducto({ ...producto, publico: true }), '');
  assert.equal(validarProducto({ ...producto, publico: false }), '');
  assert.notEqual(validarProducto({ ...producto, publico: 'si' }), '');
});
