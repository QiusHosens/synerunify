# 开发指南

## 项目结构

```
.
├── frontend/              # Taro前端项目
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 可复用组件
│   │   ├── services/     # API服务
│   │   ├── utils/        # 工具函数
│   │   └── types/        # TypeScript类型定义
│   └── config/           # Taro配置
│
├── backend/               # C++后端项目
│   ├── src/              # 源代码
│   │   ├── generator/    # 事件生成器
│   │   ├── simulation/   # Geant4模拟
│   │   ├── analysis/     # Athena分析
│   │   ├── api/          # HTTP API
│   │   └── utils/        # 工具类
│   ├── include/          # 头文件
│   └── CMakeLists.txt    # CMake配置
│
└── docs/                  # 文档
```

## 开发流程

### 前端开发

1. **启动开发服务器**
   ```bash
   cd frontend
   npm run dev:h5        # Web端
   npm run dev:weapp     # 微信小程序
   ```

2. **添加新页面**
   - 在 `frontend/src/pages/` 创建新目录
   - 添加 `index.tsx` 和 `index.scss`
   - 在 `app.config.ts` 中注册页面

3. **添加API服务**
   - 在 `frontend/src/services/` 创建服务文件
   - 使用 `Taro.request` 调用后端API

### 后端开发

1. **编译项目**
   ```bash
   cd backend/build
   cmake ..
   make
   ```

2. **添加新模块**
   - 在 `backend/include/` 添加头文件
   - 在 `backend/src/` 添加实现文件
   - 在 `CMakeLists.txt` 中添加源文件

3. **添加API端点**
   - 在 `backend/src/api/routes.cpp` 添加路由处理
   - 实现对应的处理函数

## 代码规范

### C++代码规范
- 使用C++17标准
- 遵循Google C++ Style Guide
- 使用命名空间 `lhc`
- 类名使用PascalCase
- 函数和变量使用camelCase

### TypeScript代码规范
- 使用TypeScript严格模式
- 遵循ESLint规则
- 组件使用PascalCase
- 函数和变量使用camelCase

## 测试

### 前端测试
```bash
cd frontend
npm test
```

### 后端测试
```bash
cd backend/build
ctest
```

## 调试

### 前端调试
- Web端：使用Chrome DevTools
- 微信小程序：使用微信开发者工具

### 后端调试
- 使用GDB (Linux/macOS) 或 Visual Studio Debugger (Windows)
- 查看日志输出

## 部署

### 前端部署

#### Web端
```bash
cd frontend
npm run build:h5
# 部署 dist/ 目录到Web服务器
```

#### 微信小程序
```bash
cd frontend
npm run build:weapp
# 使用微信开发者工具上传代码
```

### 后端部署
```bash
cd backend/build
make install
# 或
cmake --install . --prefix /usr/local
```

## 性能优化

### 前端优化
- 使用代码分割
- 图片懒加载
- 减少不必要的重渲染

### 后端优化
- 使用多线程处理事件
- 优化Geant4参数
- 使用ROOT进行数据压缩
