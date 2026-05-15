# Menu Extension

A browser extension for Chrome and Edge that allows opening a mouse and
keyboard navigable tab or window switcher with a single keystroke.
Importantly, the switchers are file:/// URLs so they can be used with
other extensions like Click-by-Voice.


## How to use it

Press **Ctrl+Shift+Y** to open a menu listing all tabs in the current
window or **Ctrl+Shift+X** to open a menu listing all windows belonging
to the current browser.  The tab/window you were on is highlighted.
Click on the tab/window you want to switch to or use the keyboard to
navigate and select a tab/window; on selection, the menu tab closes and
that tab/window becomes active.

In the tab menu, each item shows a tab title and URL.  In the window
menu, the window's name(*) is shown followed by the tab title and URL
of the active tab of that window before the menu was invoked.

(*) - It is not currently possible to get a window's name from a
extension so "no title" is shown for the title unless a placeholder URL
like `file:///.../echo_title.htm?title=menu` is found, in which case the
title used is the title parameter of that URL -- `menu` here --
surrounded by `[[`...`]]`.  A sample such file, `echo_title.htm`, is
provided in this repository.

### Keyboard commands

| Key | Action |
|-----|--------|
| Ctrl+Shift+Y | Open the tab menu (from any tab) |
| Ctrl+Shift+X | Open the window menu (from any tab) |
| Esc | Close the menu, return to the previous tab |
| Enter | Switch to the highlighted tab/window |
| Up / Down | Move the highlight up or down |
| Home | Highlight the first tab/window |
| End | Highlight the last tab/window |


## Installation

1. Clone or download this repository.
2. Run **`setup.bat`** once from the extension folder.  This generates
   `local-config.json` with the correct path for your machine.
3. Open the extensions page in your browser:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
4. Enable **Developer mode**.
5. Click **Load unpacked** and select the extension folder.

If you move the extension folder to a different location, run
`setup.bat` again and reload the extension.


## Development

After any update to the extension files, click the reload button on the
extensions page.

### Dependencies

[Node.js](https://nodejs.org) is required in order to run tests.
Install it via:
```
npm install
```

Run the test suite:
```
npx playwright test
```


## Authorship and licensing

This extension was vibe coded by Mark Lillibridge using Claude code CLI;
I place it in the public domain.
