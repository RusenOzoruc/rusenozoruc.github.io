@echo off
title RMO Website Preview
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview-windows.ps1"
if errorlevel 1 (
  echo.
  echo The preview could not start.
  pause
)
