# Running shell commands

On **Linux**, run shell commands normally.

On **Windows**, `make`, `git`, and similar Unix tools require Cygwin
bash.  Always invoke it like this using the PowerShell tool:

  & "C:/cygwin64/bin/bash.exe" -lc '<command>'

For multi-line content (e.g., commit messages), use the Write tool to
write a temp file (e.g., `msg.txt~`), then reference it in the command;
for example, `git commit -F msg.txt~`.  Do NOT try to embed newlines in
the -lc string when using PowerShell as they split the bash command.

**`/cygdrive/` Cygwin paths are intermediate only.  Never use them as a
final path or in any command — always convert to `~/...` form before
use.**

Do not assume what `~` resolves to in Cygwin.  At the start of a
session, derive the repo's Cygwin path and its path relative to `~`:

1. Convert the Windows project path from your session context to
   forward slashes (backslashes are eaten in transit through
   PowerShell).
2. Using PowerShell, run `cygpath -u '<forward-slash-project-path>'`
   via Cygwin bash to get the `/cygdrive/c/...` path.
3. Using PowerShell, run `echo ~` via Cygwin bash to get the Cygwin
   home directory.
4. Express the repo path relative to `~` and use `~/...` paths for
   all subsequent Cygwin bash commands.


# Temporary files

If you need a temporary file, put it in the top directory of the
repository ending in a `~`; e.g., `command_output~`.  Do not put
temporary files in `/tmp` .


# Git

Always run git via Cygwin bash (see above).

Do NOT manually set `user.name` or `user.email` — the config file seen
by Cygwin bash already contains the correct identity.


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
