@echo off
title PUBG Overlay - Build
color 0A
echo.
echo  ========================================
echo   PUBG Overlay - Windows Build
echo  ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [FEHLER] Node.js nicht gefunden!
    echo  Bitte installieren: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODEVER=%%i
echo  Node.js gefunden: %NODEVER%
echo.

echo  [1/3] Loesche alten node_modules Cache...
if exist node_modules rmdir /s /q node_modules

echo  [2/3] Installiere Abhaengigkeiten...
echo.
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [FEHLER] npm install fehlgeschlagen!
    echo.
    pause
    exit /b 1
)

echo.
echo  [3/3] Baue EXE mit electron-packager...
echo        (kein Code-Signing, kein winCodeSign noetig)
echo.
call npx electron-packager . pubg-overlay --platform=win32 --arch=x64 --out=dist --overwrite --no-prune --ignore=dist --ignore=".bat$"
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [FEHLER] Build fehlgeschlagen!
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo  ========================================
echo   BUILD ERFOLGREICH!
echo  ========================================
echo.
echo  Ordner: dist\pubg-overlay-win32-x64\
echo  EXE:    dist\pubg-overlay-win32-x64\pubg-overlay.exe
echo.
echo  Einfach pubg-overlay.exe doppelklicken!
echo.
pause
