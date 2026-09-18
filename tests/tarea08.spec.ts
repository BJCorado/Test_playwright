// tests/tarea08.spec.ts
import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../helpers/auth';

// ============================================================================
// RETO 1: Suite serial con página compartida
// ============================================================================
// test.describe.configure({ mode: 'serial' }) hace que los tests se ejecuten
// en orden y que si uno falla, los siguientes se marquen como omitidos.
// PERO por sí solo NO comparte la page entre tests: cada test normalmente
// recibe su propia page nueva. Para compartirla de verdad, la creamos
// nosotros mismos en un beforeAll (fuera del fixture) y la reutilizamos.
test.describe('Tarea 08 - Reto 1: Suite serial con página compartida', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  // Se ejecuta UNA VEZ antes de todos los tests de esta suite.
  // Creamos la page manualmente desde el browser del worker y hacemos
  // login una sola vez; esa misma instancia viajará de test en test.
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  // Se ejecuta UNA VEZ después de todos los tests: cerramos la page.
  test.afterAll(async () => {
    await page.close();
  });

  // Test 1: agregamos un producto al carrito (NO recibimos { page } del
  // fixture, usamos la variable compartida declarada arriba)
  test('Agrega un producto al carrito', async () => {
    await page.locator('.btn_inventory').first().click();
    const contador = page.locator('.shopping_cart_badge');
    await expect(contador).toHaveText('1');
  });

  // Test 2: depende del estado dejado por el test anterior (carrito con 1
  // producto). Esto solo funciona porque la page es la misma y el modo es
  // serial (orden garantizado).
  test('El carrito conserva el producto agregado', async () => {
    await page.locator('.shopping_cart_link').click();
    const items = page.locator('.cart_item');
    await expect(items).toHaveCount(1);
  });

  // Test 3: seguimos sobre la misma page/estado para completar el checkout
  test('Se puede proceder al checkout desde el carrito compartido', async () => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});

// ============================================================================
// RETO 2: test.slow()
// ============================================================================
// En vez de confiar en el timeout global (30 000 ms) para absorber el delay
// artificial de performance_glitch_user, marcamos el test como 'slow' con
// test.slow(), lo cual triplica SOLO el timeout de ese test.
test.describe('Tarea 08 - Reto 2: test.slow()', () => {
  test('Usuario con rendimiento degradado - timeout triplicado', async ({ page }) => {
    // Marca este test como lento: su timeout pasa de 30 000 ms a 90 000 ms
    test.slow();

    const inicio = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const tiempoLogin = Date.now() - inicio;

    console.log(`Tiempo de login (glitch user, timeout x3): ${tiempoLogin}ms`);
    await expect(page).toHaveURL(/inventory/);
  });
});

// ============================================================================
// RETO 3: test.skip() dinámico
// ============================================================================
// A diferencia de test.skip(condición) en la declaración del test, aquí
// evaluamos la condición DENTRO del cuerpo del test, en tiempo de ejecución,
// y documentamos la razón por la que se omite.
test.describe('Tarea 08 - Reto 3: test.skip() dinámico', () => {
  test('Verifica precio del primer producto, si está disponible', async ({ page }) => {
    await loginAs(page, 'standard_user');

    const primerProducto = page.locator('.inventory_item').first();
    const nombre = await primerProducto.locator('.inventory_item_name').textContent();

    // Condición evaluada en tiempo de ejecución: si el producto esperado
    // no existe en este momento (p. ej. cambió el catálogo de la demo),
    // omitimos el test dinámicamente y documentamos por qué.
    const esperado = 'Sauce Labs Backpack';
    test.skip(
      nombre !== esperado,
      `Se omite: se esperaba "${esperado}" como primer producto, pero se encontró "${nombre}". ` +
        `El catálogo de la demo pudo haber cambiado el orden.`
    );

    const precio = primerProducto.locator('.inventory_item_price');
    await expect(precio).toHaveText('$29.99');
  });
});