const MENU_PAGE_URL = 'file:///C:/Users/Mark/Documents/menu_extension/menu.html';

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
        .map(tab => ({ id: tab.id, title: tab.title, url: tab.url }));
      sendResponse(filtered);
    });
    return true; // keep message port open for async response
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

function openMenu() {
  chrome.tabs.create({ url: MENU_PAGE_URL });
}
