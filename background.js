const MENU_PAGE_URL = 'file:///C:/Users/Mark/Documents/menu_extension/menu.html';

let previousTabId = null;
let previousWindowId = null;

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-menu") {
    openMenu();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabs') {
    const menuTabId = sender.tab?.id;
    const menuWindowId = sender.tab?.windowId;
    chrome.tabs.query({ windowId: menuWindowId }).then(tabs => {
      const filtered = tabs
        .filter(tab => tab.id !== menuTabId)
        .map(tab => ({ id: tab.id, title: tab.title, url: tab.url, favIconUrl: tab.favIconUrl }));
      sendResponse({ tabs: filtered, previousTabId });
    });
    return true; // keep message port open for async response
  }

  if (message.action === 'dismissMenu') {
    (async () => {
      if (previousTabId !== null) {
        await chrome.tabs.update(previousTabId, { active: true }).catch(() => {});
        if (previousWindowId !== null) {
          await chrome.windows.update(previousWindowId, { focused: true }).catch(() => {});
        }
      }
      if (sender.tab?.id) {
        await chrome.tabs.remove(sender.tab.id);
      }
      if (previousTabId !== null) {
        await chrome.tabs.update(previousTabId, { active: true }).catch(() => {});
        if (previousWindowId !== null) {
          await chrome.windows.update(previousWindowId, { focused: true }).catch(() => {});
        }
      }
    })();
  }

  if (message.action === 'switchTab') {
    (async () => {
      const targetTabId = message.tabId;
      const targetTab = await chrome.tabs.get(targetTabId);
      await chrome.tabs.update(targetTabId, { active: true });
      await chrome.windows.update(targetTab.windowId, { focused: true });
      if (message.closeSource && sender.tab?.id) {
        await chrome.tabs.remove(sender.tab.id);
        await chrome.tabs.update(targetTabId, { active: true });
        await chrome.windows.update(targetTab.windowId, { focused: true });
      }
    })();
  }
});

async function openMenu() {
  const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  previousTabId = activeTab?.id ?? null;
  previousWindowId = activeTab?.windowId ?? null;
  chrome.tabs.create({ url: MENU_PAGE_URL });
}
