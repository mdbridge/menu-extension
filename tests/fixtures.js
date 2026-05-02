const { test: base, chromium } = require('@playwright/test');
const path = require('path');

const extensionPath = path.resolve(__dirname, '..');

const test = base.extend({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    await use(context);
    await context.close();
  },

  serviceWorker: async ({ context }, use) => {
    let worker = context.serviceWorkers()[0];
    if (!worker) {
      worker = await context.waitForEvent('serviceworker');
    }
    await use(worker);
  },
});

async function openMenuPage(context, serviceWorker) {
  const [menuPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openMenu()),
  ]);
  await menuPage.waitForLoadState('domcontentloaded');
  await menuPage.waitForSelector('a[data-tab-id]');
  return menuPage;
}

module.exports = { test, expect: test.expect, openMenuPage };
