const { test, expect } = require('./fixtures');

test('page creation opens a new tab with generated content', async ({ context, serviceWorker }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openMenu()),
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  await expect(newPage.locator('#__menu_extension_root__')).toHaveText('Hello World');
});
