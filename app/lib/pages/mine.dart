import 'package:flutter/material.dart';
import '../utils/auth_manager.dart';
import '../services/auth_service.dart';
import 'login.dart';

class Mine extends StatelessWidget {
  Mine({super.key});

  final AuthManager _authManager = AuthManager();
  final AuthService _authService = AuthService();

  /// 处理登出
  Future<void> _handleLogout(BuildContext context) async {
    // 显示确认对话框
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认登出'),
        content: const Text('您确定要登出吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('确认'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        // 调用登出API
        await _authService.logout();
        
        // 清除本地认证状态
        await _authManager.logout();
        
        // 跳转到登录页面
        if (context.mounted) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const Login()),
            (route) => false,
          );
        }
      } catch (e) {
        // 即使API调用失败，也要清除本地状态
        await _authManager.logout();
        
        if (context.mounted) {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => const Login()),
            (route) => false,
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('我的'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 用户信息卡片
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 30,
                      backgroundColor: Colors.purple,
                      child: Icon(
                        Icons.person,
                        size: 40,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '用户名',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'user@example.com',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        // 编辑个人信息
                      },
                      icon: const Icon(Icons.edit),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            // 功能列表
            _buildMenuItem(
              icon: Icons.person_outline,
              title: '个人信息',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('个人信息功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.shopping_bag_outlined,
              title: '我的订单',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('我的订单功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.favorite_outline,
              title: '我的收藏',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('我的收藏功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.location_on_outlined,
              title: '收货地址',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('收货地址功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.local_offer_outlined,
              title: '优惠券',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('优惠券功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.settings,
              title: '设置',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('设置功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.help_outline,
              title: '帮助与反馈',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('帮助与反馈功能开发中...')),
                );
              },
            ),
            _buildMenuItem(
              icon: Icons.info_outline,
              title: '关于我们',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('关于我们功能开发中...')),
                );
              },
            ),
            const SizedBox(height: 20),
            // 退出登录按钮
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _handleLogout(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('退出登录'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
