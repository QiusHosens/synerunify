import 'package:flutter/material.dart';
import '../pages/login.dart';
import '../utils/auth_manager.dart';

/// 登录功能演示
class LoginDemo extends StatefulWidget {
  const LoginDemo({super.key});

  @override
  State<LoginDemo> createState() => _LoginDemoState();
}

class _LoginDemoState extends State<LoginDemo> {
  final AuthManager _authManager = AuthManager();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('登录功能演示'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 当前登录状态
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '当前登录状态',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text('是否已登录: ${_authManager.isLoggedIn ? "是" : "否"}'),
                    Text('是否已初始化: ${_authManager.isInitialized ? "是" : "否"}'),
                    if (_authManager.currentUser != null) ...[
                      const SizedBox(height: 8),
                      Text('用户名: ${_authManager.currentUser!.username}'),
                      Text('邮箱: ${_authManager.currentUser!.email}'),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // 功能按钮
            const Text(
              '功能测试',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            
            // 跳转到登录页面
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                     MaterialPageRoute(
                       builder: (context) => const Login(),
                     ),
                  );
                },
                icon: const Icon(Icons.login),
                label: const Text('跳转到登录页面'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(height: 8),
            
            // 模拟登出
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await _authManager.logout();
                  setState(() {});
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('已登出')),
                  );
                },
                icon: const Icon(Icons.logout),
                label: const Text('模拟登出'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(height: 8),
            
            // 刷新状态
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  setState(() {});
                },
                icon: const Icon(Icons.refresh),
                label: const Text('刷新状态'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
            const SizedBox(height: 24),
            
            // 使用说明
            const Text(
              '使用说明',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('1. 点击"跳转到登录页面"测试登录功能'),
                    SizedBox(height: 4),
                    Text('2. 使用测试账号登录（需要后端API支持）'),
                    SizedBox(height: 4),
                    Text('3. 登录成功后会跳转到主页面'),
                    SizedBox(height: 4),
                    Text('4. 在"我的"页面可以测试登出功能'),
                    SizedBox(height: 4),
                    Text('5. 登出后会回到登录页面'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
