/// 用户模型
class UserModel {
  final int id;
  final String username;
  final String email;
  final String? avatar;
  final String? phone;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    this.avatar,
    this.phone,
    this.createdAt,
    this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      username: json['username'] as String,
      email: json['email'] as String,
      avatar: json['avatar'] as String?,
      phone: json['phone'] as String?,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : null,
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at'] as String) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'avatar': avatar,
      'phone': phone,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

/// 登录请求模型
class LoginRequest {
  final String username;
  final String password;

  LoginRequest({
    required this.username,
    required this.password,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) {
    return LoginRequest(
      username: json['username'] as String,
      password: json['password'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'password': password,
    };
  }
}

/// 登录响应模型
class LoginResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int exp;
  final int iat;
  // final UserModel user;

  LoginResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.exp,
    required this.iat,
    // required this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      tokenType: json['token_type'] as String,
      exp: json['exp'] as int,
      iat: json['iat'] as int,
      // user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
      // user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'token_type': tokenType,
      'exp': exp,
      'iat': iat,
      // 'user': user.toJson(),
    };
  }
}

/// Token刷新请求模型
class RefreshTokenRequest {
  final String refreshToken;

  RefreshTokenRequest({
    required this.refreshToken,
  });

  factory RefreshTokenRequest.fromJson(Map<String, dynamic> json) {
    return RefreshTokenRequest(
      refreshToken: json['refresh_token'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'refresh_token': refreshToken,
    };
  }
}

/// Token刷新响应模型
class RefreshTokenResponse {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;

  RefreshTokenResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
  });

  factory RefreshTokenResponse.fromJson(Map<String, dynamic> json) {
    return RefreshTokenResponse(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      expiresIn: json['expires_in'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'access_token': accessToken,
      'refresh_token': refreshToken,
      'expires_in': expiresIn,
    };
  }
}