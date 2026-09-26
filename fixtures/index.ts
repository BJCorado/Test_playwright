import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
};

export const test = base.extend<AppFixtures>({
  // Fixture: instancia de LoginPage lista para usar
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await use(lp);
  },

  // Fixture: ya logueado como standard_user
  inventoryPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);
    const ip = new InventoryPage(page);
    await use(ip);
  },

  // Fixture: carrito con 1 producto ya agregado
  cartPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);
    // Agregar el primer producto
    await page.locator('.btn_inventory').first().click();
    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);
    // .count() NO espera automáticamente: esperamos a que el item se renderice
    await expect(page.locator('.cart_item').first()).toBeVisible();
    const cp = new CartPage(page);
    await use(cp);
  },
});

export { expect } from '@playwright/test';