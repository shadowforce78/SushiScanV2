@echo off
echo ====================================
echo  Demarrage de SushiScanV2 en Dev
echo ====================================
echo.

REM Verification de l'installation de Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Verification de l'installation de Rust/Cargo
cargo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Rust/Cargo n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Rust depuis https://rustup.rs/
    pause
    exit /b 1
)

REM Verification de l'installation de Tauri CLI
cargo tauri --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installation de Tauri CLI...
    cargo install tauri-cli --version "^2.0"
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation de Tauri CLI
        pause
        exit /b 1
    )
)

echo [INFO] Verification des dependances frontend...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [INFO] Installation des dependances npm...
    npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation des dependances npm
        pause
        exit /b 1
    )
)

echo [INFO] Retour au repertoire racine...
cd /d "%~dp0"

echo [INFO] Demarrage de l'application en mode developpement...
echo.
echo *** L'application va se lancer dans quelques instants ***
echo *** Fermez cette fenetre pour arreter l'application ***
echo.

REM Demarage de Tauri en mode dev
cargo tauri dev

echo.
echo L'application s'est arretee.
pause
