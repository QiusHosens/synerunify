import 'package:flutter/material.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> {
  // 模拟购物车数据
  final List<Map<String, dynamic>> _cartItems = [
    {
      'id': 1,
      'name': 'iPhone 15 Pro',
      'price': 7999.0,
      'quantity': 1,
      'image': 'https://via.placeholder.com/100',
      'selected': true,
    },
    {
      'id': 2,
      'name': 'MacBook Pro 14寸',
      'price': 14999.0,
      'quantity': 1,
      'image': 'https://via.placeholder.com/100',
      'selected': true,
    },
    {
      'id': 3,
      'name': 'AirPods Pro',
      'price': 1999.0,
      'quantity': 2,
      'image': 'https://via.placeholder.com/100',
      'selected': false,
    },
  ];

  bool _selectAll = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('购物车'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () {
              // 清空购物车
              _showClearCartDialog();
            },
            child: const Text(
              '清空',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: _cartItems.isEmpty ? _buildEmptyCart() : _buildCartContent(),
      bottomNavigationBar: _cartItems.isEmpty ? null : _buildBottomBar(),
    );
  }

  /// 构建空购物车
  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.shopping_cart_outlined,
            size: 100,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 20),
          Text(
            '购物车是空的',
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
              // 跳转到首页
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
            ),
            child: const Text('去逛逛'),
          ),
        ],
      ),
    );
  }

  /// 构建购物车内容
  Widget _buildCartContent() {
    return Column(
      children: [
        // 全选栏
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(
              bottom: BorderSide(color: Colors.grey[200]!),
            ),
          ),
          child: Row(
            children: [
              Checkbox(
                value: _selectAll,
                onChanged: (value) {
                  setState(() {
                    _selectAll = value ?? false;
                    for (var item in _cartItems) {
                      item['selected'] = _selectAll;
                    }
                  });
                },
              ),
              const Text('全选'),
              const Spacer(),
              Text(
                '共${_cartItems.length}件商品',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        
        // 商品列表
        Expanded(
          child: ListView.builder(
            itemCount: _cartItems.length,
            itemBuilder: (context, index) {
              final item = _cartItems[index];
              return _buildCartItem(item, index);
            },
          ),
        ),
      ],
    );
  }

  /// 构建购物车商品项
  Widget _buildCartItem(Map<String, dynamic> item, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // 选择框
          Checkbox(
            value: item['selected'] as bool,
            onChanged: (value) {
              setState(() {
                item['selected'] = value ?? false;
                _updateSelectAll();
              });
            },
          ),
          
          // 商品图片
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.image,
              size: 40,
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
                  item['name'] as String,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  '¥${item['price'].toString()}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.red,
                  ),
                ),
              ],
            ),
          ),
          
          // 数量控制
          Column(
            children: [
              IconButton(
                onPressed: () {
                  setState(() {
                    if (item['quantity'] > 1) {
                      item['quantity']--;
                    }
                  });
                },
                icon: const Icon(Icons.remove_circle_outline),
              ),
              Text(
                item['quantity'].toString(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              IconButton(
                onPressed: () {
                  setState(() {
                    item['quantity']++;
                  });
                },
                icon: const Icon(Icons.add_circle_outline),
              ),
            ],
          ),
          
          // 删除按钮
          IconButton(
            onPressed: () {
              _removeItem(index);
            },
            icon: const Icon(Icons.delete_outline, color: Colors.red),
          ),
        ],
      ),
    );
  }

  /// 构建底部操作栏
  Widget _buildBottomBar() {
    final selectedItems = _cartItems.where((item) => item['selected'] == true).toList();
    final totalPrice = selectedItems.fold<double>(
      0,
      (sum, item) => sum + (item['price'] as double) * (item['quantity'] as int),
    );

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Colors.grey[200]!),
        ),
      ),
      child: Row(
        children: [
          Text(
            '合计: ¥${totalPrice.toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: selectedItems.isEmpty ? null : () {
              _checkout();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
            ),
            child: Text(
              '结算(${selectedItems.length})',
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  /// 更新全选状态
  void _updateSelectAll() {
    _selectAll = _cartItems.every((item) => item['selected'] == true);
  }

  /// 删除商品
  void _removeItem(int index) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认删除'),
        content: const Text('确定要删除这个商品吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _cartItems.removeAt(index);
                _updateSelectAll();
              });
              Navigator.of(context).pop();
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  /// 清空购物车对话框
  void _showClearCartDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('清空购物车'),
        content: const Text('确定要清空购物车吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _cartItems.clear();
                _selectAll = false;
              });
              Navigator.of(context).pop();
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  /// 结算
  void _checkout() {
    final selectedItems = _cartItems.where((item) => item['selected'] == true).toList();
    if (selectedItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请选择要结算的商品')),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('跳转到结算页面...')),
    );
  }
}
