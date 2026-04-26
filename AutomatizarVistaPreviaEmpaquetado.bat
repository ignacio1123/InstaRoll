@echo off
REM Script para vista previa, empaquetar y generar instalador de InstaRoll

REM 1. Instalar dependencias
call npm install

REM 2. Ejecutar vista previa en desarrollo
start cmd /k "npm run dev"

REM 3. Esperar confirmación del usuario para empaquetar
pause

REM 4. Construir y empaquetar la app (instalador .exe)
call npm run electron:build

REM 5. Notificar al usuario y mostrar carpeta de salida
explorer "C:\Users\aaale\Desktop\InstaRollOutput"
echo Instalador generado: InstaRoll-Setup-1.0.0.exe
pause
