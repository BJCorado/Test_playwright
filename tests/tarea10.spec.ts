import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

/**
 * TAREA 10 - Tests reto: tags multiples, soft assertions y cross-browser
 *
 * Ejecucion sugerida:
 *   npx playwright test tests/tarea10.spec.ts
 *   npx playwright test tests/tarea10.spec.ts --grep "@regression" --grep-invert "@ui"
 *   npx playwright test tests/tarea10.spec.ts --grep-invert "@cart"
 *   npx playwright test tests/tarea10.spec.ts --grep "@cross-browser" --project=webkit
 */
test.describe('Tarea 10 - Sauce Demo', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  // ─────────────────────────────────────────────────────────────
  // RETO 1: Tags multiples + --grep-invert
  // Cada test lleva mas de un tag. Con --grep incluyo y con
  // --grep-invert excluyo, por ejemplo:
  //   --grep "@regression" --grep-invert "@ui"  -> solo corre el de @cart
  //   --grep-invert "@cart"                     -> excluye el del carrito
  // ─────────────────────────────────────────────────────────────
  test('Reto 1a: El logo y el titulo del inventario se muestran',
    { tag: ['@regression', '@ui'] }, async ({ page }) => {
    await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('Reto 1b: El contador del carrito sube al agregar 2 productos',
    { tag: ['@regression', '@cart'] }, async ({ page }) => {
    const botones = page.locator('.btn_inventory');
    await botones.nth(0).click();
    await botones.nth(1).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  // ─────────────────────────────────────────────────────────────
  // RETO 2: expect.soft()
  // Se verifican varios atributos del primer producto. Si uno falla,
  // el test NO se detiene: sigue verificando los demas y al final
  // testInfo.errors contiene todos los fallos juntos.
  // ─────────────────────────────────────────────────────────────
  test('Reto 2: Atributos del primer producto con soft assertions',
    { tag: ['@regression', '@soft'] }, async ({ page }, testInfo) => {
    const producto = page.locator('.inventory_item').first();

    await expect.soft(producto.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect.soft(producto.locator('.inventory_item_desc')).toContainText('carry.allTheThings()');
    await expect.soft(producto.locator('.inventory_item_price')).toHaveText('$29.99');
    await expect.soft(producto.locator('img.inventory_item_img')).toBeVisible();
    await expect.soft(producto.locator('.btn_inventory')).toHaveText('Add to cart');

    // Reporte de todos los errores acumulados (si los hubo)
    if (testInfo.errors.length > 0) {
      console.log(`[${testInfo.project.name}] Fallaron ${testInfo.errors.length} verificaciones soft:`);
      testInfo.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e.message?.split('\n')[0]}`));
    }

    // Esta asercion "dura" deja claro al final que no debe haber fallos acumulados
    expect(testInfo.errors, 'No deberia haber fallos en las soft assertions').toHaveLength(0);
  });

  // ─────────────────────────────────────────────────────────────
  // RETO 3: fixture browserName
  // En lugar de saltar el test con test.skip() en algun navegador,
  // se ajusta la asercion segun el motor real en el que corre.
  // (mobile-chrome usa chromium y mobile-safari usa webkit)
  // ─────────────────────────────────────────────────────────────
  test('Reto 3: El user agent corresponde al motor real del navegador',
    { tag: ['@regression', '@cross-browser'] }, async ({ page, browserName }) => {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`[${browserName}] userAgent: ${userAgent}`);

    if (browserName === 'chromium') {
      expect(userAgent).toContain('Chrome');
    } else if (browserName === 'firefox') {
      expect(userAgent).toContain('Firefox');
    } else if (browserName === 'webkit') {
      expect(userAgent).toContain('AppleWebKit');
      expect(userAgent).not.toContain('Chrome');
    }

    // La parte funcional se valida igual en todos los motores
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const precios = await page.locator('.inventory_item_price').allTextContents();
    const numericos = precios.map(p => parseFloat(p.replace('$', '')));
    expect(numericos).toEqual([...numericos].sort((a, b) => b - a));
  });

});