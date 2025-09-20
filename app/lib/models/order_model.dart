class OrderModel {
  final String id;
  final String orderNumber;
  String status;
  final double totalAmount;
  final DateTime createTime;
  final DateTime? payTime;
  final DateTime? deliveryTime;
  DateTime? receiveTime;
  final String? remark;
  final List<OrderItemModel> items;
  final ShippingAddressModel? shippingAddress;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.totalAmount,
    required this.createTime,
    this.payTime,
    this.deliveryTime,
    this.receiveTime,
    this.remark,
    required this.items,
    this.shippingAddress,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      id: json['id'] ?? '',
      orderNumber: json['orderNumber'] ?? '',
      status: json['status'] ?? '',
      totalAmount: (json['totalAmount'] ?? 0).toDouble(),
      createTime: DateTime.parse(json['createTime'] ?? DateTime.now().toIso8601String()),
      payTime: json['payTime'] != null ? DateTime.parse(json['payTime']) : null,
      deliveryTime: json['deliveryTime'] != null ? DateTime.parse(json['deliveryTime']) : null,
      receiveTime: json['receiveTime'] != null ? DateTime.parse(json['receiveTime']) : null,
      remark: json['remark'],
      items: (json['items'] as List<dynamic>?)
          ?.map((item) => OrderItemModel.fromJson(item))
          .toList() ?? [],
      shippingAddress: json['shippingAddress'] != null 
          ? ShippingAddressModel.fromJson(json['shippingAddress']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'orderNumber': orderNumber,
      'status': status,
      'totalAmount': totalAmount,
      'createTime': createTime.toIso8601String(),
      'payTime': payTime?.toIso8601String(),
      'deliveryTime': deliveryTime?.toIso8601String(),
      'receiveTime': receiveTime?.toIso8601String(),
      'remark': remark,
      'items': items.map((item) => item.toJson()).toList(),
      'shippingAddress': shippingAddress?.toJson(),
    };
  }

  // 订单状态显示文本
  String get statusText {
    switch (status) {
      case 'pending':
        return '待付款';
      case 'paid':
        return '已付款';
      case 'shipped':
        return '已发货';
      case 'delivered':
        return '已送达';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'refunded':
        return '已退款';
      default:
        return '未知状态';
    }
  }

  // 订单状态颜色
  int get statusColor {
    switch (status) {
      case 'pending':
        return 0xFFFF9800; // 橙色
      case 'paid':
        return 0xFF2196F3; // 蓝色
      case 'shipped':
        return 0xFF9C27B0; // 紫色
      case 'delivered':
        return 0xFF4CAF50; // 绿色
      case 'completed':
        return 0xFF4CAF50; // 绿色
      case 'cancelled':
        return 0xFFF44336; // 红色
      case 'refunded':
        return 0xFF607D8B; // 蓝灰色
      default:
        return 0xFF9E9E9E; // 灰色
    }
  }
}

class OrderItemModel {
  final String id;
  final String productId;
  final String productName;
  final String productImage;
  final double price;
  final int quantity;
  final String? specification;

  OrderItemModel({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productImage,
    required this.price,
    required this.quantity,
    this.specification,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      id: json['id'] ?? '',
      productId: json['productId'] ?? '',
      productName: json['productName'] ?? '',
      productImage: json['productImage'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      specification: json['specification'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'productName': productName,
      'productImage': productImage,
      'price': price,
      'quantity': quantity,
      'specification': specification,
    };
  }

  double get subtotal => price * quantity;
}

class ShippingAddressModel {
  final String id;
  final String name;
  final String phone;
  final String province;
  final String city;
  final String district;
  final String address;
  final bool isDefault;

  ShippingAddressModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.province,
    required this.city,
    required this.district,
    required this.address,
    this.isDefault = false,
  });

  factory ShippingAddressModel.fromJson(Map<String, dynamic> json) {
    return ShippingAddressModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      province: json['province'] ?? '',
      city: json['city'] ?? '',
      district: json['district'] ?? '',
      address: json['address'] ?? '',
      isDefault: json['isDefault'] ?? false,
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
    };
  }

  String get fullAddress => '$province $city $district $address';
}
