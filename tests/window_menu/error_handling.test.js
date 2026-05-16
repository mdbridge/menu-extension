import { test, expect, openWindowMenuPage } from '../fixtures.js';

test('clicking current window entry when its previous tab no longer exists shows an error',
  async ({ context, serviceWorker }) => {
    const prevPage = await context.newPage();
    await prevPage.goto('data:text/html,<title>Previous Tab</title><body>prev</body>');
    await prevPage.bringToFront();

    const menuPage = await openWindowMenuPage(context, serviceWorker);
    await prevPage.close();

    await menuPage.locator('a[data-tab-id]').click();

    await expect(menuPage.locator('.error-message')).toBeVisible();
    expect(menuPage.isClosed()).toBe(false);
  });

test('clicking a different-window entry whose active tab no longer exists shows an error',
  async ({ context, serviceWorker }) => {
    const originalWindowId = await serviceWorker.evaluate(async () =>
      (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id
    );

    // Create second window with two tabs: extra tab first, then the active one.
    // The active tab (created last) is the one the menu will display for this window,
    // and the one we'll close to trigger the error.
    const [, , { activeTabId }] = await Promise.all([
      context.waitForEvent('page'), // extra tab (from windows.create)
      context.waitForEvent('page'), // active tab (from tabs.create)
      serviceWorker.evaluate(async () => {
        const win = await chrome.windows.create({ url: 'about:blank' });
        const tab = await chrome.tabs.create(
          { windowId: win.id, url: 'about:blank', active: true }
        );
        return { activeTabId: tab.id };
      }),
    ]);

    // Re-focus the original window so the menu opens there.
    await serviceWorker.evaluate(
      (id) => chrome.windows.update(id, { focused: true }), originalWindowId
    );

    const menuPage = await openWindowMenuPage(context, serviceWorker);

    // Close the active tab; window survives with the extra tab.
    await serviceWorker.evaluate((id) => chrome.tabs.remove(id), activeTabId);

    await menuPage.waitForSelector('li.highlighted');
    await menuPage.locator('li:not(.highlighted) a[data-tab-id]').click();

    await expect(menuPage.locator('.error-message')).toBeVisible();
    expect(menuPage.isClosed()).toBe(false);
  });

test('clicking a window entry whose window no longer exists shows an error',
  async ({ context, serviceWorker }) => {
    const originalWindowId = await serviceWorker.evaluate(async () =>
      (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id
    );

    const [, { secondWindowId }] = await Promise.all([
      context.waitForEvent('page'),
      serviceWorker.evaluate(async () => {
        const win = await chrome.windows.create({ url: 'about:blank' });
        return { secondWindowId: win.id };
      }),
    ]);

    await serviceWorker.evaluate(
      (id) => chrome.windows.update(id, { focused: true }), originalWindowId
    );

    const menuPage = await openWindowMenuPage(context, serviceWorker);

    // Close the entire second window.
    await serviceWorker.evaluate((id) => chrome.windows.remove(id), secondWindowId);

    await menuPage.waitForSelector('li.highlighted');
    await menuPage.locator('li:not(.highlighted) a[data-tab-id]').click();

    await expect(menuPage.locator('.error-message')).toBeVisible();
    expect(menuPage.isClosed()).toBe(false);
  });

test('esc when previous tab no longer exists just closes the window menu',
  async ({ context, serviceWorker }) => {
    const prevPage = await context.newPage();
    await prevPage.goto('data:text/html,<title>Previous Tab</title><body>prev</body>');
    await prevPage.bringToFront();

    const menuPage = await openWindowMenuPage(context, serviceWorker);

    await prevPage.close();

    await Promise.all([
      menuPage.waitForEvent('close'),
      menuPage.keyboard.down('Escape'),
    ]);
  });
