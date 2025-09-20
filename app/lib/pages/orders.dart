import 'package:flutter/material.dart';
import '../models/order_model.dart';
import 'order_detail.dart';

class Orders extends StatefulWidget {
  const Orders({super.key});

  @override
  State<Orders> createState() => _OrdersState();
}

class _OrdersState extends State<Orders> with TickerProviderStateMixin {
  late TabController _tabController;
  int _selectedTabIndex = 0;

  // 模拟订单数据
  final List<OrderModel> _allOrders = [
    OrderModel(
      id: '1',
      orderNumber: 'ORD202401150001',
      status: 'pending',
      totalAmount: 7999.0,
      createTime: DateTime.now().subtract(const Duration(days: 1)),
      items: [
        OrderItemModel(
          id: '1',
          productId: '1',
          productName: 'iPhone 15 Pro',
          productImage: 'https://via.placeholder.com/100',
          price: 7999.0,
          quantity: 1,
          specification: '深空黑色 256GB',
        ),
      ],
      shippingAddress: ShippingAddressModel(
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '三里屯街道工体北路8号',
      ),
    ),
    OrderModel(
      id: '2',
      orderNumber: 'ORD202401150002',
      status: 'shipped',
      totalAmount: 14999.0,
      createTime: DateTime.now().subtract(const Duration(days: 3)),
      payTime: DateTime.now().subtract(const Duration(days: 3)),
      deliveryTime: DateTime.now().subtract(const Duration(days: 1)),
      items: [
        OrderItemModel(
          id: '2',
          productId: '2',
          productName: 'MacBook Pro 14寸',
          productImage: 'https://via.placeholder.com/100',
          price: 14999.0,
          quantity: 1,
          specification: '深空灰色 512GB',
        ),
      ],
      shippingAddress: ShippingAddressModel(
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '三里屯街道工体北路8号',
      ),
    ),
    OrderModel(
      id: '3',
      orderNumber: 'ORD202401150003',
      status: 'completed',
      totalAmount: 1999.0,
      createTime: DateTime.now().subtract(const Duration(days: 7)),
      payTime: DateTime.now().subtract(const Duration(days: 7)),
      deliveryTime: DateTime.now().subtract(const Duration(days: 5)),
      receiveTime: DateTime.now().subtract(const Duration(days: 3)),
      items: [
        OrderItemModel(
          id: '3',
          productId: '3',
          productName: 'AirPods Pro',
          productImage: 'https://via.placeholder.com/100',
          price: 1999.0,
          quantity: 1,
          specification: '白色',
        ),
      ],
      shippingAddress: ShippingAddressModel(
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '三里屯街道工体北路8号',
      ),
    ),
    OrderModel(
      id: '4',
      orderNumber: 'ORD202401150004',
      status: 'cancelled',
      totalAmount: 2999.0,
      createTime: DateTime.now().subtract(const Duration(days: 10)),
      items: [
        OrderItemModel(
          id: '4',
          productId: '4',
          productName: 'iPad Air',
          productImage: 'https://via.placeholder.com/100',
          price: 2999.0,
          quantity: 1,
          specification: '深空灰色 64GB',
        ),
      ],
      shippingAddress: ShippingAddressModel(
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '三里屯街道工体北路8号',
      ),
    ),
  ];

  final List<String> _tabTitles = ['全部', '待付款', '待发货', '待收货', '已完成'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabTitles.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<OrderModel> get _filteredOrders {
    switch (_selectedTabIndex) {
      case 0:
        return _allOrders;
      case 1:
        return _allOrders.where((order) => order.status == 'pending').toList();
      case 2:
        return _allOrders.where((order) => order.status == 'paid').toList();
      case 3:
        return _allOrders.where((order) => order.status == 'shipped').toList();
      case 4:
        return _allOrders.where((order) => order.status == 'completed').toList();
      default:
        return _allOrders;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('我的订单'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          isScrollable: true,
          tabs: _tabTitles.map((title) => Tab(text: title)).toList(),
          onTap: (index) {
            setState(() {
              _selectedTabIndex = index;
            });
          },
        ),
      ),
      body: _filteredOrders.isEmpty ? _buildEmptyState() : _buildOrdersList(),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.shopping_bag_outlined,
            size: 100,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 20),
          Text(
            '暂无订单',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '快去挑选心仪的商品吧',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purple,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
            ),
            child: const Text('去逛逛'),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _filteredOrders.length,
      itemBuilder: (context, index) {
        final order = _filteredOrders[index];
        return _buildOrderCard(order);
      },
    );
  }

  Widget _buildOrderCard(OrderModel order) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => OrderDetail(order: order),
            ),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 订单头部信息
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '订单号: ${order.orderNumber}',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Color(order.statusColor).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      order.statusText,
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(order.statusColor),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              
              // 商品列表
              ...order.items.map((item) => _buildOrderItem(item)),
              
              const SizedBox(height: 12),
              
              // 订单底部信息
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '共${order.items.length}件商品',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    '¥${order.totalAmount.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // 操作按钮
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: _buildActionButtons(order),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrderItem(OrderItemModel item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          // 商品图片
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Icon(
              Icons.image,
              size: 30,
              color: Colors.grey,
            ),
          ),
          const SizedBox(width: 12),
          
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (item.specification != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    item.specification!,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '¥${item.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    Text(
                      'x${item.quantity}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildActionButtons(OrderModel order) {
    List<Widget> buttons = [];
    
    switch (order.status) {
      case 'pending':
        buttons.addAll([
          _buildActionButton('取消订单', Colors.grey, () => _cancelOrder(order)),
          const SizedBox(width: 8),
          _buildActionButton('立即付款', Colors.red, () => _payOrder(order)),
        ]);
        break;
      case 'paid':
        buttons.add(_buildActionButton('申请退款', Colors.grey, () => _refundOrder(order)));
        break;
      case 'shipped':
        buttons.addAll([
          _buildActionButton('查看物流', Colors.blue, () => _viewLogistics(order)),
          const SizedBox(width: 8),
          _buildActionButton('确认收货', Colors.green, () => _confirmReceive(order)),
        ]);
        break;
      case 'delivered':
        buttons.addAll([
          _buildActionButton('申请退款', Colors.grey, () => _refundOrder(order)),
          const SizedBox(width: 8),
          _buildActionButton('评价', Colors.orange, () => _rateOrder(order)),
        ]);
        break;
      case 'completed':
        buttons.addAll([
          _buildActionButton('再次购买', Colors.purple, () => _buyAgain(order)),
          const SizedBox(width: 8),
          _buildActionButton('评价', Colors.orange, () => _rateOrder(order)),
        ]);
        break;
      case 'cancelled':
        buttons.add(_buildActionButton('再次购买', Colors.purple, () => _buyAgain(order)));
        break;
    }
    
    return buttons;
  }

  Widget _buildActionButton(String text, Color color, VoidCallback onPressed) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: color,
        side: BorderSide(color: color),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      child: Text(
        text,
        style: const TextStyle(fontSize: 12),
      ),
    );
  }

  // 订单操作方法
  void _cancelOrder(OrderModel order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('取消订单'),
        content: const Text('确定要取消这个订单吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                order.status = 'cancelled';
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('订单已取消')),
              );
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _payOrder(OrderModel order) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('跳转到支付页面...')),
    );
  }

  void _refundOrder(OrderModel order) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('申请退款功能开发中...')),
    );
  }

  void _viewLogistics(OrderModel order) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('查看物流功能开发中...')),
    );
  }

  void _confirmReceive(OrderModel order) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认收货'),
        content: const Text('确定已收到商品吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                order.status = 'completed';
                order.receiveTime = DateTime.now();
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('确认收货成功')),
              );
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _rateOrder(OrderModel order) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('评价功能开发中...')),
    );
  }

  void _buyAgain(OrderModel order) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('再次购买功能开发中...')),
    );
  }
}
