# HTTP请求工具使用说明

## 概述

这是一个完整的HTTP请求工具包，包含请求封装、拦截器、Token管理、自动刷新等功能。

## 主要功能

### 1. HTTP客户端 (HttpClient)
- 单例模式，全局统一管理
- 支持GET、POST、PUT、DELETE请求
- 自动添加认证Token
- 请求超时配置
- 网络连接检查

### 2. 拦截器
- **认证拦截器**: 自动添加Token，处理401错误
- **日志拦截器**: 记录请求和响应日志
- **错误拦截器**: 统一处理网络错误

### 3. Token管理
- 自动存储和获取Token
- Token过期自动刷新
- 刷新失败自动清除Token
- 支持访问Token和刷新Token

### 4. API服务基类
- 统一的请求方法封装
- 文件上传和下载支持
- 响应数据自动解析

## 使用方法

### 1. 初始化

```dart
// 在main.dart中初始化
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppInit.init();
  runApp(const MyApp());
}
```

### 2. 基本请求

```dart
final httpClient = HttpClient();

// GET请求
final response = await httpClient.get<UserModel>(
  '/users/1',
  fromJson: (data) => UserModel.fromJson(data),
);

// POST请求
final response = await httpClient.post<LoginResponse>(
  '/auth/login',
  data: {'username': 'test', 'password': '123'},
  fromJson: (data) => LoginResponse.fromJson(data),
);
```

### 3. 使用服务类

```dart
final authService = AuthService();

// 登录
final loginResponse = await authService.login(
  username: 'test@example.com',
  password: 'password123',
);

if (loginResponse.success) {
  print('登录成功: ${loginResponse.data?.user.username}');
} else {
  print('登录失败: ${loginResponse.message}');
}
```

### 4. 文件上传

```dart
final userService = UserService();

final response = await userService.uploadAvatar(
  1,
  '/path/to/avatar.jpg',
);

if (response.success) {
  print('上传成功: ${response.data}');
}
```

## 配置说明

### HttpClientConfig
```dart
class HttpClientConfig {
  static const String baseUrl = 'https://api.synerunify.com';
  static const int connectTimeout = 30000; // 30秒
  static const int receiveTimeout = 30000; // 30秒
  static const int sendTimeout = 30000; // 30秒
}
```

### Token配置
```dart
static const String accessTokenKey = 'access_token';
static const String refreshTokenKey = 'refresh_token';
static const String tokenExpireTimeKey = 'token_expire_time';
```

## 响应格式

所有API响应都使用统一的`ApiResponse<T>`格式：

```dart
class ApiResponse<T> {
  final bool success;    // 请求是否成功
  final String message;   // 响应消息
  final T? data;         // 响应数据
  final int? code;        // 状态码
  final dynamic error;    // 错误信息
}
```

## 错误处理

工具会自动处理以下错误：
- 网络连接超时
- Token过期自动刷新
- 服务器错误响应
- 网络连接失败

## 扩展服务

要创建新的API服务，继承`ApiService`类：

```dart
class ProductService extends ApiService {
  Future<ApiResponse<List<Product>>> getProducts() async {
    return await get<List<Product>>(
      '/products',
      fromJson: (data) => (data as List)
          .map((item) => Product.fromJson(item))
          .toList(),
    );
  }
}
```

## 注意事项

1. 确保在应用启动时调用`AppInit.init()`
2. Token会自动管理，无需手动处理
3. 所有请求都会自动添加认证头
4. 网络错误会自动重试和降级处理
5. 日志会在控制台输出，生产环境可关闭
