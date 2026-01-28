# 故障排除指南

## npm安装错误

### 问题：combined-stream模块找不到

**错误信息：**
```
Error: Cannot find module 'combined-stream/lib/combined_stream'
```

**解决方案：**

1. **清理并重新安装（推荐）**

   Windows:
   ```bash
   cd frontend
   clean-install.bat
   ```

   Linux/macOS:
   ```bash
   cd frontend
   chmod +x clean-install.sh
   ./clean-install.sh
   ```

2. **手动清理**

   ```bash
   cd frontend
   # 删除node_modules和package-lock.json
   rm -rf node_modules package-lock.json
   # 清理npm缓存
   npm cache clean --force
   # 使用legacy-peer-deps重新安装
   npm install --legacy-peer-deps
   ```

3. **如果仍有问题，尝试使用yarn**

   ```bash
   cd frontend
   yarn install
   ```

### 问题：Windows文件权限错误（EBUSY/EPERM）

**错误信息：**
```
Error: EBUSY: resource busy or locked
Error: EPERM: operation not permitted
```

**解决方案：**

1. **关闭所有可能占用文件的程序**
   - 关闭VS Code/Cursor
   - 关闭微信开发者工具
   - 关闭任何文件资源管理器窗口

2. **以管理员身份运行命令提示符**

3. **使用PowerShell强制删除**
   ```powershell
   cd frontend
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install --legacy-peer-deps
   ```

### 问题：依赖版本冲突

**解决方案：**

项目已配置`.npmrc`文件使用`legacy-peer-deps=true`，这应该能解决大部分版本冲突问题。

如果仍有问题，可以尝试：

```bash
npm install --legacy-peer-deps --force
```

## Taro编译错误

### 问题：找不到模块或路径错误

**解决方案：**

1. 检查`tsconfig.json`中的路径配置
2. 确保`tsconfig-paths-webpack-plugin`已安装
3. 重启开发服务器

### 问题：微信小程序编译错误

**解决方案：**

1. 检查`project.config.json`配置
2. 确保微信开发者工具版本 >= 2.19.4
3. 清除微信开发者工具缓存

## 后端编译错误

### 问题：找不到Geant4

**解决方案：**

1. 设置环境变量：
   ```bash
   export Geant4_DIR=/path/to/geant4/lib/Geant4-11.0.0
   ```

2. 或在CMakeLists.txt中指定：
   ```cmake
   set(Geant4_DIR "/path/to/geant4/lib/Geant4-11.0.0")
   ```

### 问题：找不到ROOT

**解决方案：**

1. 设置ROOTSYS环境变量
2. 确保ROOT已正确安装并配置

## 运行时错误

### 问题：API连接失败

**解决方案：**

1. 检查后端服务是否启动
2. 检查`frontend/src/utils/config.ts`中的API地址
3. 检查CORS配置

### 问题：端口被占用

**解决方案：**

修改端口配置：
- 前端：`frontend/config/dev.ts`
- 后端：`backend/src/main.cpp`

## 其他问题

如果遇到其他问题，请：

1. 查看详细错误日志
2. 检查依赖版本是否兼容
3. 查看相关文档：
   - [Taro文档](https://taro-docs.jd.com/)
   - [Geant4文档](https://geant4.web.cern.ch/)
   - [ROOT文档](https://root.cern.ch/)
