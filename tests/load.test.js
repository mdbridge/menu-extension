const { test, expect } = require('./fixtures');

test('extension loads without errors', async ({ serviceWorker }) => {
  expect(serviceWorker.url()).toMatch(/^chrome-extension:\/\//);
});
