# Running shell commands

On **Linux**, run shell commands normally.

On **Windows**, `make`, `git`, and similar Unix tools require Cygwin
bash.  Always invoke it like this using the PowerShell tool:

  & "C:/cygwin64/bin/bash.exe" -lc '<command>'

For multi-line content (e.g., commit messages), use the Write tool to
write a temp file (e.g., `msg.txt~`), then reference it in the command;
for example, `git commit -F msg.txt~`.  Do NOT try to embed newlines in
the -lc string when using PowerShell as they split the bash command.

# Git

Always run git via Cygwin bash (see above).

Do NOT manually set `user.name` or `user.email` — the config file seen
by Cygwin bash already contains the correct identity.

# Node / npm / npx / Playwright

These are run using git bash, but need the default path extended to
work:

    export PATH="$PATH:/c/Program Files/nodejs"

To install dependencies:

    export PATH="$PATH:/c/Program Files/nodejs" && cd "C:\Users\Mark\Documents\menu_extension" && npm install

To install Playwright browsers (one-time):

    export PATH="$PATH:/c/Program Files/nodejs" && npx playwright install chromium

To run tests:

    export PATH="$PATH:/c/Program Files/nodejs" && cd "C:\Users\Mark\Documents\menu_extension" && npx playwright test
