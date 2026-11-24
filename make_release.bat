@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   ST Hero Calculator - creation de la release
echo ============================================

rem 1) Reconstruit index.html et en.html si Python est installe (sinon garde les fichiers actuels)
where python >nul 2>nul
if %errorlevel%==0 (
  echo [1/3] Reconstruction des pages avec Python...
  set PYTHONIOENCODING=utf-8
  python tools\build.py tools\src . none
  if errorlevel 1 ( echo ERREUR : la reconstruction a echoue. & pause & exit /b 1 )
) else (
  echo [1/3] Python absent : les pages actuelles sont utilisees.
)

rem 2) Verifie les fichiers de la release
for %%F in (index.html en.html ocr.js LISEZMOI.txt README.txt CHANGELOG.md CHANGELOG.en.md) do (
  if not exist "%%F" ( echo ERREUR : fichier manquant : %%F & pause & exit /b 1 )
)

rem 3) Cree le zip dans le dossier release
echo [2/3] Preparation des fichiers...
for /f %%V in ('powershell -NoProfile -Command "(Get-Content -Raw -Encoding UTF8 tools\src\changelog.json | ConvertFrom-Json).version"') do set VER=%%V
if "%VER%"=="" set VER=dev
set OUT=release\STHeroCalculator-v%VER%.zip
set TMP_DIR=release\_tmp\STHeroCalculator
if exist release\_tmp rmdir /s /q release\_tmp
mkdir "%TMP_DIR%"
copy /y index.html "%TMP_DIR%" >nul
copy /y en.html "%TMP_DIR%" >nul
copy /y ocr.js "%TMP_DIR%" >nul
copy /y LISEZMOI.txt "%TMP_DIR%" >nul
copy /y README.txt "%TMP_DIR%" >nul
copy /y CHANGELOG.md "%TMP_DIR%" >nul
copy /y CHANGELOG.en.md "%TMP_DIR%" >nul
if exist "%OUT%" del /q "%OUT%"
echo [3/3] Creation de %OUT% ...
powershell -NoProfile -Command "Compress-Archive -Path 'release\_tmp\STHeroCalculator' -DestinationPath '%OUT%' -Force"
if errorlevel 1 ( echo ERREUR : le zip n'a pas ete cree. & pause & exit /b 1 )
rmdir /s /q release\_tmp

echo.
echo Termine : %OUT%
echo Ajoutez ce fichier a une release GitHub (onglet Releases, puis "Draft a new release").
echo Tag conseille : v%VER%
pause
