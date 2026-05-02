const { test, expect, openMenuPage } = require('./fixtures');

test('enter selects the highlighted tab', async ({ context, serviceWorker }) => {
  const targetPage = await context.newPage();
  await targetPage.goto('data:text/html,<title>Target Tab</title><body>target</body>');

  // Decoy opened after target — Chrome's default on menu-close would activate
  // it rather than target. Our Enter key must explicitly activate the highlighted
  // (target) tab instead.
  const decoyPage = await context.newPage();
  await decoyPage.goto('data:text/html,<title>Decoy Tab</title><body>decoy</body>');

  await targetPage.bringToFront();

  const menuPage = await openMenuPage(context, serviceWorker);

  await Promise.all([
    menuPage.waitForEvent('close'),
    menuPage.keyboard.press('Enter'),
  ]);

  const activeTabs = await serviceWorker.evaluate(() =>
    chrome.tabs.query({ active: true })
  );
  expect(activeTabs.some(t => t.title === 'Target Tab')).toBe(true);
  expect(activeTabs.some(t => t.title === 'Decoy Tab')).toBe(false);
});

test('esc closes the menu and returns to the previous tab', async ({ context, serviceWorker }) => {
  const prevPage = await context.newPage();
  await prevPage.goto('data:text/html,<title>Previous Tab</title><body>previous</body>');
  await prevPage.bringToFront();

  const menuPage = await openMenuPage(context, serviceWorker);

  await Promise.all([
    menuPage.waitForEvent('close'),
    menuPage.keyboard.press('Escape'),
  ]);

  const activeTabs = await serviceWorker.evaluate(() =>
    chrome.tabs.query({ active: true })
  );
  expect(activeTabs.some(t => t.title === 'Previous Tab')).toBe(true);
});
