import { test, expect, openTabMenuPage } from '../fixtures.js';

test('clicking a tab switches to it and closes the menu', async ({ context, serviceWorker }) => {
  const targetPage = await context.newPage();
  await targetPage.goto('data:text/html,<title>Target Tab</title><body>target</body>');

  // Decoy tab opened after target — this becomes the previously-active tab
  // before the menu opens, so Chrome's default on menu-close would activate
  // it rather than the target. Our code must beat that default.
  const decoyPage = await context.newPage();
  await decoyPage.goto('data:text/html,<title>Decoy Tab</title><body>decoy</body>');

  const menuPage = await openTabMenuPage(context, serviceWorker);

  await Promise.all([
    menuPage.waitForEvent('close'),
    menuPage.locator('a', { hasText: 'Target Tab' }).click(),
  ]);

  const activeTabs = await serviceWorker.evaluate(() =>
    chrome.tabs.query({ active: true })
  );
  expect(activeTabs.some(t => t.title === 'Target Tab')).toBe(true);
  expect(activeTabs.some(t => t.title === 'Decoy Tab')).toBe(false);
});
