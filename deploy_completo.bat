@echo off
cd /d "D:\Desktop\CRYD\CRYD"
set PATH=C:\Program Files\nodejs;%PATH%

REM Primero intenta hacer login
echo.
echo ==========================================
echo PASO 1: Autenticación con Firebase
echo ==========================================
call firebase login --no-localhost

echo.
echo ==========================================
echo PASO 2: Deploy a Firebase
echo ==========================================
call firebase deploy

echo.
echo ==========================================
echo Deploy completado
echo ==========================================
pause
