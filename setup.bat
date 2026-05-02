@echo off
cd /d "%~dp0"
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"
(echo var MENU_PAGE_URL = 'file:///%DIR%menu.html';) > config.js
echo Setup complete.
echo MENU_PAGE_URL = file:///%DIR%menu.html
