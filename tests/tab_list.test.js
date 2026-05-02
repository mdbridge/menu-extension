const { test, expect, openMenuPage } = require('./fixtures');

test('menu lists other open tabs', async ({ context, serviceWorker }) => {
  const tab1 = await context.newPage();
  await tab1.goto('data:text/html,<title>Test Tab One</title><body>Tab 1</body>');

  const tab2 = await context.newPage();
  await tab2.goto('data:text/html,<title>Test Tab Two</title><body>Tab 2</body>');

  const menuPage = await openMenuPage(context, serviceWorker);

  const root = menuPage.locator('#__menu_extension_root__');
  await expect(root.locator('a', { hasText: 'Test Tab One' })).toBeVisible();
  await expect(root.locator('a', { hasText: 'Test Tab Two' })).toBeVisible();
});
