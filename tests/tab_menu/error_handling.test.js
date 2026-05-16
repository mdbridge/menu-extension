import { test, expect, openTabMenuPage } from '../fixtures.js';

test('clicking a tab that no longer exists shows an error and keeps the menu open',
  async ({ context, serviceWorker }) => {
    const targetPage = await context.newPage();
    await targetPage.goto('data:text/html,<title>Target Tab</title><body>target</body>');

    const menuPage = await openTabMenuPage(context, serviceWorker);

    await targetPage.close();

    await menuPage.locator('a', { hasText: 'Target Tab' }).click();

    await expect(menuPage.locator('.error-message')).toBeVisible();
    expect(menuPage.isClosed()).toBe(false);
  });

test('esc when previous tab no longer exists just closes the menu',
  async ({ context, serviceWorker }) => {
    const prevPage = await context.newPage();
    await prevPage.goto('data:text/html,<title>Previous Tab</title><body>previous</body>');
    await prevPage.bringToFront();

    const menuPage = await openTabMenuPage(context, serviceWorker);

    await prevPage.close();

    await Promise.all([
      menuPage.waitForEvent('close'),
      menuPage.keyboard.down('Escape'),
    ]);
  });
