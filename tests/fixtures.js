import { test as base, chromium } from '@playwright/test';
import { fileURLToPath } from 'url';

const extensionPath = fileURLToPath(new URL('..', import.meta.url));

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

async function openTabMenuPage(context, serviceWorker) {
  const [menuPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openTabMenu()),
  ]);
  await menuPage.waitForLoadState('domcontentloaded');
  await menuPage.waitForSelector('a[data-tab-id]');
  return menuPage;
}

async function openWindowMenuPage(context, serviceWorker) {
  const [menuPage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(() => openWindowMenu()),
  ]);
  await menuPage.waitForLoadState('domcontentloaded');
  await menuPage.waitForSelector('a[data-tab-id]');
  return menuPage;
}

const expect = test.expect;

export { test, expect, openTabMenuPage, openWindowMenuPage };
