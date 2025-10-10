import 'package:flutter/material.dart';

class CategoryProducts extends StatefulWidget {
  final String categoryName;
  final String categoryIcon;

  const CategoryProducts({
    super.key,
    required this.categoryName,
    required this.categoryIcon,
  });

  @override
  State<CategoryProducts> createState() => _CategoryProductsState();
}

class _CategoryProductsState extends State<CategoryProducts> {
  int _selectedCategoryIndex = 0;

  // 左侧分类列表数据
  final List<Map<String, dynamic>> _categories = [
    {'name': '水果推荐', 'tag': '爆', 'tagColor': Colors.red},
    {'name': '鲜花推荐', 'tag': '爆', 'tagColor': Colors.red},
    {'name': '水果礼盒', 'tag': '推荐', 'tagColor': Colors.orange},
    {'name': '送礼/整箱', 'icon': Icons.card_giftcard},
    {'name': '柑橘橙柚柠'},
    {'name': '石榴/桃李枣'},
    {'name': '蓝莓/葡提'},
    {'name': '西梅/奇异果'},
    {'name': '苹果梨蕉'},
    {'name': '西瓜蜜瓜'},
    {'name': '榴莲/热带'},
    {'name': '果切/冻水果'},
    {'name': '鲜花绿植'},
    {'name': '进口精选'},
  ];

  // 右侧商品数据
  final List<Map<String, dynamic>> _products = [
    {
      'name': '时令 突尼斯软籽石榴礼盒装 6个 3kg',
      'subtitle': '糖度14+|赠礼佳品',
      'sales': '自营 月4000+人已下单',
      'price': '¥69.9',
      'unit': '/盒',
      'image': 'assets/images/pomegranate.png',
      'tag': '中秋节',
      'badge': '秋日瓜果热卖榜TOP.1',
      'badgeColor': Colors.brown,
    },
    {
      'name': '时令 莱阳冰糖秋月梨礼盒 3.25kg',
      'subtitle': '新旧包装更替|送礼自用两相宜',
      'sales': '自营 月2000+人已下单',
      'price': '¥79.9',
      'unit': '/箱',
      'image': 'assets/images/pear.png',
      'tag': '中秋节',
      'badge': '精选中秋家宴食材',
      'badgeColor': Colors.blue,
    },
    {
      'name': '【鲜果切】鲜剥红柚肉 400g',
      'subtitle': '酸甜可口 | 粒粒饱满',
      'sales': '自营 月回头客2000+人',
      'price': '¥15.9',
      'unit': '/盒',
      'image': 'assets/images/pomelo.png',
    },
    {
      'name': '巨峰葡萄 500g',
      'subtitle': '早期尝鲜 | 风味浓郁',
      'sales': '自营 月回头客1万+人',
      'price': '¥11.9',
      'unit': '/盒',
      'image': 'assets/images/grape.png',
      'tag': '中秋节',
      'badge': '秋日瓜果回购榜 TOP.1',
      'badgeColor': Colors.brown,
    },
    {
      'name': '时令 即食红心猕猴桃 4粒',
      'subtitle': '300g',
      'sales': '自营 月1000+人已下单',
      'price': '¥12.9',
      'unit': '/盒',
      'image': 'assets/images/kiwi.png',
    },
    {
      'name': '新疆哈密瓜 2.5kg',
      'subtitle': '香甜多汁 | 果肉厚实',
      'sales': '自营 月5000+人已下单',
      'price': '¥29.9',
      'unit': '/个',
      'image': 'assets/images/melon.png',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // 顶部搜索栏
            _buildSearchBar(),
            // 主要内容区域
            Expanded(
              child: Row(
                children: [
                  // 左侧分类导航
                  _buildLeftSidebar(),
                  // 右侧商品列表
                  Expanded(child: _buildProductList()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建顶部搜索栏
  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFFF8C00), Color(0xFFFFD700)],
        ),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const TextField(
                decoration: InputDecoration(
                  hintText: '文旦柚',
                  hintStyle: TextStyle(color: Colors.grey),
                  prefixIcon: Icon(Icons.search, color: Colors.grey),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.shopping_cart, color: Colors.white),
          ),
        ],
      ),
    );
  }

  /// 构建左侧分类导航
  Widget _buildLeftSidebar() {
    return Container(
      width: 100,
      color: Colors.grey[50],
      child: ListView.builder(
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
              height: 60,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : Colors.transparent,
                border: isSelected
                    ? const Border(
                        left: BorderSide(color: Colors.red, width: 3),
                      )
                    : null,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (category['tag'] != null)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 4,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: category['tagColor'] ?? Colors.red,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        category['tag'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    )
                  else if (category['icon'] != null)
                    Icon(
                      category['icon'],
                      size: 16,
                      color: isSelected ? Colors.red : Colors.grey[600],
                    )
                  else
                    const SizedBox(height: 16),
                  const SizedBox(height: 4),
                  Text(
                    category['name'],
                    style: TextStyle(
                      fontSize: 12,
                      color: isSelected ? Colors.red : Colors.black87,
                      fontWeight: isSelected
                          ? FontWeight.w600
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

  /// 构建右侧商品列表
  Widget _buildProductList() {
    return Column(
      children: [
        // 顶部筛选栏
        _buildFilterBar(),
        // 商品列表
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _products.length,
            itemBuilder: (context, index) {
              final product = _products[index];
              return _buildProductCard(product);
            },
          ),
        ),
      ],
    );
  }

  /// 构建筛选栏
  Widget _buildFilterBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey[200]!, width: 1)),
      ),
      child: Row(
        children: [
          _buildFilterChip('推荐', true),
          const SizedBox(width: 12),
          _buildFilterChip('好礼', false),
          const SizedBox(width: 12),
          _buildFilterChip('果切', false),
          const SizedBox(width: 12),
          _buildFilterChip('尝秋果', false),
          const Spacer(),
          _buildSortChip('销量'),
          const SizedBox(width: 12),
          _buildSortChip('价格'),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isSelected ? Colors.blue : Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? Colors.blue : Colors.grey[300]!,
          width: 1,
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.black87,
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildSortChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[300]!, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.black87, fontSize: 12),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.keyboard_arrow_down, size: 16, color: Colors.grey),
        ],
      ),
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 商品图片
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Stack(
              children: [
                const Center(
                  child: Icon(Icons.image, size: 40, color: Colors.grey),
                ),
                if (product['tag'] != null)
                  Positioned(
                    top: 4,
                    left: 4,
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
                        product['tag'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product['name'],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    height: 1.2,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  product['subtitle'],
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(height: 4),
                Text(
                  product['sales'],
                  style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      product['price'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    Text(
                      product['unit'],
                      style: const TextStyle(fontSize: 12, color: Colors.red),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(
                        Icons.shopping_cart,
                        color: Colors.white,
                        size: 16,
                      ),
                    ),
                  ],
                ),
                if (product['badge'] != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color:
                          product['badgeColor']?.withValues(alpha: 0.1) ??
                          Colors.grey[100],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      product['badge'],
                      style: TextStyle(
                        fontSize: 10,
                        color: product['badgeColor'] ?? Colors.grey[600],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
