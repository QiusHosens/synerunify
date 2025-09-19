import 'package:flutter/material.dart';

class ProductDetail extends StatefulWidget {
  final Map<String, dynamic> product;

  const ProductDetail({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetail> createState() => _ProductDetailState();
}

class _ProductDetailState extends State<ProductDetail>
    with TickerProviderStateMixin {
  late TabController _tabController;
  late PageController _imagePageController;

  int _currentImageIndex = 0;
  int _selectedColorIndex = 0;
  int _selectedSizeIndex = 0;
  int _quantity = 1;

  // 模拟商品详情数据
  final List<String> _productImages = [
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/400x400',
  ];

  final List<String> _colors = ['红色', '蓝色', '黑色', '白色'];
  final List<String> _sizes = ['S', 'M', 'L', 'XL'];

  // 模拟评价数据
  final List<Map<String, dynamic>> _reviews = [
    {
      'user': '用户001',
      'rating': 5.0,
      'content': '商品质量很好，物流很快，推荐购买！',
      'date': '2024-01-15',
      'images': ['https://via.placeholder.com/100x100'],
    },
    {
      'user': '用户002',
      'rating': 4.0,
      'content': '整体不错，就是包装有点简陋。',
      'date': '2024-01-14',
      'images': [],
    },
    {
      'user': '用户003',
      'rating': 5.0,
      'content': '非常满意，会再次购买的！',
      'date': '2024-01-13',
      'images': [
        'https://via.placeholder.com/100x100',
        'https://via.placeholder.com/100x100'
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _imagePageController = PageController();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _imagePageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Column(
        children: [
          // 自定义AppBar
          _buildCustomAppBar(),
          // 商品内容
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // 商品图片轮播
                  _buildImageCarousel(),
                  // 商品基本信息
                  _buildProductInfo(),
                  // 规格选择
                  _buildSpecificationSelection(),
                  // Tab切换内容
                  _buildTabContent(),
                ],
              ),
            ),
          ),
          // 底部操作栏
          _buildBottomBar(),
        ],
      ),
    );
  }

  /// 构建自定义AppBar
  Widget _buildCustomAppBar() {
    return Container(
      height: 100,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.blue, Colors.blueAccent],
        ),
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            const Spacer(),
            IconButton(
              icon: const Icon(Icons.share, color: Colors.white),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('分享功能开发中...')),
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.favorite_border, color: Colors.white),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('收藏功能开发中...')),
                );
              },
            ),
            IconButton(
              icon: const Icon(Icons.more_vert, color: Colors.white),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('更多功能开发中...')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 构建图片轮播
  Widget _buildImageCarousel() {
    return Container(
      height: 300,
      child: Stack(
        children: [
          PageView.builder(
            controller: _imagePageController,
            onPageChanged: (index) {
              setState(() {
                _currentImageIndex = index;
              });
            },
            itemCount: _productImages.length,
            itemBuilder: (context, index) {
              return Container(
                color: Colors.grey[200],
                child: const Center(
                  child: Icon(
                    Icons.image,
                    size: 80,
                    color: Colors.grey,
                  ),
                ),
              );
            },
          ),
          // 图片指示器
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _productImages.length,
                (index) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _currentImageIndex == index
                        ? Colors.white
                        : Colors.white.withOpacity(0.5),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建商品基本信息
  Widget _buildProductInfo() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
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
          // 商品标题
          Text(
            widget.product['name'] ?? '商品名称',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          // 价格信息
          Row(
            children: [
              Text(
                '¥${widget.product['price']?.toString() ?? '0'}',
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.red,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '¥${widget.product['originalPrice']?.toString() ?? '0'}',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[500],
                  decoration: TextDecoration.lineThrough,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // 销量和评分
          Row(
            children: [
              Icon(
                Icons.star,
                size: 16,
                color: Colors.orange[300],
              ),
              const SizedBox(width: 4),
              Text(
                '${widget.product['rating']?.toString() ?? '4.5'}',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(width: 16),
              Text(
                '已售${widget.product['sales']?.toString() ?? '100'}件',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建规格选择
  Widget _buildSpecificationSelection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
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
          // 颜色选择
          const Text(
            '颜色',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: List.generate(
              _colors.length,
              (index) => GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedColorIndex = index;
                  });
                },
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: _selectedColorIndex == index
                        ? Colors.blue
                        : Colors.grey[100],
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _selectedColorIndex == index
                          ? Colors.blue
                          : Colors.grey[300]!,
                    ),
                  ),
                  child: Text(
                    _colors[index],
                    style: TextStyle(
                      color: _selectedColorIndex == index
                          ? Colors.white
                          : Colors.black87,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // 尺寸选择
          const Text(
            '尺寸',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: List.generate(
              _sizes.length,
              (index) => GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedSizeIndex = index;
                  });
                },
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: _selectedSizeIndex == index
                        ? Colors.blue
                        : Colors.grey[100],
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _selectedSizeIndex == index
                          ? Colors.blue
                          : Colors.grey[300]!,
                    ),
                  ),
                  child: Text(
                    _sizes[index],
                    style: TextStyle(
                      color: _selectedSizeIndex == index
                          ? Colors.white
                          : Colors.black87,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // 数量选择
          Row(
            children: [
              const Text(
                '数量',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
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
                    icon: const Icon(Icons.remove_circle_outline),
                  ),
                  Text(
                    _quantity.toString(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      setState(() {
                        _quantity++;
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建Tab内容
  Widget _buildTabContent() {
    return Container(
      margin: const EdgeInsets.all(16),
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
        children: [
          TabBar(
            controller: _tabController,
            labelColor: Colors.blue,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.blue,
            tabs: const [
              Tab(text: '商品详情'),
              Tab(text: '规格参数'),
              Tab(text: '用户评价'),
            ],
          ),
          SizedBox(
            height: 400,
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildProductDescription(),
                _buildProductSpecs(),
                _buildProductReviews(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建商品描述
  Widget _buildProductDescription() {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '商品详情',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Text(
            '这是一款优质的商品，采用高品质材料制作，工艺精湛，设计时尚。'
            '商品具有以下特点：\n'
            '• 高品质材料，经久耐用\n'
            '• 时尚设计，符合现代审美\n'
            '• 工艺精湛，细节完美\n'
            '• 性价比高，值得购买',
            style: TextStyle(
              fontSize: 14,
              height: 1.6,
            ),
          ),
          SizedBox(height: 20),
          Center(
            child: Icon(
              Icons.image,
              size: 100,
              color: Colors.grey,
            ),
          ),
          SizedBox(height: 20),
          Center(
            child: Icon(
              Icons.image,
              size: 100,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  /// 构建商品规格参数
  Widget _buildProductSpecs() {
    final specs = [
      {'name': '品牌', 'value': '示例品牌'},
      {'name': '型号', 'value': 'ABC-123'},
      {'name': '材质', 'value': '优质材料'},
      {'name': '颜色', 'value': _colors[_selectedColorIndex]},
      {'name': '尺寸', 'value': _sizes[_selectedSizeIndex]},
      {'name': '重量', 'value': '500g'},
      {'name': '产地', 'value': '中国'},
      {'name': '保质期', 'value': '12个月'},
    ];

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '规格参数',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...specs
              .map((spec) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 80,
                          child: Text(
                            spec['name']!,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                        ),
                        Expanded(
                          child: Text(
                            spec['value']!,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ))
              .toList(),
        ],
      ),
    );
  }

  /// 构建用户评价
  Widget _buildProductReviews() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                '用户评价',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              Text(
                '(${_reviews.length}条)',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._reviews
              .map((review) => Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              review['user'],
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Row(
                              children: List.generate(
                                  5,
                                  (index) => Icon(
                                        Icons.star,
                                        size: 12,
                                        color: index < review['rating']
                                            ? Colors.orange[300]
                                            : Colors.grey[300],
                                      )),
                            ),
                            const Spacer(),
                            Text(
                              review['date'],
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[500],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          review['content'],
                          style: const TextStyle(
                            fontSize: 14,
                            height: 1.4,
                          ),
                        ),
                        if (review['images'].isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: (review['images'] as List)
                                .map((image) => Container(
                                      width: 60,
                                      height: 60,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: const Icon(
                                        Icons.image,
                                        size: 20,
                                        color: Colors.grey,
                                      ),
                                    ))
                                .toList(),
                          ),
                        ],
                      ],
                    ),
                  ))
              .toList(),
        ],
      ),
    );
  }

  /// 构建底部操作栏
  Widget _buildBottomBar() {
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
          // 加入购物车按钮
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                _addToCart();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                '加入购物车',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // 立即购买按钮
          Expanded(
            child: ElevatedButton(
              onPressed: () {
                _buyNow();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text(
                '立即购买',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 加入购物车
  void _addToCart() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('已加入购物车：${widget.product['name']} x$_quantity'),
        action: SnackBarAction(
          label: '查看购物车',
          onPressed: () {
            // 跳转到购物车页面
            Navigator.of(context).pop();
          },
        ),
      ),
    );
  }

  /// 立即购买
  void _buyNow() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('跳转到结算页面...')),
    );
  }
}
