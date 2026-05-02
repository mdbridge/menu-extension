const { test, expect } = require('./fixtures');

test('esc closes the menu and returns to the previous tab', async ({ context, serviceWorker }) => {
  const prevPage = await context.newPage();
  await prevPage.goto('data:text/html,<title>Previous Tab</title><body>previous</body>');
  await prevPage.bringToFront();

  const [menuPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openMenu()),
  ]);
  await menuPage.waitForLoadState('domcontentloaded');
  await menuPage.waitForSelector('a[data-tab-id]');

  await Promise.all([
    menuPage.waitForEvent('close'),
    menuPage.keyboard.press('Escape'),
  ]);

  const activeTabs = await serviceWorker.evaluate(() =>
    chrome.tabs.query({ active: true })
  );
  expect(activeTabs.some(t => t.title === 'Previous Tab')).toBe(true);
});
