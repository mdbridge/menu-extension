const MENU_PAGE_URL = 'file:///C:/Users/Mark/Documents/menu_extension/menu.html';

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-menu") {
    openMenu();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabs') {
    const menuTabId = sender.tab?.id;
    chrome.tabs.query({}).then(tabs => {
      const filtered = tabs
        .filter(tab => tab.id !== menuTabId)
        .map(tab => ({ id: tab.id, title: tab.title, url: tab.url }));
      sendResponse(filtered);
    });
    return true; // keep message port open for async response
  }

  if (message.action === 'switchTab') {
    chrome.tabs.update(message.tabId, { active: true });
    if (message.closeSource && sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  }
});

function openMenu() {
  chrome.tabs.create({ url: MENU_PAGE_URL });
}
