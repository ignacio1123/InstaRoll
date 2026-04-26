@echo off
REM Script para abrir la app InstaRoll en Windows
cd /d %~dp0\..\dist-electron\win-unpacked
start InstaRoll.exe
