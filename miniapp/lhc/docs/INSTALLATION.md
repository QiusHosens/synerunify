# 安装指南

## 前置要求

### 前端依赖
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 后端依赖
- C++17 编译器 (GCC >= 7, Clang >= 5, MSVC >= 2017)
- CMake >= 3.15
- Geant4 >= 11.0
- ROOT >= 6.24
- Pythia8 >= 8.3 (可选，用于事件生成)

## 安装步骤

### 1. 安装前端依赖

```bash
cd frontend
npm install
```

### 2. 安装后端依赖

#### Ubuntu/Debian

```bash
# 安装基础工具
sudo apt-get update
sudo apt-get install build-essential cmake

# 安装Geant4
sudo apt-get install libgeant4-dev geant4-data

# 安装ROOT
# 从 https://root.cern.ch/downloading-root 下载并安装

# 安装Pythia8 (可选)
sudo apt-get install libpythia8-dev
```

#### macOS

```bash
# 使用Homebrew
brew install cmake
brew install geant4
brew install root
brew install pythia8
```

#### Windows

1. 安装Visual Studio 2019或更高版本（包含C++工具）
2. 安装CMake: https://cmake.org/download/
3. 安装Geant4: 从官网下载预编译版本或自行编译
4. 安装ROOT: 从官网下载Windows版本
5. 安装Pythia8: 从官网下载或使用vcpkg

### 3. 编译后端

```bash
cd backend
mkdir build
cd build
cmake ..
make  # Linux/macOS
# 或
cmake --build . --config Release  # Windows
```

### 4. 配置环境变量

设置Geant4和ROOT的环境变量：

```bash
# Linux/macOS - 添加到 ~/.bashrc 或 ~/.zshrc
export G4INSTALL=/path/to/geant4
export ROOTSYS=/path/to/root
export PATH=$ROOTSYS/bin:$PATH
export LD_LIBRARY_PATH=$ROOTSYS/lib:$LD_LIBRARY_PATH

# Windows - 添加到系统环境变量
set G4INSTALL=C:\path\to\geant4
set ROOTSYS=C:\path\to\root
```

## 验证安装

### 测试前端

```bash
cd frontend
npm run dev:h5
```

访问 http://localhost:10086 查看是否正常运行。

### 测试后端

```bash
cd backend/build
./lhc_simulator
```

服务器应该在端口8080上启动。

## 常见问题

### Geant4找不到

确保设置了正确的环境变量，并在CMakeLists.txt中指定Geant4路径：

```cmake
set(Geant4_DIR /path/to/geant4/lib/Geant4-11.0.0)
```

### ROOT链接错误

确保ROOT已正确安装，并且设置了ROOTSYS环境变量。

### Pythia8未找到

Pythia8是可选的。如果没有安装，项目仍可运行，但只能使用mock生成器。
