@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0outputs\flight-journal\start.ps1"
if errorlevel 1 pause
