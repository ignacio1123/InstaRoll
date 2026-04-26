@echo off
REM Script para automatizar build, empaquetado y vista previa de InstaRoll

REM 1. Instalar dependencias
call npm install

REM 2. Ejecutar vista previa en desarrollo
start cmd /k "npm run dev"

REM 3. Esperar confirmación del usuario para empaquetar
pause

REM 4. Construir y empaquetar la app
call npm run build
call npm run electron:pack

REM 5. Notificar al usuario
echo Proceso completado. El instalador y el .exe están listos en la carpeta de salida.
pause
