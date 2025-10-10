import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:synerunify/pages/auth/login.dart';
import 'package:synerunify/utils/auth_manager.dart';
import '../../services/auth_service.dart';

class Settings extends StatefulWidget {
  const Settings({super.key});

  @override
  State<Settings> createState() => _SettingsState();
}

class _SettingsState extends State<Settings> {
  bool _elderlyMode = false;
  String _currentStore = '中和锦汇天府店';

  final AuthManager _authManager = AuthManager();
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  /// 加载设置
  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _elderlyMode = prefs.getBool('elderly_mode') ?? false;
      _currentStore = prefs.getString('current_store') ?? '中和锦汇天府店';
    });
  }

  /// 保存设置
  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('elderly_mode', _elderlyMode);
    await prefs.setString('current_store', _currentStore);
  }

  /// 切换长辈模式
  void _toggleElderlyMode(bool value) {
    setState(() {
      _elderlyMode = value;
    });
    _saveSettings();
  }

  /// 清除缓存
  Future<void> _clearCache() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('清除缓存'),
        content: const Text('确定要清除所有缓存数据吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('缓存已清除')));
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  /// 退出登录
  Future<void> _logout() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('退出登录'),
        content: const Text('确定要退出当前账号吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              // try {
              //   // await AuthService().logout();
              //   if (mounted) {
              //     Navigator.of(context).pushNamedAndRemoveUntil(
              //       '/login',
              //       (route) => false,
              //     );
              //   }
              // } catch (e) {
              //   if (mounted) {
              //     ScaffoldMessenger.of(context).showSnackBar(
              //       SnackBar(content: Text('退出失败: $e')),
              //     );
              //   }
              // }
              try {
                // 调用登出API
                // await _authService.logout();

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
                // await _authService.logout();

                if (context.mounted) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const Login()),
                    (route) => false,
                  );
                }
              }
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          '设置',
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 顶部状态栏和店铺信息
            _buildTopBar(),
            // 设置选项列表
            _buildSettingsList(),
            // 退出登录按钮
            _buildLogoutButton(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  /// 构建顶部状态栏和店铺信息
  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          // 时间显示
          const Text(
            '09:42',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const Spacer(),
          // 店铺位置
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              _currentStore,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black,
              ),
            ),
          ),
          const Spacer(),
          // 状态栏图标
          Row(
            children: [
              const Icon(
                Icons.signal_cellular_4_bar,
                size: 16,
                color: Colors.black,
              ),
              const SizedBox(width: 4),
              const Icon(Icons.wifi, size: 16, color: Colors.black),
              const SizedBox(width: 4),
              const Icon(Icons.battery_full, size: 16, color: Colors.black),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建设置选项列表
  Widget _buildSettingsList() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildSettingItem(
            icon: Icons.payment,
            title: '支付设置',
            onTap: () => _showSnackBar('支付设置'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.location_on,
            title: '收货地址',
            onTap: () => _showSnackBar('收货地址'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.elderly,
            title: '长辈模式',
            trailing: Switch(
              value: _elderlyMode,
              onChanged: _toggleElderlyMode,
              activeColor: Colors.orange,
            ),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.star_rate,
            title: '评价盒马',
            onTap: () => _showSnackBar('评价盒马'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.notifications,
            title: '消息设置',
            onTap: () => _showSnackBar('消息设置'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.delete_sweep,
            title: '清除缓存',
            onTap: _clearCache,
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.info,
            title: '关于我们',
            onTap: () => _showSnackBar('关于我们'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.business,
            title: '企业采购',
            onTap: () => _showSnackBar('企业采购'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.privacy_tip,
            title: '隐私设置',
            onTap: () => _showSnackBar('隐私设置'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.settings,
            title: '其他设置',
            onTap: () => _showSnackBar('其他设置'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.share,
            title: '个人信息共享清单',
            onTap: () => _showSnackBar('个人信息共享清单'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.collections_bookmark,
            title: '个人信息收集清单',
            onTap: () => _showSnackBar('个人信息收集清单'),
          ),
          _buildDivider(),
          _buildSettingItem(
            icon: Icons.card_membership,
            title: '兑换盒马X会员',
            onTap: () => _showSnackBar('兑换盒马X会员'),
          ),
        ],
      ),
    );
  }

  /// 构建设置项
  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.orange, size: 24),
      title: Text(
        title,
        style: const TextStyle(fontSize: 16, color: Colors.black87),
      ),
      trailing:
          trailing ??
          const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
      onTap: onTap,
    );
  }

  /// 构建分割线
  Widget _buildDivider() {
    return const Divider(height: 1, color: Colors.grey);
  }

  /// 构建退出登录按钮
  Widget _buildLogoutButton() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _logout,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: Colors.grey[600],
          elevation: 0,
          side: BorderSide(color: Colors.grey[300]!),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        child: const Text(
          '退出当前账号',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }

  /// 显示提示信息
  void _showSnackBar(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('点击了$message')));
  }
}
