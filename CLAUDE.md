# Running shell commands

On **Linux**, run shell commands normally.

On **Windows**, `make` and similar Unix tools require Cygwin bash.  Invoke it
like this (do NOT use `-l`, which corrupts PATH by mishandling the Git
Bash-style paths inherited from the Claude Code environment):

    "C:/cygwin64/bin/bash.exe" -c 'export PATH="/cygdrive/c/Users/Mark/Documents/machine/bin/home-PC:/cygdrive/c/Users/Mark/Documents/machine/bin/home-PC/ruby-bin:/cygdrive/c/Users/Mark/Documents/bin:/cygdrive/c/Users/Mark/Documents/bin/ruby-bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/sbin"; <command>'

# Git

Always run git via Cygwin bash (see above) and set `GIT_CONFIG_GLOBAL` so
that the user identity is picked up correctly:

    "C:/cygwin64/bin/bash.exe" -c 'export PATH="..."; export GIT_CONFIG_GLOBAL=~/machine/dotfiles/home-PC/_gitconfig; cd ~/menu_extension && git ...'

Do NOT manually set `user.name` or `user.email` — the config file already
contains the correct identity.

# Node / npm / Playwright

Node.js is installed at `C:\Program Files\nodejs\` but is not on the default
bash PATH. Always add it before running node/npm/npx commands:

    export PATH="$PATH:/c/Program Files/nodejs"

To install dependencies:

    export PATH="$PATH:/c/Program Files/nodejs" && cd "C:\Users\Mark\Documents\menu_extension" && npm install

To install Playwright browsers (one-time):

    export PATH="$PATH:/c/Program Files/nodejs" && npx playwright install chromium

To run tests:

    export PATH="$PATH:/c/Program Files/nodejs" && cd "C:\Users\Mark\Documents\menu_extension" && npx playwright test
