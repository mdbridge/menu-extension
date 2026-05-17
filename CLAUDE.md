# Running shell commands

On **Linux**, run shell commands normally.

On **Windows**, `make` and similar Unix tools require Cygwin bash.
Always invoke it like this using the PowerShell tool:

  & "C:/cygwin64/bin/bash.exe" -lc '<command>'

**Avoid double quotes inside the `-lc` string.**  PowerShell 5.1 mangles
double quotes when passing arguments to native executables, so any
double quote inside the `-lc` string gets eaten before bash sees it --
the message gets truncated or lost entirely.

If any argument requires quoting (e.g., a grep pattern with spaces),
write the value to a temporary file instead.

**Never pass Windows-style paths (e.g., `C:/...` or `C:\...`) to Cygwin
bash commands.**  Convert any Windows path to `~/...` form: first run
`echo $HOME` in Cygwin bash to learn the mapping, then derive the
equivalent `~/...` path.  Run `echo $HOME` once per conversation;
never assume `~` maps to the Windows user profile directory.

**`/cygdrive/` Cygwin paths are intermediate only.  Never use them as a
final path or in any command -- always convert to `~/...` form before
use.**


# Temporary files

If you need a temporary file, put it in the top directory of the
repository ending in a `~`; e.g., `command_output~`.  Do not put
temporary files in `/tmp` .


# Git

On Windows, always run git via git bash.


# Node / npm / npx / Playwright

These are run using git bash not Cygwin bash, but need the default path
extended to work:

    export PATH="$PATH:/c/Program Files/nodejs"

To install dependencies:

    export PATH="$PATH:/c/Program Files/nodejs" && npm install

To install Playwright browsers (one-time):

    export PATH="$PATH:/c/Program Files/nodejs" && npx playwright install chromium

To run tests:

    export PATH="$PATH:/c/Program Files/nodejs" && npx playwright test


# Playwright test rules

**Actions that close the menu page** must register the close listener
before triggering the action, or the event can be missed:

    await Promise.all([
      menuPage.waitForEvent('close'),
      menuPage.locator('...').click(),   // or keyboard.down(key)
    ]);

**Key presses that close the page** must use `keyboard.down` instead of
`keyboard.press`.  `keyboard.press` sends keydown + keyup; if keydown
causes the page to close, Playwright's attempt to send keyup to the
dead page throws "Target page, context or browser has been closed".
`keyboard.down` sends only keydown, which is all the content script's
`keydown` listener needs.


# Coding conventions

Attempt to keep source code lines shorter than 100 characters.

`e.g.` and `i.e.` are always followed by commas.
