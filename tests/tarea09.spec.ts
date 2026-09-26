import { test as base, expect } from '@playwright/test';

// ============================================================
// Fixtures propios de la tarea
// ============================================================
type TestFixtures = {
  cronometro: number;                 // Reto 1 (alcance test)
};

type WorkerFixtures = {
  contadorWorker: { valor: number };  // Reto 2 (alcance worker)
};

const test = base.extend<TestFixtures, WorkerFixtures>({

  // RETO 1: fixture con teardown real (código DESPUÉS de use)
  cronometro: async ({}, use, testInfo) => {
    // --- SETUP ---
    const inicio = Date.now();
    console.log(`[setup] Cronómetro iniciado para: "${testInfo.title}"`);

    await use(inicio);

    // --- TEARDOWN (corre aunque el test falle) ---
    const duracion = Date.now() - inicio;
    console.log(
      `[teardown] "${testInfo.title}" tardó ${duracion} ms ` +
      `(estado: ${testInfo.status}, esperado: ${testInfo.expectedStatus})`
    );
  },

  // RETO 2: fixture de alcance worker (se crea UNA vez por worker)
  contadorWorker: [async ({}, use, workerInfo) => {
    const contador = { valor: 0 };
    console.log(`[worker ${workerInfo.workerIndex}] contador creado en 0`);
    await use(contador);
    console.log(`[worker ${workerInfo.workerIndex}] contador final: ${contador.valor}`);
  }, { scope: 'worker' }],

});

const loginStandard = async (page: import('@playwright/test').Page) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
};

// ============================================================
// RETO 1 — Fixture con teardown real
// ============================================================
test.describe('Tarea 09 - Reto 1: fixture con teardown', () => {

  test('Login exitoso medido con cronómetro', async ({ page, cronometro }) => {
    await loginStandard(page);
    await expect(page).toHaveURL(/inventory/);
    console.log(`Tiempo parcial: ${Date.now() - cronometro} ms`);
  });

  test('El teardown corre aunque el test falle', async ({ page, cronometro }) => {
    // test.fail() marca que ESPERAMOS que falle: el reporte sale en verde,
    // pero el cuerpo sí falla y aun así el teardown imprime el tiempo.
    test.fail();
    await loginStandard(page);
    await expect(page).toHaveURL(/checkout/, { timeout: 2000 }); // falla a propósito
  });

});

// ============================================================
// RETO 2 — Fixture de alcance worker
// ============================================================
test.describe('Tarea 09 - Reto 2: fixture de alcance worker', () => {
  // serial = ambos tests corren en el MISMO worker y en orden
  test.describe.configure({ mode: 'serial' });

  test('Primer test: contador sube a 1', async ({ contadorWorker }, testInfo) => {
    contadorWorker.valor++;
    console.log(`[worker ${testInfo.workerIndex}] contador = ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(1);
  });

  test('Segundo test: contador sube a 2 (el estado persistió)', async ({ contadorWorker }, testInfo) => {
    contadorWorker.valor++;
    console.log(`[worker ${testInfo.workerIndex}] contador = ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(2);
  });

});

// ============================================================
// RETO 3 — test.use() + parametrización de viewports
// ============================================================
const viewports = [
  { nombre: 'móvil', width: 375, height: 667 },
  { nombre: 'escritorio', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(`Tarea 09 - Reto 3: viewport ${vp.nombre}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`Login e inventario en ${vp.nombre} (${vp.width}x${vp.height})`, async ({ page }) => {
      await loginStandard(page);
      await expect(page).toHaveURL(/inventory/);

      // Confirmar que realmente se aplicó el viewport
      expect(page.viewportSize()).toEqual({ width: vp.width, height: vp.height });

      // El mismo test debe pasar en ambos tamaños
      await expect(page.locator('.inventory_item')).toHaveCount(6);
      await expect(page.locator('.shopping_cart_link')).toBeVisible();
      console.log(`Viewport ${vp.nombre}: inventario OK`);
    });
  });
}