import 'package:flutter/material.dart';
import 'pages/main_navigation.dart';
import 'utils/app_init.dart';
import 'utils/auth_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 初始化应用
  await AppInit.init();
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SynerUnify',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const AuthWrapper(),
    );
  }
}

/// 认证包装器，根据登录状态显示不同页面
class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final authManager = AuthManager();
    
    // 如果未初始化，显示加载页面
    if (!authManager.isInitialized) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return const MainNavigation();
    
    // 根据登录状态显示不同页面
    // return authManager.isLoggedIn 
    //     ? const MainNavigation() 
    //     : const Login();
  }
}