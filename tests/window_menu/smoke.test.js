const { test, expect, openWindowMenuPage } = require('../fixtures');

test('window menu opens and shows one item per window', async ({ context, serviceWorker }) => {
  const menuPage = await openWindowMenuPage(context, serviceWorker);
  const items = menuPage.locator('#__menu_extension_root__ a[data-tab-id]');
  await expect(items).toHaveCount(1);
});
