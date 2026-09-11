import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Clase 07 - Evidencias de pruebas', () => {
    test('Login exitoso - evidencia completa', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.navigate();
        // Screenshot antes del login
        await page.screenshot({
            path: './evidencias/clase07/t01-antes-login.png', fullPage: true
        });

        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.expectToBeOnInventoryPage();
        // Screenshot después del login
        await page.screenshot({
            path: './evidencias/clase07/t01-despues-login.png', fullPage: true
        });
        console.log('Login documentado con screenshots');
    });


    test('Documentar el flujo de compra completo', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory/);
        // Screenshot del inventario
        await page.screenshot({ path: './evidencias/clase07/t02-inventario.png' });
        // Agregar producto
        await page.locator('.btn_inventory').first().click();
        const nombreProducto = await page.locator('.inventory_item_name')
            .first().textContent();

        // Screenshot con producto agregado
        await page.screenshot({ path: './evidencias/clase07/t02-producto-agregado.png' });
        // Ir al carrito
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(/cart/);
        // Screenshot del carrito
        await page.screenshot({ path: './evidencias/clase07/t02-carrito.png', fullPage: true });
        // Verificar
        await expect(page.locator('.cart_item')).toHaveCount(1);
        await expect(page.locator('.inventory_item_name')).toContainText(nombreProducto!);
        console.log(`Flujo documentado. Producto: ${nombreProducto}`);
    });

    test('Capturar el momento exacto de un defecto esperado', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        // Intentar login con usuario bloqueado
        await loginPage.login('locked_out_user', 'secret_sauce');
        // Capturar el error tal como aparece
        const errorElement = page.locator('[data-test="error"]');
        await expect(errorElement).toBeVisible();
        // Screenshot específico del elemento de error (no de toda la página)
        await errorElement.screenshot({
            path: './evidencias/clase07/t03-error-usuario-bloqueado.png' });
        const textoError = await errorElement.textContent();
        console.log(`Error capturado: ${textoError}`);
    });


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
    
});