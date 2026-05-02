@echo off
cd /d "%~dp0"
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"
(echo {"MENU_PAGE_URL": "file:///%DIR%menu_extension_menu_page.html"})> local-config.json
echo Setup complete.
echo MENU_PAGE_URL = file:///%DIR%menu_extension_menu_page.html
