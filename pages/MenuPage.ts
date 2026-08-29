import { Page, Locator, expect } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetLink = page.locator('#reset_sidebar_link');
  }

  async open() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async close() {
    await this.closeButton.click();
    await expect(this.logoutLink).toBeHidden();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }

  async resetAppState() {
    await this.open();
    await this.resetLink.click();
    await this.close();
  }

  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}