const { test, expect, openMenuPage } = require('./fixtures');

test('page creation opens a new tab with generated content', async ({ context, serviceWorker }) => {
  const newPage = await openMenuPage(context, serviceWorker);
  await expect(newPage.locator('#__menu_extension_root__')).toBeVisible();
});
