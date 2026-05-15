import { test, expect } from './fixtures.js';

test('extension loads without errors', async ({ serviceWorker }) => {
  expect(serviceWorker.url()).toMatch(/^chrome-extension:\/\//);
});
