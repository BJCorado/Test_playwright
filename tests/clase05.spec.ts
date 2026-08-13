import { test, expect, Page } from '@playwright/test';

test.describe('Clase 05 - Flujo de login en Sauce Demo', () => {

test('CE válida: login con credenciales correctas',
  async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Assertion: debemos llegar al inventario
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.inventory_container'))
    .toBeVisible();

  console.log('CE válida: login exitoso');
 });

test('CE inválida: usuario no existe', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('usuario_inexistente');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Assertion: debe aparecer mensaje de error
  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg)
    .toContainText('Username and password do not match');

  // Assertion: NO debemos haber navegado al inventario
  await expect(page).not.toHaveURL(/inventory/);
 });

 test('CE inválida: usuario bloqueado', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('locked out');

  console.log('CE usuario bloqueado: mensaje correcto mostrado');
 });

 test('Valor en frontera: campos vacíos (frontera de longitud mínima)', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // No llenar nada y hacer clic
  await page.locator('#login-button').click();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('Username is required');

  console.log('Valor frontera: campo vacío maneja error correctamente');
 });

test('Verificar que el inventario tiene exactamente 6 productos', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory/);

  // Contar productos con assertion exacta
  const productos = page.locator('.inventory_item');
  await expect(productos).toHaveCount(6);

  console.log('El inventario tiene exactamente 6 productos');
  console.log(productos);
 });

 test('Verificar precio del primer producto con regex',
  async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory/);

  const textoPrecio = await page.locator('.inventory_item_price')
    .first().textContent();

  // El regex valida el formato $XX.XX (p.ej. $29.99)
  expect(textoPrecio?.trim()).toMatch(/^\$\d+\.\d{2}$/);
 });

 test('Verificar atributos y estados de los elementos del inventario', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory/);

  const primerBoton = page.locator('.btn_inventory').first();
  await expect(primerBoton).toBeEnabled();
  await expect(primerBoton).toHaveText('Add to cart');

  // (continuación) clic y verificar que cambió a 'Remove'
  await primerBoton.click();
  await expect(primerBoton).toHaveText('Remove');

  // Verificar que el carrito muestra 1 item
  const badgeCarrito = page.locator('.shopping_cart_badge');
  await expect(badgeCarrito).toBeVisible();
  await expect(badgeCarrito).toHaveText('1');

  console.log('El botón cambia de estado y el carrito se actualiza');
 });

 test('Verificar múltiples propiedades del primer producto con soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    const primerProducto = page.locator('.inventory_item').first();

    await expect.soft(
        primerProducto.locator('.inventory_item_name')
    ).toBeVisible();

    await expect.soft(
        primerProducto.locator('.inventory_item_desc')
    ).toBeVisible();

    await expect.soft(
        primerProducto.locator('.inventory_item_price')
    ).toBeVisible();

    await expect.soft(
        primerProducto.locator('.btn_inventory')
    ).toBeEnabled();

    await expect.soft(
        primerProducto.locator('img')
    ).toBeVisible();

    console.log('Soft assertions del primer producto completadas');
 });

 test('Tabla de decisión - Regla 1: logueado con items -> puede pagar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    // Agregar un producto
    await page.locator('.btn_inventory').first().click();

    // Ir al carrito
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart/);

    // El botón Checkout debe estar disponible
    const btnCheckout = page.getByText('Checkout');

    await expect(btnCheckout).toBeVisible();
    await expect(btnCheckout).toBeEnabled();

    console.log('Regla 1: usuario logueado con productos puede continuar al checkout');
 });

 test('Tabla de decisión - Regla 2: logueado sin items -> carrito vacío', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    // Ir directamente al carrito sin agregar productos
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart/);

    const itemsCarrito = page.locator('.cart_item');

    await expect(itemsCarrito).toHaveCount(0);

    console.log('Regla 2: usuario logueado con carrito vacío');
 });

 test('Reto 1 - Ordenar productos por precio con toHaveValue()', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    const selectorOrden = page.locator('[data-test="product-sort-container"]');

    // Ordenar de menor a mayor precio
    await selectorOrden.selectOption('lohi');

    // Verificar que la opción seleccionada sea "lohi"
    await expect(selectorOrden).toHaveValue('lohi');

    // Verificar que el primer producto ahora sea el de menor precio
    const primerPrecio = page.locator('.inventory_item_price').first();

    await expect(primerPrecio).toHaveText('$7.99');

    console.log('Productos ordenados correctamente de menor a mayor precio');
    console.log('Primer precio:', await primerPrecio.textContent());
 });

 test('Reto 2 - Verificar foco del campo de usuario con toBeFocused()', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const campoUsuario = page.locator('#user-name');

    await campoUsuario.click();

    await expect(campoUsuario).toBeFocused();

    console.log('El campo de usuario recibió correctamente el foco');
 });

 test('Reto 3 - Verificar CSS del botón Add to cart con toHaveCSS()', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);

    const botonAgregar = page.locator('.btn_inventory').first();

    await expect(botonAgregar).toHaveCSS('cursor', 'pointer');

    console.log('El botón Add to cart tiene cursor: pointer');
 });

});