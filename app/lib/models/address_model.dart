class AddressModel {
  final String id;
  String name;
  String phone;
  String province;
  String city;
  String district;
  String address;
  bool isDefault;
  DateTime createTime;
  DateTime updateTime;

  AddressModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.province,
    required this.city,
    required this.district,
    required this.address,
    this.isDefault = false,
    required this.createTime,
    required this.updateTime,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      province: json['province'] ?? '',
      city: json['city'] ?? '',
      district: json['district'] ?? '',
      address: json['address'] ?? '',
      isDefault: json['isDefault'] ?? false,
      createTime: DateTime.parse(json['createTime'] ?? DateTime.now().toIso8601String()),
      updateTime: DateTime.parse(json['updateTime'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'province': province,
      'city': city,
      'district': district,
      'address': address,
      'isDefault': isDefault,
      'createTime': createTime.toIso8601String(),
      'updateTime': updateTime.toIso8601String(),
    };
  }

  // 获取完整地址
  String get fullAddress => '$province $city $district $address';

  // 获取简化的地址（不包含详细地址）
  String get shortAddress => '$province $city $district';

  // 复制地址对象
  AddressModel copyWith({
    String? id,
    String? name,
    String? phone,
    String? province,
    String? city,
    String? district,
    String? address,
    bool? isDefault,
    DateTime? createTime,
    DateTime? updateTime,
  }) {
    return AddressModel(
      id: id ?? this.id,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      province: province ?? this.province,
      city: city ?? this.city,
      district: district ?? this.district,
      address: address ?? this.address,
      isDefault: isDefault ?? this.isDefault,
      createTime: createTime ?? this.createTime,
      updateTime: updateTime ?? this.updateTime,
    );
  }

  // 验证地址信息是否完整
  bool get isValid {
    return name.isNotEmpty &&
        phone.isNotEmpty &&
        province.isNotEmpty &&
        city.isNotEmpty &&
        district.isNotEmpty &&
        address.isNotEmpty;
  }

  // 验证手机号格式
  bool get isPhoneValid {
    final phoneRegex = RegExp(r'^1[3-9]\d{9}$');
    return phoneRegex.hasMatch(phone);
  }
}

// 省市区数据模型
class RegionModel {
  final String code;
  final String name;
  final List<RegionModel> children;

  RegionModel({
    required this.code,
    required this.name,
    this.children = const [],
  });

  factory RegionModel.fromJson(Map<String, dynamic> json) {
    return RegionModel(
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      children: (json['children'] as List<dynamic>?)
          ?.map((child) => RegionModel.fromJson(child))
          .toList() ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'name': name,
      'children': children.map((child) => child.toJson()).toList(),
    };
  }
}
