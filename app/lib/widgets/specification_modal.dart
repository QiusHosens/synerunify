import 'package:flutter/material.dart';

class SpecificationModal extends StatefulWidget {
  final Map<String, dynamic> product;
  final int selectedColorIndex;
  final int selectedSizeIndex;
  final int quantity;
  final List<String> colors;
  final List<String> sizes;
  final Function(int colorIndex, int sizeIndex, int quantity) onConfirm;

  const SpecificationModal({
    super.key,
    required this.product,
    required this.selectedColorIndex,
    required this.selectedSizeIndex,
    required this.quantity,
    required this.colors,
    required this.sizes,
    required this.onConfirm,
  });

  @override
  State<SpecificationModal> createState() => _SpecificationModalState();
}

class _SpecificationModalState extends State<SpecificationModal> {
  late int _selectedColorIndex;
  late int _selectedSizeIndex;
  late int _quantity;

  // 模拟库存数据
  final Map<String, Map<String, int>> _stockData = {
    '红色': {'S': 5, 'M': 3, 'L': 0, 'XL': 2},
    '蓝色': {'S': 0, 'M': 8, 'L': 4, 'XL': 1},
    '黑色': {'S': 2, 'M': 6, 'L': 3, 'XL': 0},
    '白色': {'S': 4, 'M': 2, 'L': 7, 'XL': 3},
  };

  @override
  void initState() {
    super.initState();
    _selectedColorIndex = widget.selectedColorIndex;
    _selectedSizeIndex = widget.selectedSizeIndex;
    _quantity = widget.quantity;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // 顶部拖拽条
          Container(
            margin: const EdgeInsets.only(top: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // 头部信息
          _buildHeader(),
          // 内容区域
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 颜色选择
                  _buildColorSelection(),
                  const SizedBox(height: 24),
                  // 尺寸选择
                  _buildSizeSelection(),
                  const SizedBox(height: 24),
                  // 数量选择
                  _buildQuantitySelection(),
                  const SizedBox(height: 24),
                  // 服务选择
                  _buildServiceSelection(),
                ],
              ),
            ),
          ),
          // 底部按钮
          _buildBottomButtons(),
        ],
      ),
    );
  }

  /// 构建头部信息
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        children: [
          // 商品图片
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Center(
              child: Icon(Icons.image, size: 40, color: Colors.grey),
            ),
          ),
          const SizedBox(width: 12),
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.product['name'] ?? '商品名称',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      '¥${widget.product['price']?.toString() ?? '0'}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '到手价',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '编号: ${widget.product['id'] ?? '000000'}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
          // 关闭按钮
          IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: const Icon(Icons.close),
          ),
        ],
      ),
    );
  }

  /// 构建颜色选择
  Widget _buildColorSelection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '颜色(${widget.colors.length})',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 2.5,
          ),
          itemCount: widget.colors.length,
          itemBuilder: (context, index) {
            final color = widget.colors[index];
            final isSelected = _selectedColorIndex == index;
            final stock = _getStockForColor(color);

            return GestureDetector(
              onTap: stock > 0
                  ? () {
                      setState(() {
                        _selectedColorIndex = index;
                        _selectedSizeIndex = 0; // 重置尺寸选择
                      });
                    }
                  : null,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: isSelected ? Colors.red : Colors.grey[300]!,
                    width: isSelected ? 2 : 1,
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Stack(
                  children: [
                    // 颜色预览
                    Container(
                      decoration: BoxDecoration(
                        color: _getColorValue(color),
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    // 内容
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            color,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: isSelected ? Colors.white : Colors.black87,
                            ),
                          ),
                          const Spacer(),
                          Text(
                            '¥${widget.product['price']?.toString() ?? '0'}',
                            style: TextStyle(
                              fontSize: 10,
                              color: isSelected
                                  ? Colors.white
                                  : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    // 无货标签
                    if (stock == 0)
                      Positioned(
                        top: 4,
                        right: 4,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 4,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[600],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            '无货',
                            style: TextStyle(fontSize: 8, color: Colors.white),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  /// 构建尺寸选择
  Widget _buildSizeSelection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              '尺码',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('查看详细尺码表')));
              },
              child: Text(
                '查看详细尺码表(完善尺码推荐更准)>',
                style: TextStyle(fontSize: 12, color: Colors.blue[600]),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: List.generate(widget.sizes.length, (index) {
            final size = widget.sizes[index];
            final isSelected = _selectedSizeIndex == index;
            final stock = _getStockForSize(size);

            return GestureDetector(
              onTap: stock > 0
                  ? () {
                      setState(() {
                        _selectedSizeIndex = index;
                      });
                    }
                  : null,
              child: Container(
                width: 60,
                height: 40,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: isSelected ? Colors.red : Colors.grey[300]!,
                    width: isSelected ? 2 : 1,
                  ),
                  borderRadius: BorderRadius.circular(8),
                  color: stock == 0 ? Colors.grey[100] : null,
                ),
                child: Stack(
                  children: [
                    Center(
                      child: Text(
                        size,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: stock == 0 ? Colors.grey[400] : Colors.black87,
                        ),
                      ),
                    ),
                    if (stock == 0)
                      Positioned(
                        top: 2,
                        right: 2,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 2,
                            vertical: 1,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[600],
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: const Text(
                            '无货',
                            style: TextStyle(fontSize: 8, color: Colors.white),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  /// 构建数量选择
  Widget _buildQuantitySelection() {
    final maxStock = _getMaxStock();
    final isOutOfStock = maxStock == 0;

    return Row(
      children: [
        const Text(
          '数量',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const Spacer(),
        if (isOutOfStock)
          Text('仅剩0件', style: TextStyle(fontSize: 12, color: Colors.red[600]))
        else
          Text(
            '仅剩${maxStock}件',
            style: TextStyle(fontSize: 12, color: Colors.orange[600]),
          ),
        const SizedBox(width: 16),
        Row(
          children: [
            IconButton(
              onPressed: _quantity > 1
                  ? () {
                      setState(() {
                        _quantity--;
                      });
                    }
                  : null,
              icon: Icon(
                Icons.remove_circle_outline,
                color: _quantity > 1 ? Colors.blue : Colors.grey[400],
              ),
            ),
            Container(
              width: 50,
              alignment: Alignment.center,
              child: Text(
                _quantity.toString(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            IconButton(
              onPressed: _quantity < maxStock
                  ? () {
                      setState(() {
                        _quantity++;
                      });
                    }
                  : null,
              icon: Icon(
                Icons.add_circle_outline,
                color: _quantity < maxStock ? Colors.blue : Colors.grey[400],
              ),
            ),
          ],
        ),
      ],
    );
  }

  /// 构建服务选择
  Widget _buildServiceSelection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text(
              '优选服务',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('查看全部服务')));
              },
              child: Text(
                '查看全部6项 >',
                style: TextStyle(fontSize: 12, color: Colors.blue[600]),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildServiceChip('免费取送', Icons.local_shipping, Colors.green),
            _buildServiceChip('安全游玩', Icons.security, Colors.blue),
          ],
        ),
      ],
    );
  }

  /// 构建服务标签
  Widget _buildServiceChip(String text, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            text,
            style: TextStyle(
              fontSize: 12,
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建底部按钮
  Widget _buildBottomButtons() {
    final maxStock = _getMaxStock();
    final isOutOfStock = maxStock == 0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        children: [
          // 客服按钮
          Container(
            width: 60,
            height: 50,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.chat, size: 20),
                Text('客服', style: TextStyle(fontSize: 12)),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // 确定按钮
          Expanded(
            child: ElevatedButton(
              onPressed: isOutOfStock
                  ? null
                  : () {
                      widget.onConfirm(
                        _selectedColorIndex,
                        _selectedSizeIndex,
                        _quantity,
                      );
                      Navigator.of(context).pop();
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: isOutOfStock ? Colors.grey : Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                isOutOfStock ? '暂无库存' : '确定',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 获取颜色对应的颜色值
  Color _getColorValue(String colorName) {
    switch (colorName) {
      case '红色':
        return Colors.red;
      case '蓝色':
        return Colors.blue;
      case '黑色':
        return Colors.black;
      case '白色':
        return Colors.white;
      default:
        return Colors.grey;
    }
  }

  /// 获取指定颜色的库存
  int _getStockForColor(String color) {
    final colorStock = _stockData[color];
    if (colorStock == null) return 0;

    return colorStock.values.reduce((a, b) => a + b);
  }

  /// 获取指定尺寸的库存
  int _getStockForSize(String size) {
    final selectedColor = widget.colors[_selectedColorIndex];
    final colorStock = _stockData[selectedColor];
    if (colorStock == null) return 0;

    return colorStock[size] ?? 0;
  }

  /// 获取最大库存
  int _getMaxStock() {
    final selectedColor = widget.colors[_selectedColorIndex];
    final colorStock = _stockData[selectedColor];
    if (colorStock == null) return 0;

    return colorStock.values.reduce((a, b) => a + b);
  }
}
