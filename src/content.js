(function() {

const root = document.getElementById('__menu_extension_root__');
if (!root) return;

window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Extension context invalidated')) {
    e.preventDefault();
    root.textContent = 'Menu Extension was updated — please close this tab and reopen the menu.';
  }
});

const menuType = new URLSearchParams(window.location.search).get('type');

let highlightedLi = null;
let tabLis = [];
let prevTabId = null;

function setHighlight(li) {
  if (highlightedLi) highlightedLi.classList.remove('highlighted');
  highlightedLi = li;
  if (li) {
    li.classList.add('highlighted');
    li.scrollIntoView({ block: 'nearest' });
  }
}

function makeLi(tab, onSelect, label) {
  const li = document.createElement('li');

  if (label !== undefined) {
    li.classList.add('window-item');
    const labelDiv = document.createElement('div');
    labelDiv.className = 'window-label';
    labelDiv.textContent = label || 'no title';
    li.appendChild(labelDiv);
  }

  const entry = document.createElement('div');
  entry.className = 'tab-entry';

  const faviconWrapper = document.createElement('div');
  faviconWrapper.className = 'tab-favicon-wrapper';
  if (tab.favIconUrl) {
    const img = document.createElement('img');
    img.className = 'tab-favicon';
    img.src = tab.favIconUrl;
    img.onerror = () => { faviconWrapper.style.background = 'transparent'; };
    faviconWrapper.appendChild(img);
  } else {
    faviconWrapper.style.background = 'transparent';
  }
  entry.appendChild(faviconWrapper);

  const info = document.createElement('div');
  info.className = 'tab-info';

  const a = document.createElement('a');
  a.className = 'tab-title';
  a.href = '#';
  a.textContent = tab.title || '(untitled)';
  a.dataset.tabId = tab.id;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    onSelect();
  });

  const urlDiv = document.createElement('div');
  urlDiv.className = 'tab-url';
  urlDiv.textContent = tab.url;

  info.appendChild(a);
  info.appendChild(urlDiv);
  entry.appendChild(info);
  li.appendChild(entry);

  return li;
}

function showError(msg) {
  const existing = root.querySelector('.error-message');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = msg;
  const h1 = root.querySelector('h1');
  if (h1) h1.insertAdjacentElement('afterend', div);
  else root.insertBefore(div, root.firstChild);
  setTimeout(() => div.remove(), 1000);
}

function applyColumnLayout(ul, onReady) {
  if (window.innerWidth < 760) {
    onReady?.();
    return;
  }
  ul.style.columnFill = 'auto';
  ul.style.height = (window.innerHeight - 120) + 'px';
  requestAnimationFrame(() => {
    if (ul.scrollWidth > ul.clientWidth + 1) {
      ul.style.columnFill = '';
      ul.style.height = '';
      requestAnimationFrame(() => onReady?.());
    } else {
      onReady?.();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: 'dismissMenu', prevTabId });
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    highlightedLi?.querySelector('a[data-tab-id]')?.click();
  }
  if (e.key === 'ArrowDown' && tabLis.length > 0) {
    e.preventDefault();
    const idx = tabLis.indexOf(highlightedLi);
    setHighlight(tabLis[(idx + 1) % tabLis.length]);
  }
  if (e.key === 'ArrowUp' && tabLis.length > 0) {
    e.preventDefault();
    const idx = tabLis.indexOf(highlightedLi);
    setHighlight(tabLis[(idx - 1 + tabLis.length) % tabLis.length]);
  }
  if (e.key === 'Home' && tabLis.length > 0) {
    e.preventDefault();
    setHighlight(tabLis[0]);
  }
  if (e.key === 'End' && tabLis.length > 0) {
    e.preventDefault();
    setHighlight(tabLis[tabLis.length - 1]);
  }
});

if (menuType === 'tabs') {
  document.title = 'Tab Menu';
  chrome.runtime.sendMessage({ action: 'getTabs' }, ({ tabs, previousTabId }) => {
    prevTabId = previousTabId;
    root.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = 'Click on the tab you want to switch to';
    root.appendChild(h1);
    const ul = document.createElement('ul');
    let initialHighlight = null;
    for (const tab of tabs) {
      const li = makeLi(tab, () => {
        chrome.runtime.sendMessage({ action: 'switchTab', tabId: tab.id }, (r) => {
          if (r?.error) showError(r.error);
        });
      });
      tabLis.push(li);
      if (tab.id === previousTabId) initialHighlight = li;
      ul.appendChild(li);
    }
    root.appendChild(ul);
    applyColumnLayout(ul, () => { if (initialHighlight) setHighlight(initialHighlight); });
  });
} else if (menuType === 'windows') {
  document.title = 'Window Menu';
  chrome.runtime.sendMessage({ action: 'getWindows' }, ({ windows, previousTabId }) => {
    prevTabId = previousTabId;
    root.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = 'Click on the window you want to switch to';
    root.appendChild(h1);
    const ul = document.createElement('ul');
    let initialHighlight = null;
    for (const win of windows) {
      const li = makeLi(
        { id: win.tabId, title: win.title, url: win.url, favIconUrl: win.favIconUrl },
        () => { chrome.runtime.sendMessage({ action: 'switchTab', tabId: win.tabId }, (r) => {
          if (r?.error) showError(r.error);
        }); },
        win.label
      );
      tabLis.push(li);
      if (win.isCurrent) initialHighlight = li;
      ul.appendChild(li);
    }
    root.appendChild(ul);
    applyColumnLayout(ul, () => { if (initialHighlight) setHighlight(initialHighlight); });
  });
}

})();
