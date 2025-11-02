import 'package:flutter/material.dart';
import 'package:synerunify/services/mall_product_category.dart';
import 'package:synerunify/services/system_file.dart';
import 'package:synerunify/utils/logger.dart';
import 'package:easy_refresh/easy_refresh.dart';
import 'product_list.dart';
import '../../utils/date_utils.dart';

class Category extends StatefulWidget {
  const Category({super.key});

  @override
  State<Category> createState() => _CategoryState();
}

class _CategoryState extends State<Category> {
  final SystemFileService _systemFileService = SystemFileService();
  final MallProductCategoryService _mallProductCategoryService =
      MallProductCategoryService();
  final EasyRefreshController _refreshController = EasyRefreshController(
    controlFinishRefresh: true,
    controlFinishLoad: true,
  );
  int _selectedCategoryId = 0; // 选中的分类
  DateTime? _lastRefreshTime;

  // 主分类数据
  List<MallProductCategoryResponse> _mainCategories = [];
  // final List<MallProductCategoryResponse> _mainCategories = [
  //   {'name': '为你推荐', 'isSelected': true},
  //   {'name': '休闲零食', 'isSelected': false},
  //   {'name': '水饮冲调', 'isSelected': false},
  //   {'name': '中外名酒', 'isSelected': false},
  //   {'name': '粮油调味', 'isSelected': false},
  //   {'name': '美妆个护', 'isSelected': false},
  //   {'name': '保健数码', 'isSelected': false},
  //   {'name': '纸品家清', 'isSelected': false},
  //   {'name': '母婴萌宠', 'isSelected': false},
  //   {'name': '家纺百货', 'isSelected': false},
  //   {'name': '餐饮面点', 'isSelected': false},
  //   {'name': '乳品烘焙', 'isSelected': false},
  //   {'name': '水果鲜花', 'isSelected': false},
  // ];

  // 精选推荐商品数据
  List<MallProductCategoryResponse> _categorySections = [];

  @override
  void initState() {
    super.initState();
    _loadMainCategories();
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  void _loadMainCategories() async {
    final response = await _mallProductCategoryService
        .listRootMallProductCategoryByParentId(0);
    Logger.info('loadMainCategories: ${response.toJson()}');
    if (response.success) {
      setState(() {
        Logger.info('loadMainCategories: ${response.data}');
        _mainCategories = response.data ?? [];
        if (_mainCategories.isNotEmpty) {
          _selectedCategoryId = _mainCategories.first.id;
          _loadFeaturedProducts();
        }
      });
    }
    // 完成刷新
    _refreshController.finishRefresh();
  }

  void _loadFeaturedProducts() async {
    final response = await _mallProductCategoryService
        .listRootAllMallProductCategoryByParentId(_selectedCategoryId);
    if (response.success) {
      List<MallProductCategoryResponse> data = response.data ?? [];
      List<MallProductCategoryResponse> featuredProducts = [];
      for (var category in data) {
        if (category.parentId == _selectedCategoryId) {
          featuredProducts.add(category);
        }
      }
      featuredProducts.sort((a, b) => a.sort!.compareTo(b.sort!));
      for (var category in featuredProducts) {
        List<MallProductCategoryResponse> children = [];
        for (var child in data) {
          if (child.parentId == category.id) {
            children.add(child);
          }
        }
        children.sort((a, b) => a.sort!.compareTo(b.sort!));
        category.children = children;
      }

      Logger.info('featuredProducts: ${featuredProducts.map((e) => e.toJson()).toList()}');

      setState(() {
        _categorySections = featuredProducts;
      });
    }
  }

  /// 刷新数据
  Future<void> _onRefresh() async {
    _loadMainCategories();
    
    // 更新最后刷新时间（东八区时间）
    setState(() {
      _lastRefreshTime = DateTime.now();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Column(
          children: [
            // 顶部状态栏和导航
            _buildTopBar(),
            // 主要内容区域
            Expanded(
              child: EasyRefresh(
                controller: _refreshController,
                onRefresh: _onRefresh,
                header: ClassicHeader(
                  dragText: '下拉刷新',
                  armedText: '释放刷新',
                  readyText: '正在刷新...',
                  processingText: '正在刷新...',
                  processedText: '刷新完成',
                  noMoreText: '没有更多数据',
                  failedText: '刷新失败',
                  messageText: AppDateUtils.getTimeDisplayText(_lastRefreshTime),
                ),
                child: Row(
                  children: [
                    // 左侧主分类列表
                    _buildCategoryList(),
                    // 右侧商品分类
                    _buildCategorySection(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建顶部状态栏和导航
  Widget _buildTopBar() {
    return Column(
      children: [
        // 蓝色标题栏
        Container(
          width: double.infinity,
          height: 50,
          color: Colors.blue,
          child: Row(
            children: [
              const SizedBox(width: 16),
              const Text(
                '分类',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.search, color: Colors.white),
                onPressed: () {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(const SnackBar(content: Text('搜索功能开发中...')));
                },
              ),
              const SizedBox(width: 8),
            ],
          ),
        ),
      ],
    );
  }

  /// 构建左侧分类列表
  Widget _buildCategoryList() {
    return Container(
      width: 100,
      color: Colors.grey[100],
      child: ListView.builder(
        itemCount: _mainCategories.length,
        itemBuilder: (context, index) {
          final category = _mainCategories[index];
          final isSelected = category.id == _selectedCategoryId;

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategoryId = category.id;
                _loadFeaturedProducts();
                // 更新所有分类的选中状态
                // for (int i = 0; i < _mainCategories.length; i++) {
                //   _mainCategories[i]['isSelected'] = i == index;
                // }
              });
            },
            child: Container(
              height: 50,
              color: isSelected ? Colors.blue : Colors.transparent,
              child: Center(
                child: Text(
                  category.name,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.black87,
                    fontSize: 12,
                    fontWeight: isSelected
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  /// 构建右侧区域
  Widget _buildCategorySection() {
    return Expanded(
      child: Container(
        color: Colors.white,
        child: ListView.builder(
          itemCount: _categorySections.length,
          itemBuilder: (context, index) {
            final category = _categorySections[index];
            final categories = category.children ?? [];
            Logger.info('category: ${category.toJson()}');
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 标题
                Container(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    category.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
                // 商品网格
                GridView.builder(
                  shrinkWrap: true, // 让GridView根据内容调整大小
                  physics: const NeverScrollableScrollPhysics(), // 禁用滚动，让外层ListView处理
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.75, // 降低比例，为文字留出更多空间
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    final product = categories[index];
                    return _buildProductItem(product);
                  },
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  /// 构建商品项
  Widget _buildProductItem(MallProductCategoryResponse category) {
    String previewUrl = _systemFileService.getPreviewUrl(category.fileId!);
    // Logger.info('previewUrl: ${previewUrl}');
    return GestureDetector(
      onTap: () {
        // 根据商品类型跳转到不同页面
        // if (product.type == 'iphone') {
        //   // 跳转到iPhone商品列表页面
        //   Navigator.of(context).push(
        //     MaterialPageRoute(
        //       builder: (context) =>
        //           ProductListPage(categoryName: product['name']),
        //     ),
        //   );
        // } else {
        //   // 跳转到普通商品列表页面
        //   Navigator.of(context).push(
        //     MaterialPageRoute(
        //       builder: (context) =>
        //           ProductList(category: product['name'], searchKeyword: ''),
        //     ),
        //   );
        // }
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) =>
                // ProductList(category: category.name, searchKeyword: ''),
                ProductListPage(category: category),
          ),
        );
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // 商品图片
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(30),
            ),
            // child: const Icon(Icons.image, color: Colors.grey, size: 30),
            child: Image.network(previewUrl),
          ),
          const SizedBox(height: 8),
          // 商品名称
          Flexible(
            // 使用Flexible替代Expanded，允许文字根据内容调整大小
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                category.name,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
                maxLines: 2, // 允许最多2行
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
