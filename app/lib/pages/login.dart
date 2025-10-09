import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';
import '../utils/auth_manager.dart';
import '../utils/http_client.dart';
import 'main_navigation.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _codeController = TextEditingController();
  final _authService = AuthService();
  final _authManager = AuthManager();

  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _isAccountLogin = true; // true: 账号登录, false: 手机号登录
  bool _isCountingDown = false;
  int _countdown = 60;
  String? _errorMessage;
  bool _agreeTerms = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  /// 处理登录
  Future<void> _handleLogin() async {
    if (!_agreeTerms) {
      setState(() {
        _errorMessage = '请先同意服务协议和隐私政策';
      });
      return;
    }

    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      ApiResponse response;

      if (_isAccountLogin) {
        // 账号密码登录
        response = await _authService.login(
          username: _usernameController.text.trim(),
          password: _passwordController.text,
        );
      } else {
        // 手机号验证码登录
        response = await _authService.loginWithPhone(
          phone: _phoneController.text.trim(),
          code: _codeController.text.trim(),
        );
      }

      if (response.success && response.data != null) {
        // 设置token
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(
          HttpClientConfig.accessTokenKey,
          response.data!.accessToken,
        );
        await prefs.setString(
          HttpClientConfig.refreshTokenKey,
          response.data!.refreshToken,
        );

        // 登录成功，获取用户信息
        final userResponse = await _authService.getUserInfo();
        _authManager.loginSuccess(userResponse.data!);

        // 跳转到主页面
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const MainNavigation()),
          );
        }
      } else {
        setState(() {
          _errorMessage = response.message.isNotEmpty
              ? response.message
              : '登录失败，请检查输入信息';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = '网络错误，请检查网络连接';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  /// 获取验证码
  Future<void> _getVerificationCode() async {
    if (_phoneController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = '请输入手机号码';
      });
      return;
    }

    if (!RegExp(r'^1[3-9]\d{9}$').hasMatch(_phoneController.text.trim())) {
      setState(() {
        _errorMessage = '请输入正确的手机号码';
      });
      return;
    }

    setState(() {
      _errorMessage = null;
    });

    try {
      // TODO: 调用获取验证码API
      // await _authService.sendVerificationCode(_phoneController.text.trim());

      // 开始倒计时
      setState(() {
        _isCountingDown = true;
        _countdown = 60;
      });

      _startCountdown();

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('验证码已发送')));
    } catch (e) {
      setState(() {
        _errorMessage = '发送验证码失败，请稍后重试';
      });
    }
  }

  /// 开始倒计时
  void _startCountdown() {
    Future.delayed(const Duration(seconds: 1), () {
      if (_countdown > 0 && mounted) {
        setState(() {
          _countdown--;
        });
        _startCountdown();
      } else if (mounted) {
        setState(() {
          _isCountingDown = false;
          _countdown = 60;
        });
      }
    });
  }

  /// 处理注册
  void _handleRegister() {
    // TODO: 实现注册页面跳转
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('注册功能开发中...')));
  }

  /// 处理忘记密码
  void _handleForgotPassword() {
    // TODO: 实现忘记密码页面跳转
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('忘记密码功能开发中...')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // 顶部状态栏和店铺信息
            _buildTopBar(),
            // 主内容
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const SizedBox(height: 40),
                    // 标题
                    Text(
                      _isAccountLogin ? '账号密码登录' : '手机号登录',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 40),
                    // 登录表单
                    _buildLoginForm(),
                    const SizedBox(height: 20),
                    // 协议同意
                    _buildTermsAgreement(),
                    const SizedBox(height: 20),
                    // 底部链接
                    _buildBottomLinks(),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
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
          // 返回按钮
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () => Navigator.pop(context),
          ),
          // 店铺位置
          Expanded(
            child: Center(
              child: Text(
                '中和锦汇天府店',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[600],
                ),
              ),
            ),
          ),
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

  /// 构建登录表单
  Widget _buildLoginForm() {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // 错误信息
          if (_errorMessage != null) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
              ),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ),
          ],

          // 输入框
          if (_isAccountLogin) ...[
            _buildAccountInputFields(),
          ] else ...[
            _buildPhoneInputFields(),
          ],

          const SizedBox(height: 20),

          // 登录按钮
          _buildLoginButton(),
        ],
      ),
    );
  }

  /// 构建账号登录输入框
  Widget _buildAccountInputFields() {
    return Column(
      children: [
        // 账号输入框
        _buildInputField(
          controller: _usernameController,
          hintText: '请输入账号',
          keyboardType: TextInputType.text,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return '请输入账号';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),

        // 密码输入框
        _buildInputField(
          controller: _passwordController,
          hintText: '请输入密码',
          obscureText: _obscurePassword,
          suffixIcon: IconButton(
            icon: Icon(
              _obscurePassword ? Icons.visibility : Icons.visibility_off,
              color: Colors.grey[600],
            ),
            onPressed: () {
              setState(() {
                _obscurePassword = !_obscurePassword;
              });
            },
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请输入密码';
            }
            return null;
          },
        ),
        const SizedBox(height: 12),

        // 忘记密码链接
        Align(
          alignment: Alignment.centerRight,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextButton(
                onPressed: _handleForgotPassword,
                child: Text(
                  '忘记了?',
                  style: TextStyle(color: Colors.grey[600], fontSize: 14),
                ),
              ),
              Text(
                '找回密码',
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// 构建手机号登录输入框
  Widget _buildPhoneInputFields() {
    return Column(
      children: [
        // 手机号输入框
        _buildInputField(
          controller: _phoneController,
          hintText: '+86 > 请输入手机号码',
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return '请输入手机号码';
            }
            if (!RegExp(r'^1[3-9]\d{9}$').hasMatch(value.trim())) {
              return '请输入正确的手机号码';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),

        // 验证码输入框
        _buildInputField(
          controller: _codeController,
          hintText: '请输入验证码',
          keyboardType: TextInputType.number,
          suffixIcon: TextButton(
            onPressed: _isCountingDown ? null : _getVerificationCode,
            child: Text(
              _isCountingDown ? '${_countdown}s' : '获取验证码',
              style: TextStyle(
                color: _isCountingDown ? Colors.grey[400] : Colors.orange,
                fontSize: 14,
              ),
            ),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return '请输入验证码';
            }
            if (value.length != 6) {
              return '请输入6位验证码';
            }
            return null;
          },
        ),
      ],
    );
  }

  /// 构建通用输入框
  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        validator: validator,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey[500], fontSize: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
          suffixIcon: suffixIcon,
        ),
      ),
    );
  }

  /// 构建协议同意
  Widget _buildTermsAgreement() {
    return Row(
      children: [
        GestureDetector(
          onTap: () {
            setState(() {
              _agreeTerms = !_agreeTerms;
            });
          },
          child: Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: _agreeTerms ? Colors.orange : Colors.grey[400]!,
                width: 2,
              ),
              color: _agreeTerms ? Colors.orange : Colors.transparent,
            ),
            child: _agreeTerms
                ? const Icon(Icons.check, size: 14, color: Colors.white)
                : null,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
              children: [
                const TextSpan(text: '同意'),
                TextSpan(
                  text: '《盒马会员服务协议》',
                  style: const TextStyle(
                    color: Colors.orange,
                    decoration: TextDecoration.underline,
                  ),
                ),
                TextSpan(
                  text: '《盒马隐私政策》',
                  style: const TextStyle(
                    color: Colors.orange,
                    decoration: TextDecoration.underline,
                  ),
                ),
                const TextSpan(
                  text: ',并已清晰理解上述文件中免除或限制责任、诉讼管辖等粗体或下划线的条款,愿同步创建支付宝账号',
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  /// 构建底部链接
  Widget _buildBottomLinks() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        TextButton(
          onPressed: () {
            setState(() {
              _isAccountLogin = !_isAccountLogin;
              _errorMessage = null;
            });
          },
          child: Text(
            _isAccountLogin ? '手机号登录' : '账号密码登录',
            style: TextStyle(color: Colors.grey[600], fontSize: 16),
          ),
        ),
        Container(
          width: 1,
          height: 16,
          color: Colors.grey[400],
          margin: const EdgeInsets.symmetric(horizontal: 16),
        ),
        TextButton(
          onPressed: _handleRegister,
          child: Text(
            '立即注册',
            style: TextStyle(color: Colors.grey[600], fontSize: 16),
          ),
        ),
      ],
    );
  }

  /// 构建登录按钮
  Widget _buildLoginButton() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: (_isLoading || !_agreeTerms) ? null : _handleLogin,
        style: ElevatedButton.styleFrom(
          backgroundColor: _agreeTerms ? Colors.grey[300] : Colors.grey[200],
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          elevation: 0,
        ),
        child: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
                ),
              )
            : const Text(
                '登录',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
      ),
    );
  }
}
