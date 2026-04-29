const MENU_PAGE_URL = 'file:///C:/Users/Mark/Documents/menu_extension/menu.html';

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-menu") {
    openMenu();
  }
});

function openMenu() {
  chrome.tabs.create({ url: MENU_PAGE_URL });
}
