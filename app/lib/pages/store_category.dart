import 'package:flutter/material.dart';
import 'product_detail.dart';

class StoreCategory extends StatefulWidget {
  final Map<String, dynamic> storeInfo;

  const StoreCategory({super.key, required this.storeInfo});

  @override
  State<StoreCategory> createState() => _StoreCategoryState();
}

class _StoreCategoryState extends State<StoreCategory> {
  int _selectedCategoryIndex = 0;
  final ScrollController _leftScrollController = ScrollController();
  final ScrollController _rightScrollController = ScrollController();

  // 模拟分类数据
  final List<Map<String, dynamic>> _categories = [
    {'id': '1', 'name': '全部', 'icon': Icons.apps, 'products': []},
    {'id': '2', 'name': '纯牛奶系列', 'icon': Icons.local_drink, 'products': []},
    {'id': '3', 'name': '低脂纯牛奶', 'icon': Icons.fitness_center, 'products': []},
    {'id': '4', 'name': '脱脂纯牛奶', 'icon': Icons.eco, 'products': []},
    {'id': '5', 'name': '有机纯牛奶', 'icon': Icons.eco, 'products': []},
    {'id': '6', 'name': '28天鲜', 'icon': Icons.schedule, 'products': []},
    {'id': '7', 'name': '特仑苏沙漠有机', 'icon': Icons.landscape, 'products': []},
    {'id': '8', 'name': '特仑苏沙金套海', 'icon': Icons.water, 'products': []},
  ];

  @override
  void initState() {
    super.initState();
    _loadCategoryProducts();
  }

  @override
  void dispose() {
    _leftScrollController.dispose();
    _rightScrollController.dispose();
    super.dispose();
  }

  /// 加载分类商品数据
  void _loadCategoryProducts() {
    for (var category in _categories) {
      category['products'] = _generateCategoryProducts(
        category['name'] as String,
      );
    }
  }

  /// 生成分类商品数据
  List<Map<String, dynamic>> _generateCategoryProducts(String categoryName) {
    final products = <Map<String, dynamic>>[];

    // 根据分类名称生成不同的商品
    switch (categoryName) {
      case '全部':
        for (int i = 0; i < 20; i++) {
          products.add(_createProduct('全部商品', i));
        }
        break;
      case '纯牛奶系列':
        for (int i = 0; i < 8; i++) {
          products.add(_createProduct('纯牛奶系列', i));
        }
        break;
      case '低脂纯牛奶':
        for (int i = 0; i < 6; i++) {
          products.add(_createProduct('低脂纯牛奶', i));
        }
        break;
      case '脱脂纯牛奶':
        for (int i = 0; i < 6; i++) {
          products.add(_createProduct('脱脂纯牛奶', i));
        }
        break;
      case '有机纯牛奶':
        for (int i = 0; i < 4; i++) {
          products.add(_createProduct('有机纯牛奶', i));
        }
        break;
      case '28天鲜':
        for (int i = 0; i < 3; i++) {
          products.add(_createProduct('28天鲜', i));
        }
        break;
      case '特仑苏沙漠有机':
        for (int i = 0; i < 2; i++) {
          products.add(_createProduct('特仑苏沙漠有机', i));
        }
        break;
      case '特仑苏沙金套海':
        for (int i = 0; i < 2; i++) {
          products.add(_createProduct('特仑苏沙金套海', i));
        }
        break;
      default:
        products.add(_createProduct(categoryName, 0));
    }

    return products;
  }

  /// 创建商品数据
  Map<String, dynamic> _createProduct(String categoryName, int index) {
    final productId = '${categoryName}_$index';
    final basePrice = 30 + (index * 5);
    final originalPrice = basePrice + 10 + (index * 2);

    return {
      'id': productId,
      'name': '$categoryName ${index + 1}',
      'price': basePrice.toDouble(),
      'originalPrice': originalPrice.toDouble(),
      'image': 'https://via.placeholder.com/200x200',
      'sales': 100 + index * 50,
      'rating': 4.0 + (index % 5) * 0.2,
      'category': categoryName,
      'tags': _getProductTags(categoryName),
      'isNew': index < 2,
      'discount': (index % 3 == 0) ? '满减' : null,
      'features': _getProductFeatures(categoryName),
    };
  }

  /// 获取商品标签
  List<String> _getProductTags(String categoryName) {
    switch (categoryName) {
      case '纯牛奶系列':
        return ['包邮', '新鲜', '营养'];
      case '低脂纯牛奶':
        return ['低脂', '健康', '包邮'];
      case '脱脂纯牛奶':
        return ['脱脂', '无脂肪', '包邮'];
      case '有机纯牛奶':
        return ['有机', '天然', '包邮'];
      case '28天鲜':
        return ['新鲜', '短保', '包邮'];
      default:
        return ['包邮', '正品'];
    }
  }

  /// 获取商品特点
  List<String> _getProductFeatures(String categoryName) {
    switch (categoryName) {
      case '纯牛奶系列':
        return ['优质蛋白质', '醇正营养', '休闲畅饮'];
      case '低脂纯牛奶':
        return ['0脂轻负担', '优质蛋白质', '休闲畅饮'];
      case '脱脂纯牛奶':
        return ['0脂肪', '优质蛋白质', '健康生活'];
      case '有机纯牛奶':
        return ['有机认证', '天然营养', '健康选择'];
      case '28天鲜':
        return ['28天新鲜', '短保质期', '新鲜直供'];
      default:
        return ['优质产品', '值得信赖'];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Row(
        children: [
          // 左侧分类导航
          _buildCategorySidebar(),
          // 右侧商品列表
          _buildProductContent(),
        ],
      ),
    );
  }

  /// 构建左侧分类导航
  Widget _buildCategorySidebar() {
    return Container(
      width: 100,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(right: BorderSide(color: Colors.grey[200]!)),
      ),
      child: ListView.builder(
        controller: _leftScrollController,
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = _selectedCategoryIndex == index;

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategoryIndex = index;
              });
            },
            child: Container(
              height: 80,
              decoration: BoxDecoration(
                color: isSelected ? Colors.blue[50] : Colors.transparent,
                border: Border(
                  left: BorderSide(
                    color: isSelected ? Colors.blue : Colors.transparent,
                    width: 3,
                  ),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    category['icon'] as IconData,
                    size: 24,
                    color: isSelected ? Colors.blue : Colors.grey[600],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category['name'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Colors.blue : Colors.grey[600],
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  /// 构建右侧商品内容
  Widget _buildProductContent() {
    final selectedCategory = _categories[_selectedCategoryIndex];
    final products = selectedCategory['products'] as List<Map<String, dynamic>>;

    return Expanded(
      child: Column(
        children: [
          // 顶部横幅（如果是特定分类）
          if (_selectedCategoryIndex > 0)
            _buildCategoryBanner(selectedCategory),
          // 商品列表
          Expanded(child: _buildProductList(products)),
        ],
      ),
    );
  }

  /// 构建分类横幅
  Widget _buildCategoryBanner(Map<String, dynamic> category) {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue[100]!, Colors.blue[50]!],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue[200]!),
      ),
      child: Row(
        children: [
          Icon(category['icon'] as IconData, size: 32, color: Colors.blue[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  category['name'] as String,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[800],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '精选${category['name']}产品，品质保证',
                  style: TextStyle(fontSize: 14, color: Colors.blue[600]),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue[600],
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              '点击购买',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建商品列表
  Widget _buildProductList(List<Map<String, dynamic>> products) {
    if (products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inventory_2_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              '暂无商品',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      controller: _rightScrollController,
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.75,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];
        return _buildProductCard(product);
      },
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ProductDetail(product: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 商品图片
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                ),
                child: Stack(
                  children: [
                    const Center(
                      child: Icon(Icons.image, size: 40, color: Colors.grey),
                    ),
                    if (product['isNew'] == true)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            '新品',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    if (product['discount'] != null)
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.orange,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            product['discount'] as String,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            // 商品信息
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 商品名称
                    Text(
                      product['name'] as String,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    // 商品特点
                    if ((product['features'] as List).isNotEmpty)
                      Text(
                        (product['features'] as List).join(' | '),
                        style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    const SizedBox(height: 4),
                    // 价格信息
                    Row(
                      children: [
                        Text(
                          '¥${product['price'].toString()}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '到手价 ¥${product['originalPrice'].toString()}',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    // 底部信息
                    Row(
                      children: [
                        Icon(Icons.star, size: 12, color: Colors.orange[300]),
                        const SizedBox(width: 2),
                        Text(
                          '${product['rating']}',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[600],
                          ),
                        ),
                        const Spacer(),
                        Text(
                          '已售${product['sales']}',
                          style: TextStyle(
                            fontSize: 10,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Icon(
                            Icons.add,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
