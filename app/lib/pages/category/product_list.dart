import 'package:flutter/material.dart';
import '../product/product_detail.dart';

class ProductListPage extends StatefulWidget {
  final String categoryName;

  const ProductListPage({super.key, required this.categoryName});

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  String _sortBy = '综合推荐';
  bool _isPriceAscending = false;
  String _selectedFilter = '推荐';
  List<Map<String, dynamic>> _filteredProducts = [];

  // 商品数据，支持不同类型的商品
  List<Map<String, dynamic>> _products = [];

  @override
  void initState() {
    super.initState();
    _loadProducts();
    _filteredProducts = List.from(_products);
  }

  /// 根据分类名称加载对应的商品数据
  void _loadProducts() {
    if (widget.categoryName == 'iPhone') {
      _products = _getIPhoneProducts();
    } else {
      _products = _getGeneralProducts();
    }
  }

  /// iPhone商品数据
  List<Map<String, dynamic>> _getIPhoneProducts() {
    return [
      {
        'id': '1',
        'name': 'Apple iPhone 16 手机 黑色 128GB',
        'price': 5999,
        'originalPrice': null,
        'sales': '已售1万+',
        'rating': '98%好评',
        'store': 'Apple授权专营店',
        'storeCustomers': '店铺回头客2万',
        'delivery': '小时送达',
        'location': '在你身边',
        'tags': ['HOT'],
        'isAd': true,
        'image': 'assets/images/iphone16_black.png',
      },
      {
        'id': '2',
        'name': 'iPhone 17 Pro 256GB 星宇橙色',
        'price': 8999,
        'originalPrice': null,
        'sales': '自营',
        'rating': '',
        'store': 'Apple产品京东自营旗舰店',
        'storeCustomers': '已关注',
        'delivery': '',
        'location': '',
        'tags': ['rt.11', '自营'],
        'specs': [
          'A19 Pro',
          'VC 均热板',
          '8倍变焦',
          'A19 Pro CPU型号',
          '4800万像素 后摄主像素',
          'FHD+ 屏幕分辨率',
        ],
        'offers': ['京补合约', '只换不修', '免费上门退换'],
        'subsidy': '补贴 300元',
        'installment': '享12期免息',
        'priceTag': '全网低价',
        'image': 'assets/images/iphone17_pro_orange.png',
      },
      {
        'id': '3',
        'name': 'iPhone 17 Pro 512GB 星宇橙色',
        'price': 10999,
        'originalPrice': null,
        'sales': '自营',
        'rating': '',
        'store': 'Apple产品京东自营旗舰店',
        'storeCustomers': '已关注',
        'delivery': '',
        'location': '',
        'tags': ['rt.11', '自营'],
        'specs': [
          'A19 Pro',
          'VC 均热板',
          '8倍变焦',
          'A19 Pro CPU型号',
          '4800万像素 后摄主像素',
          'FHD+ 屏幕分辨率',
        ],
        'offers': ['新品', '京补合约', '只换不修', '免费上门退换'],
        'subsidy': '补贴 300元',
        'installment': '享12期免息',
        'priceTag': '同款低价',
        'image': 'assets/images/iphone17_pro_orange_512.png',
      },
      {
        'id': '4',
        'name': 'iPhone 15 128GB 蓝色',
        'price': 3399,
        'originalPrice': 3899,
        'sales': '已售500万+',
        'rating': '手机销量排名第3名',
        'store': 'Apple产品京东自营旗舰店',
        'storeCustomers': '已关注',
        'delivery': '今日达',
        'location': '',
        'tags': ['rt.11', '自营'],
        'specs': ['灵动岛设计', 'A16仿生芯片', '4800万像素', 'iOS 系统', '科技风格', '蓝色系机身色系'],
        'offers': ['国家补贴', '京补合约', '只换不修'],
        'subsidy': '500元',
        'installment': '400元',
        'installment2': '12期免息',
        'priceTag': '国补到手价',
        'ranking': '热卖榜 | 蓝色系手机热卖榜第3名',
        'image': 'assets/images/iphone15_blue.png',
      },
      {
        'id': '5',
        'name': 'iPhone 16 Pro 128GB 沙漠色',
        'price': 7999,
        'originalPrice': null,
        'sales': '自营',
        'rating': '',
        'store': 'Apple产品京东自营旗舰店',
        'storeCustomers': '已关注',
        'delivery': '',
        'location': '',
        'tags': ['rt.11', '自营'],
        'specs': [
          '自适应高刷',
          'A18 Pro',
          '全新相机控制键',
          'iOS 系统',
          '1200万像素 前摄主像素',
          'USB-C 充电接口',
        ],
        'offers': [],
        'subsidy': '',
        'installment': '',
        'priceTag': '',
        'ranking': '热卖榜 | 金色系手机热卖榜第3名',
        'image': 'assets/images/iphone16_pro_desert.png',
      },
    ];
  }

  /// 通用商品数据
  List<Map<String, dynamic>> _getGeneralProducts() {
    return [
      {
        'id': '1',
        'name': '${widget.categoryName}商品 1',
        'price': 299,
        'originalPrice': 399,
        'sales': '已售1000+',
        'rating': '95%好评',
        'store': '${widget.categoryName}专营店',
        'storeCustomers': '店铺回头客500',
        'delivery': '24小时送达',
        'location': '在你身边',
        'tags': ['热销'],
        'isAd': false,
        'image': 'assets/images/product1.png',
      },
      {
        'id': '2',
        'name': '${widget.categoryName}商品 2',
        'price': 599,
        'originalPrice': null,
        'sales': '已售500+',
        'rating': '98%好评',
        'store': '${widget.categoryName}自营店',
        'storeCustomers': '已关注',
        'delivery': '当日达',
        'location': '',
        'tags': ['新品'],
        'specs': ['高品质', '耐用', '性价比高'],
        'offers': ['包邮', '7天无理由退货'],
        'subsidy': '立减50元',
        'installment': '3期免息',
        'image': 'assets/images/product2.png',
      },
    ];
  }

  /// 筛选商品
  void _filterProducts(String filter) {
    setState(() {
      _selectedFilter = filter;
      _filteredProducts = List.from(_products);

      switch (filter) {
        case '推荐':
          // 保持原有顺序
          break;
        case '好礼':
          // 筛选有礼品标签的商品
          _filteredProducts = _products
              .where((product) => product['offers']?.contains('京补合约') == true)
              .toList();
          break;
        case '果切':
          // 筛选果切相关商品（这里用iPhone 15作为示例）
          _filteredProducts = _products
              .where(
                (product) => product['name'].toString().contains('iPhone 15'),
              )
              .toList();
          break;
        case '尝秋果':
          // 筛选秋季新品（这里用iPhone 17作为示例）
          _filteredProducts = _products
              .where(
                (product) => product['name'].toString().contains('iPhone 17'),
              )
              .toList();
          break;
      }
    });
  }

  /// 排序商品
  void _sortProducts(String sortBy) {
    setState(() {
      _sortBy = sortBy;

      switch (sortBy) {
        case '综合推荐':
          _filteredProducts = List.from(_products);
          break;
        case '销量':
          _filteredProducts.sort((a, b) {
            // 按销量排序（这里用价格作为销量参考）
            return b['price'].compareTo(a['price']);
          });
          break;
        case '价格':
          _filteredProducts.sort((a, b) {
            if (_isPriceAscending) {
              return a['price'].compareTo(b['price']);
            } else {
              return b['price'].compareTo(a['price']);
            }
          });
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // 顶部状态栏
            _buildTopBar(),
            // 主要内容区域
            Expanded(
              child: Column(
                children: [
                  // 筛选栏
                  _buildFilterBar(),
                  // 商品列表
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _filteredProducts.length,
                      itemBuilder: (context, index) {
                        final product = _filteredProducts[index];
                        return _buildProductCard(product);
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建顶部状态栏
  Widget _buildTopBar() {
    return Column(
      children: [
        // 状态栏
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              // 回退按钮
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              const Spacer(),
              // 页面标题
              Text(
                widget.categoryName,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const Spacer(),
              // 右侧图标
              IconButton(
                icon: const Icon(Icons.grid_view, color: Colors.black),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.more_vert, color: Colors.black),
                onPressed: () {},
              ),
            ],
          ),
        ),
      ],
    );
  }

  /// 构建筛选栏
  Widget _buildFilterBar() {
    return Column(
      children: [
        // 第一行：排序选项
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(
              bottom: BorderSide(color: Colors.grey[200]!, width: 1),
            ),
          ),
          child: Row(
            children: [
              _buildSortButton('综合推荐', '综合推荐', _sortBy == '综合推荐'),
              const SizedBox(width: 16),
              _buildSortButton('销量', '销量', _sortBy == '销量'),
              const SizedBox(width: 16),
              _buildSortButton('价格', '价格', _sortBy == '价格'),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () {
                  setState(() {
                    _isPriceAscending = !_isPriceAscending;
                  });
                  _sortProducts('价格');
                },
                child: Icon(
                  _isPriceAscending
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  size: 16,
                  color: _sortBy == '价格' ? Colors.blue : Colors.grey[600],
                ),
              ),
              const SizedBox(width: 16),
              _buildSortButton('筛选', '筛选', false),
              const SizedBox(width: 8),
              const Icon(Icons.tune, size: 16, color: Colors.grey),
            ],
          ),
        ),
        // 第二行：筛选标签
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(
              bottom: BorderSide(color: Colors.grey[200]!, width: 1),
            ),
          ),
          child: Row(
            children: [
              _buildFilterChip('推荐', _selectedFilter == '推荐'),
              const SizedBox(width: 12),
              _buildFilterChip('好礼', _selectedFilter == '好礼'),
              const SizedBox(width: 12),
              _buildFilterChip('果切', _selectedFilter == '果切'),
              const SizedBox(width: 12),
              _buildFilterChip('尝秋果', _selectedFilter == '尝秋果'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSortButton(String text, String value, bool isSelected) {
    return GestureDetector(
      onTap: () {
        _sortProducts(value);
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: isSelected ? Colors.blue : Colors.black87,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
          if (isSelected) ...[
            const SizedBox(width: 4),
            Icon(Icons.keyboard_arrow_down, size: 16, color: Colors.blue),
          ],
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return GestureDetector(
      onTap: () {
        _filterProducts(label);
      },
      child: Container(
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
      ),
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => ProductDetail(product: product),
              ),
            );
          },
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 商品图片
                    Stack(
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Center(
                            child: Icon(
                              widget.categoryName == 'iPhone'
                                  ? Icons.phone_iphone
                                  : Icons.shopping_bag,
                              size: 50,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                        // 标签
                        if (product['tags'] != null)
                          ...(product['tags'] as List)
                              .map(
                                (tag) => Positioned(
                                  top: 4,
                                  left: 4,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 4,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color: tag == 'HOT'
                                          ? Colors.red
                                          : Colors.orange,
                                      borderRadius: BorderRadius.circular(3),
                                    ),
                                    child: Text(
                                      tag as String,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 8,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              )
                              .toList(),
                      ],
                    ),
                    const SizedBox(width: 12),
                    // 商品信息
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // 商品名称
                          Text(
                            product['name'] as String,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              height: 1.3,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 6),

                          // 规格信息
                          if (product['specs'] != null)
                            Wrap(
                              spacing: 2,
                              runSpacing: 2,
                              children: (product['specs'] as List)
                                  .take(4)
                                  .map(
                                    (spec) => Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                        vertical: 1,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.grey[100],
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                      child: Text(
                                        spec as String,
                                        style: TextStyle(
                                          fontSize: 8,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),
                          const SizedBox(height: 6),

                          // 价格信息
                          Row(
                            children: [
                              Text(
                                '¥${product['price']}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                              if (product['originalPrice'] != null) ...[
                                const SizedBox(width: 6),
                                Text(
                                  '¥${product['originalPrice']}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[500],
                                    decoration: TextDecoration.lineThrough,
                                  ),
                                ),
                              ],
                              const Spacer(),
                              // 广告标签
                              if (product['isAd'] == true)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[300],
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                  child: const Text(
                                    '广告',
                                    style: TextStyle(
                                      fontSize: 8,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 4),

                          // 销量和好评
                          Text(
                            '${product['sales']} ${product['rating']}',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 4),

                          // 店铺信息
                          Text(
                            '${product['storeCustomers']} ${product['store']}',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 6),

                          // 优惠信息
                          if (product['offers'] != null)
                            Wrap(
                              spacing: 2,
                              runSpacing: 2,
                              children: (product['offers'] as List)
                                  .map(
                                    (offer) => Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 4,
                                        vertical: 1,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.blue.withValues(
                                          alpha: 0.1,
                                        ),
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                      child: Text(
                                        offer as String,
                                        style: const TextStyle(
                                          fontSize: 8,
                                          color: Colors.blue,
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),
                          const SizedBox(height: 6),

                          // 底部信息
                          Row(
                            children: [
                              if (product['subsidy'] != null &&
                                  (product['subsidy'] as String).isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.green.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                  child: Text(
                                    product['subsidy'] as String,
                                    style: const TextStyle(
                                      fontSize: 8,
                                      color: Colors.green,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              if (product['subsidy'] != null &&
                                  (product['subsidy'] as String).isNotEmpty)
                                const SizedBox(width: 4),
                              if (product['installment'] != null &&
                                  (product['installment'] as String).isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                  child: Text(
                                    product['installment'] as String,
                                    style: const TextStyle(
                                      fontSize: 8,
                                      color: Colors.orange,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              const Spacer(),
                              // 进店按钮
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                                child: const Text(
                                  '进店>',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
