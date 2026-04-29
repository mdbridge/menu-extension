const root = document.getElementById('__menu_extension_root__');
if (root) {
  const isMenuPage = window.location.protocol === 'file:' &&
                     window.location.pathname.endsWith('/menu_extension/menu.html');

  chrome.runtime.sendMessage({ action: 'getTabs' }, (tabs) => {
    root.innerHTML = '';
    const ul = document.createElement('ul');
    for (const tab of tabs) {
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.href = '#';
      a.textContent = tab.title || '(untitled)';
      a.dataset.tabId = tab.id;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
          action: 'switchTab',
          tabId: tab.id,
          closeSource: isMenuPage,
        });
      });

      const div = document.createElement('div');
      div.textContent = tab.url;

      li.appendChild(a);
      li.appendChild(div);
      ul.appendChild(li);
    }
    root.appendChild(ul);
  });
}
