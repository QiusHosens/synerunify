@echo off
REM Windows清理和重新安装脚本

echo 清理node_modules和package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo 清理npm缓存...
call npm cache clean --force

echo 重新安装依赖...
call npm install --legacy-peer-deps

echo 安装完成！
pause
