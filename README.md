# Menu Extension

A browser extension for Chrome and Edge that opens a mouse and keyboard
navigable tab switcher with a single keystroke.  Importantly, the tab
switcher is an ordinary file:/// URL so it can be used with other
extensions like Click-by-Voice.


## How to use it

Press **Ctrl+Shift+Y** to open a menu listing all tabs in the current
window.  The tab you were on is highlighted.  Click on the tab you want
to switch to or use the keyboard to navigate and select a tab; on
selection, the menu tab closes and that tab becomes active.

### Keyboard commands

| Key | Action |
|-----|--------|
| Ctrl+Shift+Y | Open the menu (from any tab) |
| Esc | Close the menu, return to the previous tab |
| Enter | Switch to the highlighted tab |
| Up / Down | Move the highlight up or down |
| Home | Highlight the first tab |
| End | Highlight the last tab |


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
