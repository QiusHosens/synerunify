import 'package:flutter/material.dart';
import 'package:synerunify/services/mall_product_spu.dart';
import 'package:synerunify/services/system_file.dart';
import 'package:easy_refresh/easy_refresh.dart';
import '../../widgets/specification_modal.dart';
import '../cart/checkout.dart';

class ProductDetail extends StatefulWidget {
  final MallProductSpuResponse product;

  const ProductDetail({super.key, required this.product});

  @override
  State<ProductDetail> createState() => _ProductDetailState();
}

class _ProductDetailState extends State<ProductDetail>
    with TickerProviderStateMixin {
  final MallProductSpuService _mallProductSpuService = MallProductSpuService();
  final SystemFileService _systemFileService = SystemFileService();
  final EasyRefreshController _refreshController = EasyRefreshController(
    controlFinishRefresh: true,
  );
  late TabController _tabController;
  late PageController _imagePageController;

  late MallProductSpuResponse _product;

  int _currentImageIndex = 0;
  int _quantity = 1;
  bool _isFavorite = false;
  bool _isLoading = true;
  int _selectedColorIndex = 0;
  int _selectedSizeIndex = 0;

  List<String> _productImages = [];
  // 模拟商品详情数据
  // final List<String> _productImages = [
  //   'assets/images/chicken_diced_1.jpg',
  //   'assets/images/chicken_diced_2.jpg',
  //   'assets/images/chicken_diced_3.jpg',
  //   'assets/images/chicken_diced_4.jpg',
  //   'assets/images/chicken_diced_5.jpg',
  // ];

  // 商品标签
  final List<Map<String, dynamic>> _productTags = [
    {'name': '健身食材', 'icon': Icons.fitness_center, 'color': Colors.blue},
    {'name': '冰鲜', 'icon': Icons.ac_unit, 'color': Colors.cyan},
    {'name': '免洗免切', 'icon': Icons.cleaning_services, 'color': Colors.green},
    {'name': '0使用激素', 'icon': Icons.eco, 'color': Colors.orange},
  ];

  // 颜色和尺寸选项
  final List<String> _colors = ['红色', '蓝色', '黑色', '白色'];
  final List<String> _sizes = ['S', 'M', 'L', 'XL'];

  // 模拟评价数据
  final List<Map<String, dynamic>> _reviews = [
    {
      'user': 't**t',
      'isMember': true,
      'purchaseCount': 3,
      'content': '新鲜直供,适量包装,方便吃,鸡肉嫩滑,无骨鸡腿...',
      'date': '2024-01-15',
      'images': ['assets/images/review_1.jpg'],
    },
    {
      'user': '米**0',
      'isMember': true,
      'purchaseCount': 10,
      'content': '鸡腿肉丁喜欢,份量合适,无骨鸡腿 方便吃!',
      'date': '2024-01-14',
      'images': ['assets/images/review_2.jpg'],
    },
  ];

  // 推荐商品数据
  final List<Map<String, dynamic>> _recommendedProducts = [
    {
      'name': '黄瓜 约600g',
      'price': '¥5.5',
      'unit': '/份',
      'sales': '5000+人买了它',
      'image': 'assets/images/cucumber.jpg',
    },
    {
      'name': '薄皮椒 约300g',
      'price': '¥3.89',
      'unit': '/份',
      'sales': '9000+人买了它',
      'image': 'assets/images/pepper.jpg',
    },
    {
      'name': '卷心菜 约800g',
      'price': '¥3.5',
      'unit': '/份',
      'sales': '4000+人买了它',
      'image': 'assets/images/cabbage.jpg',
    },
    {
      'name': '盒马 混合菜 400g',
      'price': '¥7.5',
      'unit': '/袋',
      'sales': '1000+人买了它',
      'image': 'assets/images/mixed_vegetables.jpg',
    },
    {
      'name': '精品冷鲜精肉丝 (盒马日日鲜)',
      'price': '¥6.8',
      'unit': '/盒',
      'sales': '10000+人买了它',
      'image': 'assets/images/meat_strips.jpg',
    },
    {
      'name': '薄皮二荆条 约250g',
      'price': '¥3.5',
      'unit': '/份',
      'sales': '9000+人买了它',
      'image': 'assets/images/chili.jpg',
    },
  ];

  // 评价关键词
  final List<Map<String, dynamic>> _reviewKeywords = [
    {'keyword': '方便吃', 'count': 907},
    {'keyword': '无骨鸡腿', 'count': 862},
    {'keyword': '新鲜直供', 'count': 859},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _imagePageController = PageController();
    _product = widget.product; // 初始化产品数据
    _getProductInfo();
  }

  Future<void> _getProductInfo() async {
    setState(() {
      _isLoading = true;
    });
    
    final response = await _mallProductSpuService
        .getMallProductSpuInfoWithoutUser(widget.product.id);
    if (response.success && response.data != null) {
      setState(() {
        _product = response.data!;
        _productImages = [];
        if (_product.sliderFileIds != null) {
          List<String> sliderFileIds = _product.sliderFileIds!.split(',');
          for (String fileId in sliderFileIds) {
            String previewUrl = _systemFileService.getPreviewUrl(
              int.parse(fileId),
            );
            _productImages.add(previewUrl);
          }
        }
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// 下拉刷新商品信息
  Future<void> _refreshProductInfo() async {
    await _getProductInfo();
    _refreshController.finishRefresh();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _imagePageController.dispose();
    _refreshController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // 状态栏和导航栏
          _buildStatusBar(),
          _buildNavigationBar(),
          // 商品内容
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(),
                  )
                : EasyRefresh(
                    controller: _refreshController,
                    onRefresh: _refreshProductInfo,
                    header: const ClassicHeader(
                      dragText: '下拉刷新',
                      armedText: '释放刷新',
                      readyText: '正在刷新...',
                      processingText: '正在刷新...',
                      processedText: '刷新完成',
                      failedText: '刷新失败',
                      messageText: '最后更新于 %T',
                    ),
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Column(
                        children: [
                          // 商品图片轮播
                          _buildImageCarousel(),
                          // 商品基本信息
                          _buildProductInfo(),
                          // 商品标签
                          _buildProductTags(),
                          // 商品描述
                          _buildProductDescription(),
                          // 品牌信息
                          _buildBrandInfo(),
                          // 评价统计
                          _buildReviewStats(),
                          // Tab切换内容
                          _buildTabContent(),
                        ],
                      ),
                    ),
                  ),
          ),
          // 会员优惠横幅
          if (!_isLoading) _buildMembershipBanner(),
          // 底部操作栏
          if (!_isLoading) _buildBottomBar(),
        ],
      ),
    );
  }

  /// 构建状态栏
  Widget _buildStatusBar() {
    return Container(
      height: MediaQuery.of(context).padding.top,
      color: Colors.white,
    );
  }

  /// 构建导航栏
  Widget _buildNavigationBar() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Expanded(
            child: Container(
              height: 36,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(18),
              ),
              child: const Row(
                children: [
                  SizedBox(width: 12),
                  Icon(Icons.search, color: Colors.grey, size: 20),
                  SizedBox(width: 8),
                  Text(
                    '鲜鸡腿',
                    style: TextStyle(color: Colors.grey, fontSize: 14),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.share, color: Colors.black),
            onPressed: () {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('分享功能开发中...')));
            },
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart, color: Colors.black),
                onPressed: () {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(const SnackBar(content: Text('查看购物车...')));
                },
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      '1',
                      style: TextStyle(color: Colors.white, fontSize: 10),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
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
                color: Colors.grey[100],
                child: Center(
                  // child: Icon(Icons.image, size: 100, color: Colors.grey),
                  child: Image.network(_productImages[index]),
                ),
              );
            },
          ),
          // 图片指示器和评价标签
          Positioned(
            bottom: 20,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${_currentImageIndex + 1}/${_productImages.length} 评价',
                style: const TextStyle(color: Colors.white, fontSize: 12),
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
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 价格信息
          Row(
            children: [
              Text(
                '¥${_product.price}',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.red,
                ),
              ),
              // const Text(
              //   '/盒',
              //   style: TextStyle(fontSize: 16, color: Colors.red),
              // ),
            ],
          ),
          const SizedBox(height: 8),
          // 商品名称
          Text(
            // '冷鲜 鸡腿肉丁 300g/盒',
            _product.name,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 8),
          // 保质期
          const Text(
            '保质期6天>',
            style: TextStyle(fontSize: 14, color: Colors.black87),
          ),
        ],
      ),
    );
  }

  /// 构建商品标签
  Widget _buildProductTags() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: _productTags.map((tag) {
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(tag['icon'], size: 16, color: tag['color']),
                const SizedBox(width: 4),
                Text(tag['name'], style: const TextStyle(fontSize: 12)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  /// 构建商品描述
  Widget _buildProductDescription() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: const Text(
        '高标准养殖,活禽天天鲜宰,精选上腿排肉,肉质鲜嫩,均匀切丁,方便易烹饪,小炒优选',
        style: TextStyle(fontSize: 14, height: 1.5),
      ),
    );
  }

  /// 构建品牌信息
  Widget _buildBrandInfo() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Text(
            '盒马鲜生',
            style: TextStyle(fontSize: 14, color: Colors.blue),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.edit, size: 12, color: Colors.grey),
                SizedBox(width: 4),
                Text('反馈', style: TextStyle(fontSize: 12, color: Colors.grey)),
                SizedBox(width: 4),
                Icon(Icons.close, size: 12, color: Colors.grey),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建评价统计
  Widget _buildReviewStats() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                '评价 (3000+)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const Spacer(),
              const Text(
                '查看全部 >',
                style: TextStyle(fontSize: 14, color: Colors.blue),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // 好评率
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.blue[50],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Text(
                  '97.9% 好评率',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Wrap(
                    spacing: 8,
                    children: _reviewKeywords.map((keyword) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${keyword['keyword']} ${keyword['count']}人提到',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建会员优惠横幅
  Widget _buildMembershipBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.orange[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          const Icon(Icons.close, size: 16, color: Colors.grey),
          const SizedBox(width: 8),
          const Icon(Icons.card_membership, size: 16, color: Colors.orange),
          const SizedBox(width: 8),
          const Text('会员日88折,0门槛免运费', style: TextStyle(fontSize: 14)),
          const Spacer(),
          const Text(
            '立即开通 >',
            style: TextStyle(fontSize: 14, color: Colors.blue),
          ),
        ],
      ),
    );
  }

  /// 构建Tab内容
  Widget _buildTabContent() {
    return Container(
      child: Column(
        children: [
          // Tab导航
          Container(
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Colors.grey, width: 0.5),
              ),
            ),
            child: TabBar(
              controller: _tabController,
              labelColor: Colors.blue,
              unselectedLabelColor: Colors.grey,
              indicatorColor: Colors.blue,
              tabs: const [
                Tab(text: '商品'),
                Tab(text: '评价'),
                Tab(text: '精选'),
                Tab(text: '详情'),
                Tab(text: '推荐'),
              ],
            ),
          ),
          // Tab内容
          SizedBox(
            height: 400,
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildProductTab(),
                _buildReviewTab(),
                _buildFeaturedTab(),
                _buildDetailTab(),
                _buildRecommendTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建商品Tab
  Widget _buildProductTab() {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '商品信息',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16),
          Text(
            '这是一款优质的生鲜商品，采用高标准养殖，活禽天天鲜宰，精选上腿排肉，肉质鲜嫩，均匀切丁，方便易烹饪。',
            style: TextStyle(fontSize: 14, height: 1.6),
          ),
        ],
      ),
    );
  }

  /// 构建评价Tab
  Widget _buildReviewTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 评价列表
          ..._reviews
              .map(
                (review) => Container(
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
                          const CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.grey,
                            child: Icon(
                              Icons.person,
                              size: 16,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            review['user'],
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          if (review['isMember']) ...[
                            const SizedBox(width: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 4,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                '会员',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                          const SizedBox(width: 8),
                          Text(
                            '购买${review['purchaseCount']}+次',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        review['content'],
                        style: const TextStyle(fontSize: 14, height: 1.4),
                      ),
                      if (review['images'].isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Container(
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
                        ),
                      ],
                    ],
                  ),
                ),
              )
              .toList(),
        ],
      ),
    );
  }

  /// 构建精选Tab
  Widget _buildFeaturedTab() {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '精选内容',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16),
          Center(child: Icon(Icons.star, size: 100, color: Colors.grey)),
          SizedBox(height: 16),
          Text(
            '精选商品推荐和特色内容',
            style: TextStyle(fontSize: 14, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  /// 构建详情Tab
  Widget _buildDetailTab() {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '详情',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16),
          Row(
            children: [
              Text('产地: ', style: TextStyle(fontSize: 14)),
              Text(
                '见产品外包装',
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Text('净含量: ', style: TextStyle(fontSize: 14)),
              Text('300g', style: TextStyle(fontSize: 14, color: Colors.grey)),
            ],
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Text('储存条件: ', style: TextStyle(fontSize: 14)),
              Text('冷藏', style: TextStyle(fontSize: 14, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }

  /// 构建推荐Tab
  Widget _buildRecommendTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '推荐商品',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.8,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
            ),
            itemCount: _recommendedProducts.length,
            itemBuilder: (context, index) {
              final product = _recommendedProducts[index];
              return Container(
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(8),
                          ),
                        ),
                        child: const Icon(
                          Icons.image,
                          size: 40,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product['name'],
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            product['sales'],
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Text(
                                product['price'],
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                              Text(
                                product['unit'],
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.red,
                                ),
                              ),
                              const Spacer(),
                              const Icon(
                                Icons.add_shopping_cart,
                                size: 16,
                                color: Colors.blue,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
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
        border: Border(top: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        children: [
          // 收藏按钮
          GestureDetector(
            onTap: () {
              setState(() {
                _isFavorite = !_isFavorite;
              });
            },
            child: Container(
              width: 60,
              height: 50,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    _isFavorite ? Icons.favorite : Icons.favorite_border,
                    size: 20,
                    color: _isFavorite ? Colors.red : Colors.grey,
                  ),
                  const Text('收藏', style: TextStyle(fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(width: 12),
          // AI小蜜按钮
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
                Icon(Icons.smart_toy, size: 20),
                Text('AI小蜜', style: TextStyle(fontSize: 12)),
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
                backgroundColor: Colors.blue,
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
    _showSpecificationModal('加入购物车');
  }

  /// 立即购买
  void _buyNow() {
    _showSpecificationModal('立即购买');
  }

  /// 显示规格选择弹窗
  void _showSpecificationModal(String action) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => SpecificationModal(
        product: widget.product.toJson(),
        selectedColorIndex: _selectedColorIndex,
        selectedSizeIndex: _selectedSizeIndex,
        quantity: _quantity,
        colors: _colors,
        sizes: _sizes,
        onConfirm: (colorIndex, sizeIndex, quantity) {
          setState(() {
            _selectedColorIndex = colorIndex;
            _selectedSizeIndex = sizeIndex;
            _quantity = quantity;
          });

          if (action == '加入购物车') {
            _confirmAddToCart();
          } else {
            _confirmBuyNow();
          }
        },
      ),
    );
  }

  /// 确认加入购物车
  void _confirmAddToCart() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('已加入购物车：${widget.product.name} x$_quantity'),
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

  /// 确认立即购买
  void _confirmBuyNow() {
    Navigator.of(context).pop(); // 关闭规格选择弹窗

    String previewUrl = _systemFileService.getPreviewUrl(widget.product.fileId);

    // 创建商品项目数据
    final cartItem = {
      'id': widget.product.id,
      'name': widget.product.name,
      'price': widget.product.price,
      'quantity': _quantity,
      'image': previewUrl ?? 'assets/images/placeholder.png',
      'selected': true,
      'specifications': {
        'color': _colors[_selectedColorIndex],
        'size': _sizes[_selectedSizeIndex],
      },
    };

    // 计算总金额
    double totalAmount = widget.product.price.toDouble() * _quantity;

    // 显示结算弹窗
    Checkout.show(context, cartItems: [cartItem], totalAmount: totalAmount);
  }
}
