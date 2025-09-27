import '../utils/type_utils.dart';

/// 用户模型
class UserModel {
  final String nickname;
  final int status;
  final int? sex;
  final String? email;
  final String? avatar;
  final String? mobile;
  final String? remark;

  UserModel({
    required this.nickname,
    required this.status,
    this.sex,
    this.email,
    this.avatar,
    this.mobile,
    this.remark,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      nickname: json['nickname'] as String,
      status: TypeUtils.parseInt(json['status']),
      sex: TypeUtils.parseIntNullable(json['sex']),
      email: json['email'] as String?,
      avatar: json['avatar'] as String?,
      mobile: json['mobile'] as String?,
      remark: json['remark'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nickname': nickname,
      'status': status,
      'sex': sex,
      'email': email,
      'avatar': avatar,
      'mobile': mobile,
      'remark': remark,
    };
  }
}

/// 登录请求模型
class LoginRequest {
  final String username;
  final String password;

  LoginRequest({required this.username, required this.password});

  factory LoginRequest.fromJson(Map<String, dynamic> json) {
    return LoginRequest(
      username: json['username'] as String,
      password: json['password'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'username': username, 'password': password};
  }
}

/// 授权响应模型
class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int exp;
  final int iat;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.exp,
    required this.iat,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      tokenType: json['token_type'] as String,
      exp: TypeUtils.parseInt(json['exp']),
      iat: TypeUtils.parseInt(json['iat']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'token_type': tokenType,
      'exp': exp,
      'iat': iat,
    };
  }
}

/// Token刷新请求模型
class RefreshTokenRequest {
  final String refreshToken;

  RefreshTokenRequest({required this.refreshToken});

  factory RefreshTokenRequest.fromJson(Map<String, dynamic> json) {
    return RefreshTokenRequest(refreshToken: json['refresh_token'] as String);
  }

  Map<String, dynamic> toJson() {
    return {'refresh_token': refreshToken};
  }
}
