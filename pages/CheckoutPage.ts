import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Paso 1: formulario de información
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  // Paso 2: resumen de la orden
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;

  // Paso 3: confirmación
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');

    this.summaryTotal = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async finish() {
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toContainText('Thank you for your order');
  }

  // Método de alto nivel: hace los 3 pasos del checkout de una sola vez
  async completePurchase(firstName: string, lastName: string, postalCode: string) {
    await this.fillInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
    await this.finish();
    await this.expectOrderComplete();
  }
}