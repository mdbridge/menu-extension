const { test, expect, openTabMenuPage } = require('../fixtures');

test('page creation opens a new tab with generated content', async ({ context, serviceWorker }) => {
  const newPage = await openTabMenuPage(context, serviceWorker);
  await expect(newPage.locator('#__menu_extension_root__')).toBeVisible();
});
