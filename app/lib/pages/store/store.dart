import 'package:flutter/material.dart';
import 'package:synerunify/services/system_tenant.dart';
import '../product/product_detail.dart';
import 'store_category.dart';
import 'store_discover.dart';
import 'store_grass.dart';
import 'store_member.dart';

class Store extends StatefulWidget { 
  final int storeId;

  const Store({super.key, required this.storeId});

  @override
  State<Store> createState() => _StoreState();
}

class _StoreState extends State<Store> with TickerProviderStateMixin {
  final SystemTenantService _systemTenantService = SystemTenantService();
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  bool _isFollowing = false;

  late SystemTenantResponse tenantInfo;

  // 模拟店铺数据
  final List<Map<String, dynamic>> _featuredProducts = [];
  final List<Map<String, dynamic>> _allProducts = [];
  final List<Map<String, dynamic>> _activities = [];
  final List<Map<String, dynamic>> _newProducts = [];
  final List<Map<String, dynamic>> _userShares = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 8, vsync: this);
    _getStoreInfo();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _getStoreInfo() async {
    final response = await _systemTenantService.getSystemTenantNoAuth(widget.storeId);
    if (response.success && response.data != null) {
      setState(() {
        tenantInfo = response.data!;
      });
    }
  }

  /// 加载店铺数据
  void _loadStoreData() {
    // 模拟加载精选商品
    _featuredProducts.addAll(_generateProducts('featured', 6));
    // 模拟加载所有商品
    _allProducts.addAll(_generateProducts('all', 20));
    // 模拟加载活动数据
    _activities.addAll(_generateActivities());
    // 模拟加载新品数据
    _newProducts.addAll(_generateProducts('new', 8));
    // 模拟加载用户分享数据
    _userShares.addAll(_generateUserShares());
  }

  /// 生成模拟商品数据
  List<Map<String, dynamic>> _generateProducts(String type, int count) {
    final products = <Map<String, dynamic>>[];
    for (int i = 0; i < count; i++) {
      products.add({
        'id': '$type-$i',
        'name': '${tenantInfo.name}商品 ${i + 1}',
        'price': (99 + i * 10).toDouble(),
        'originalPrice': (199 + i * 20).toDouble(),
        'image': 'https://via.placeholder.com/200x200',
        'sales': 100 + i * 50,
        'rating': 4.0 + (i % 5) * 0.2,
        'tags': ['包邮', '7天无理由退货'],
        'isNew': type == 'new',
        'discount': (i % 3 == 0) ? '限时特价' : null,
      });
    }
    return products;
  }

  /// 生成模拟活动数据
  List<Map<String, dynamic>> _generateActivities() {
    return [
      {
        'id': '1',
        'title': '新品首发',
        'subtitle': '限时优惠，错过再等一年',
        'image': 'https://via.placeholder.com/400x200',
        'type': 'new_product',
        'discount': '8折',
      },
      {
        'id': '2',
        'title': '满减活动',
        'subtitle': '满199减50，满399减100',
        'image': 'https://via.placeholder.com/400x200',
        'type': 'discount',
        'discount': '满减',
      },
      {
        'id': '3',
        'title': '会员专享',
        'subtitle': '会员独享优惠价格',
        'image': 'https://via.placeholder.com/400x200',
        'type': 'member',
        'discount': '会员价',
      },
    ];
  }

  /// 生成模拟用户分享数据
  List<Map<String, dynamic>> _generateUserShares() {
    return [
      {
        'id': '1',
        'user': '用户001',
        'avatar': 'https://via.placeholder.com/50x50',
        'content': '这个商品真的很好用，强烈推荐！',
        'images': ['https://via.placeholder.com/200x200'],
        'likes': 128,
        'comments': 23,
        'date': '2024-01-15',
        'product': {'name': '相关商品名称', 'price': 299.0},
      },
      {
        'id': '2',
        'user': '用户002',
        'avatar': 'https://via.placeholder.com/50x50',
        'content': '质量很好，包装精美，值得购买！',
        'images': [
          'https://via.placeholder.com/200x200',
          'https://via.placeholder.com/200x200',
        ],
        'likes': 256,
        'comments': 45,
        'date': '2024-01-14',
        'product': {'name': '相关商品名称2', 'price': 199.0},
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            // 自定义AppBar
            SliverAppBar(
              expandedHeight: 200,
              floating: false,
              pinned: true,
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.blue, Colors.blueAccent],
                    ),
                  ),
                  child: Column(
                    children: [
                      const SizedBox(height: 30),
                      // Tab切换
                      _buildTabBar(),
                      const SizedBox(height: 20),
                      // 店铺信息
                      _buildStoreHeader(),
                    ],
                  ),
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    ScaffoldMessenger.of(
                      context,
                    ).showSnackBar(const SnackBar(content: Text('搜索功能开发中...')));
                  },
                ),
                IconButton(
                  icon: Stack(
                    children: [
                      const Icon(Icons.more_vert),
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 16,
                            minHeight: 16,
                          ),
                          child: const Text(
                            '5+',
                            style: TextStyle(color: Colors.white, fontSize: 10),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ],
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(
                      context,
                    ).showSnackBar(const SnackBar(content: Text('更多功能开发中...')));
                  },
                ),
              ],
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildFeaturedTab(),
            // StoreCategory(tenantInfo: tenantInfo),
            _buildProductsTab(),
            _buildActivitiesTab(),
            _buildNewProductsTab(),
            // StoreDiscover(tenantInfo: tenantInfo),
            // StoreGrass(tenantInfo: tenantInfo),
            // StoreMember(tenantInfo: tenantInfo),
          ],
        ),
      ),
    );
  }

  /// 构建Tab切换栏
  Widget _buildTabBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(25),
      ),
      child: TabBar(
        controller: _tabController,
        indicator: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
        ),
        indicatorSize: TabBarIndicatorSize.tab,
        dividerColor: Colors.transparent,
        labelColor: Colors.blue,
        unselectedLabelColor: Colors.white,
        labelStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        unselectedLabelStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.normal,
        ),
        tabs: const [
          Tab(text: '精选'),
          Tab(text: '分类'),
          Tab(text: '商品'),
          Tab(text: '活动'),
          Tab(text: '新品'),
          Tab(text: '发现'),
          Tab(text: '种草秀'),
          Tab(text: '会员'),
        ],
      ),
    );
  }

  /// 构建店铺头部信息
  Widget _buildStoreHeader() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // 店铺Logo
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.blue[600],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: Text(
                tenantInfo.name.substring(0, 2),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // 店铺信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tenantInfo.name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, size: 14, color: Colors.orange),
                    const SizedBox(width: 4),
                    const Text('4.9', style: TextStyle(fontSize: 12)),
                    const SizedBox(width: 8),
                    Text(
                      '222.6万人关注',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '店铺榜 | 入选${'分类'}店铺榜',
                  style: TextStyle(fontSize: 10, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
          // 关注按钮
          ElevatedButton(
            onPressed: () {
              setState(() {
                _isFollowing = !_isFollowing;
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _isFollowing ? Colors.grey : Colors.red,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
            child: Text(_isFollowing ? '已关注' : '关注有礼'),
          ),
        ],
      ),
    );
  }

  /// 构建精选Tab
  Widget _buildFeaturedTab() {
    return SingleChildScrollView(
      child: Column(
        children: [
          // 轮播图
          _buildBannerCarousel(),
          const SizedBox(height: 16),
          // 推荐商品
          _buildProductGrid(_featuredProducts, '精选推荐'),
          const SizedBox(height: 16),
          // 品牌故事
          _buildBrandStory(),
        ],
      ),
    );
  }

  /// 构建商品Tab
  Widget _buildProductsTab() {
    return _buildProductGrid(_allProducts, '全部商品');
  }

  /// 构建活动Tab
  Widget _buildActivitiesTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _activities.length,
      itemBuilder: (context, index) {
        final activity = _activities[index];
        return _buildActivityCard(activity);
      },
    );
  }

  /// 构建新品Tab
  Widget _buildNewProductsTab() {
    return _buildProductGrid(_newProducts, '新品上市');
  }

  /// 构建轮播图
  Widget _buildBannerCarousel() {
    final banners = [
      {
        'image': 'https://via.placeholder.com/400x200',
        'title': '新品首发',
        'subtitle': '限时优惠，错过再等一年',
      },
      {
        'image': 'https://via.placeholder.com/400x200',
        'title': '满减活动',
        'subtitle': '满199减50，满399减100',
      },
      {
        'image': 'https://via.placeholder.com/400x200',
        'title': '会员专享',
        'subtitle': '会员独享优惠价格',
      },
    ];

    return Container(
      height: 200,
      margin: const EdgeInsets.all(16),
      child: PageView.builder(
        itemCount: banners.length,
        itemBuilder: (context, index) {
          final banner = banners[index];
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Stack(
                children: [
                  Container(
                    width: double.infinity,
                    height: double.infinity,
                    color: Colors.grey[200],
                    child: const Center(
                      child: Icon(Icons.image, size: 60, color: Colors.grey),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.7),
                          ],
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            banner['title'] as String,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            banner['subtitle'] as String,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  /// 构建商品网格
  Widget _buildProductGrid(List<Map<String, dynamic>> products, String title) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
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
        ),
      ],
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        // Navigator.of(context).push(
        //   MaterialPageRoute(
        //     builder: (context) => ProductDetail(product: product),
        //   ),
        // );
      },
      child: Container(
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
                          '¥${product['originalPrice'].toString()}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.star, size: 12, color: Colors.orange[300]),
                        const SizedBox(width: 2),
                        Text(
                          '${product['rating']}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '已售${product['sales']}',
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
            ),
          ],
        ),
      ),
    );
  }

  /// 构建品牌故事
  Widget _buildBrandStory() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '品牌故事',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            '我们致力于为用户提供最优质的产品和服务。自成立以来，始终坚持品质第一的原则，不断创新和完善产品线，赢得了广大用户的信任和喜爱。',
            style: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建活动卡片
  Widget _buildActivityCard(Map<String, dynamic> activity) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
      child: Column(
        children: [
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: const Center(
              child: Icon(Icons.image, size: 60, color: Colors.grey),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        activity['title'] as String,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        activity['discount'] as String,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  activity['subtitle'] as String,
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('参与活动: ${activity['title']}')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('立即参与'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
