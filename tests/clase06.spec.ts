import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuPage } from '../pages/MenuPage';

test.describe('Clase 06 - Page Object Model en Sauce Demo', () => {

  // TEST 1 de 5
  test('Login exitoso con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectToBeOnInventoryPage();

    console.log('Login con POM exitoso');
  });

  // TEST 2 de 5
  test('Login fallido con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('wrong_user', 'wrong_pass');

    await loginPage.expectLoginError(
      'Username and password do not match');

    console.log('Error de login capturado con POM');
  });

  // TEST 3 de 5
  test('Flujo completo: login -> agregar 2 productos -> verificar carrito', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // Agregar productos por nombre
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');

    // Verificar badge del carrito
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Ir al carrito
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);

    console.log('Flujo completo con POM: 2 productos en carrito');
  });

  // TEST 4 de 5
  test('Verificar que el inventario tiene 6 productos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  // TEST 5 de 5
  test('Ordenar productos de mayor a menor precio', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    // Ordenar de mayor a menor precio
    await inventoryPage.sortBy('hilo');

    const precios = page.locator('.inventory_item_price');
    const primerPrecio = await precios.first().textContent();

    // Los precios deben estar en orden descendente
    const todosLosPrecios = await precios.allTextContents();
    const numericos = todosLosPrecios.map(
      p => parseFloat(p.replace('$', '')));
    for (let i = 0; i < numericos.length - 1; i++) {
      expect(numericos[i]).toBeGreaterThanOrEqual(numericos[i + 1]);
    }
  });

  // ============================================================
  // TAREA 06 - TESTS RETO
  // ============================================================

  // RETO 1 - Nuevo Page Object: CheckoutPage
  test('Reto 1 - Compra completa de principio a fin con CheckoutPage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // Agregar productos y verificar el carrito
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);

    // Checkout: paso 1 -> paso 2 -> paso 3
    await cartPage.proceedToCheckout();
    await checkoutPage.completePurchase('Juan', 'Perez', '01001');

    // El carrito queda vacio tras la compra
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    console.log('Reto 1: compra completada de principio a fin');
  });

  // RETO 2 - Nuevo Page Object: MenuPage
  test('Reto 2 - Logout desde el menu hamburguesa con MenuPage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // Abrir el menu y cerrar sesion
    await menuPage.logout();

    // Debe volver a la pantalla de login
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.inventoryContainer).toHaveCount(0);

    console.log('Reto 2: logout exitoso con MenuPage');
  });

  // RETO 3 - removeProductByName() en InventoryPage
  test('Reto 3 - removeProductByName: el badge desaparece al llegar a 0', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // Agregar 2 productos
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(2);

    // Quitar uno: el badge baja a 1
    await inventoryPage.removeProductByName('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(1);

    // Quitar el ultimo: el badge desaparece
    await inventoryPage.removeProductByName('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeHidden();

    console.log('Reto 3: badge del carrito desaparece al llegar a 0');
  });

});