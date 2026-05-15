@echo off
cd /d "%~dp0"
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"
set "URL=file:///%DIR%src/menu_extension_menu_page.html"
(echo {"MENU_PAGE_URL": "%URL%"})> local-config.json
echo Setup complete.
type local-config.json
