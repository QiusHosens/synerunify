import 'package:flutter/material.dart';
import 'package:easy_refresh/easy_refresh.dart';
import 'package:synerunify/services/mall_product_category.dart';
import 'package:synerunify/services/system_file.dart';
import 'package:synerunify/utils/logger.dart';

import '../category/product_list.dart';
import '../../utils/date_utils.dart';

class StoreCategoryPage extends StatefulWidget {
  final VoidCallback onClose;

  const StoreCategoryPage({super.key, required this.onClose});

  @override
  State<StoreCategoryPage> createState() => _StoreCategoryPageState();
}

class _StoreCategoryPageState extends State<StoreCategoryPage> {
  final SystemFileService _systemFileService = SystemFileService();
  final MallProductCategoryService _mallProductCategoryService =
      MallProductCategoryService();
  final EasyRefreshController _refreshController = EasyRefreshController(
    controlFinishRefresh: true,
    controlFinishLoad: true,
  );

  int _selectedCategoryId = 0;
  DateTime? _lastRefreshTime;

  List<MallProductCategoryResponse> _mainCategories = [];
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
    Logger.info('StoreCategoryPage loadMainCategories: ${response.toJson()}');
    if (response.success) {
      setState(() {
        _mainCategories = response.data ?? [];
        if (_mainCategories.isNotEmpty) {
          _selectedCategoryId = _mainCategories.first.id;
          _loadFeaturedProducts();
        }
      });
    }
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

      Logger.info(
        'StoreCategoryPage featuredProducts: ${featuredProducts.map((e) => e.toJson()).toList()}',
      );

      setState(() {
        _categorySections = featuredProducts;
      });
    }
  }

  Future<void> _onRefresh() async {
    _loadMainCategories();
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
            _buildTopBar(),
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
                    _buildCategoryList(),
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

  Widget _buildTopBar() {
    return Column(
      children: [
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
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('搜索功能开发中...')),
                  );
                },
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: widget.onClose,
              ),
              const SizedBox(width: 8),
            ],
          ),
        ),
      ],
    );
  }

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
                    fontWeight:
                        isSelected ? FontWeight.bold : FontWeight.normal,
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

  Widget _buildCategorySection() {
    return Expanded(
      child: Container(
        color: Colors.white,
        child: ListView.builder(
          itemCount: _categorySections.length,
          itemBuilder: (context, index) {
            final category = _categorySections[index];
            final categories = category.children ?? [];
            Logger.info('StoreCategoryPage category: ${category.toJson()}');
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    childAspectRatio: 0.75,
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

  Widget _buildProductItem(MallProductCategoryResponse category) {
    String previewUrl = _systemFileService.getPreviewUrl(category.fileId!);
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => ProductListPage(category: category),
          ),
        );
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(30),
            ),
            child: Image.network(previewUrl),
          ),
          const SizedBox(height: 8),
          Flexible(
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
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

