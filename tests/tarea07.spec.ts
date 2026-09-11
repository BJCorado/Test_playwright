import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Tarea 07 - Evidencias avanzadas', () => {

    // ─────────────────────────────────────────────────────────────
    // RETO 1 — test.step()
    // Cada paso aparece por separado en el reporte HTML y en el trace.
    // ─────────────────────────────────────────────────────────────
    test('Reto 1 - Flujo de login estructurado en pasos nombrados', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await test.step('Navegar a la pagina de login', async () => {
            await loginPage.navigate();
            await expect(page.locator('[data-test="login-button"]')).toBeVisible();
            await page.screenshot({ path: './evidencias/tarea07/reto1-paso1-login.png' });
        });

        await test.step('Iniciar sesion con standard_user', async () => {
            await loginPage.login('standard_user', 'secret_sauce');
            await expect(page).toHaveURL(/inventory/);
        });

        await test.step('Verificar el inventario cargado', async () => {
            await inventoryPage.expectToBeOnInventoryPage();
            await expect(page.locator('.inventory_item')).toHaveCount(6);
            await page.screenshot({
                path: './evidencias/tarea07/reto1-paso3-inventario.png', fullPage: true
            });
        });

        console.log('Reto 1: test estructurado en 3 pasos nombrados');
    });

    // ─────────────────────────────────────────────────────────────
    // RETO 2 — testInfo.attach()
    // Adjunta un .txt (y un .png) directamente al reporte HTML.
    // Se accede al segundo parametro del callback: ({ page }, testInfo)
    // ─────────────────────────────────────────────────────────────
    test('Reto 2 - Adjuntar datos capturados al reporte HTML', async ({ page }, testInfo) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);

        // Datos capturados en vivo desde la pagina
        const cantidadProductos = await page.locator('.inventory_item').count();
        const urlActual = page.url();
        const fecha = new Date().toLocaleString('es-GT');
        const primerProducto = await page.locator('.inventory_item_name').first().textContent();

        const contenido = [
            '=== EVIDENCIA DE EJECUCION - Tarea 07 ===',
            `Fecha y hora   : ${fecha}`,
            `URL            : ${urlActual}`,
            `Navegador      : ${testInfo.project.name}`,
            `Productos      : ${cantidadProductos}`,
            `Primer producto: ${primerProducto}`,
            `Test           : ${testInfo.title}`,
        ].join('\n');

        // Adjunto 1: archivo de texto con los datos capturados
        await testInfo.attach('datos-capturados.txt', {
            body: contenido,
            contentType: 'text/plain',
        });

        // Adjunto 2: screenshot en memoria (sin guardarlo en disco)
        await testInfo.attach('inventario.png', {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });

        expect(cantidadProductos).toBe(6);
        console.log(`Reto 2: ${cantidadProductos} productos adjuntados al reporte`);
    });

    // ─────────────────────────────────────────────────────────────
    // RETO 3 — toHaveScreenshot()
    // Comparacion visual contra un baseline.
    // La PRIMERA corrida crea el baseline y el test FALLA (es normal).
    // La segunda corrida ya compara y pasa. Los .png del baseline
    // se guardan en tests/tarea07.spec.ts-snapshots/ y van al repo.
    // ─────────────────────────────────────────────────────────────
    test('Reto 3 - Comparacion visual contra baseline', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();

        // Baseline 1: pantalla de login completa
        await expect(page).toHaveScreenshot('login-baseline.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02,   // tolerancia a diferencias minimas de render
        });

        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);

        // Baseline 2: solo el header del inventario (zona visualmente estable)
        await expect(page.locator('.primary_header')).toHaveScreenshot('header-inventario.png');

        console.log('Reto 3: comparacion visual completada contra el baseline');
    });

});