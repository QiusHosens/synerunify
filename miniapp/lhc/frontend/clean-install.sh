#!/bin/bash
# Windows用户请使用 clean-install.bat

echo "清理node_modules和package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

echo "清理npm缓存..."
npm cache clean --force

echo "重新安装依赖..."
npm install --legacy-peer-deps

echo "安装完成！"
