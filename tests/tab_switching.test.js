const { test, expect } = require('./fixtures');

test('clicking a tab switches to it and closes the menu', async ({ context, serviceWorker }) => {
  const targetPage = await context.newPage();
  await targetPage.goto('data:text/html,<title>Target Tab</title><body>target</body>');

  const [menuPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openMenu()),
  ]);
  await menuPage.waitForLoadState('domcontentloaded');
  await menuPage.waitForSelector('a[data-tab-id]');

  await Promise.all([
    menuPage.waitForEvent('close'),
    menuPage.locator('a', { hasText: 'Target Tab' }).click(),
  ]);

  const activeTabs = await serviceWorker.evaluate(() =>
    chrome.tabs.query({ active: true })
  );
  expect(activeTabs.some(t => t.title === 'Target Tab')).toBe(true);
});
