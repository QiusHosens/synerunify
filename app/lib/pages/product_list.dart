import 'package:flutter/material.dart';
import 'product_detail.dart';

class ProductList extends StatefulWidget {
  final String category;
  final String searchKeyword;

  const ProductList({super.key, this.category = '全部', this.searchKeyword = ''});

  @override
  State<ProductList> createState() => _ProductListState();
}

class _ProductListState extends State<ProductList> {
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _products = [];
  bool _isLoading = false;
  int _currentPage = 1;
  String _sortBy = 'default';
  String _filterPrice = 'all';

  @override
  void initState() {
    super.initState();
    _loadProducts();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  /// 滚动监听
  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreProducts();
    }
  }

  /// 加载商品数据
  void _loadProducts() {
    setState(() {
      _isLoading = true;
    });

    // 模拟网络请求
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _products.clear();
          _products.addAll(_generateProducts(1));
          _isLoading = false;
        });
      }
    });
  }

  /// 加载更多商品
  void _loadMoreProducts() {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    // 模拟网络请求
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _currentPage++;
          _products.addAll(_generateProducts(_currentPage));
          _isLoading = false;
        });
      }
    });
  }

  /// 生成模拟商品数据
  List<Map<String, dynamic>> _generateProducts(int page) {
    final products = <Map<String, dynamic>>[];
    final categories = ['手机数码', '服装鞋帽', '家居生活', '美妆护肤', '运动户外'];

    for (int i = 0; i < 10; i++) {
      final productId = (page - 1) * 10 + i + 1;
      products.add({
        'id': productId,
        'name': '${widget.category}商品 ${productId}',
        'price': (99 + i * 10).toDouble(),
        'originalPrice': (199 + i * 20).toDouble(),
        'image': 'https://via.placeholder.com/200x200',
        'sales': 100 + i * 50,
        'rating': 4.0 + (i % 5) * 0.2,
        'category': categories[i % categories.length],
        'brand': '品牌${i % 3 + 1}',
        'tags': ['包邮', '7天无理由退货', '正品保证'],
        'discount': (i % 3 == 0) ? '限时特价' : null,
      });
    }
    return products;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(widget.category),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: _showSearchDialog,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // 排序和筛选栏
          _buildSortBar(),
          // 商品列表
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                _loadProducts();
              },
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _products.length + (_isLoading ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _products.length) {
                    return const Center(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }

                  final product = _products[index];
                  return _buildProductItem(product);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建排序栏
  Widget _buildSortBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Row(
        children: [
          _buildSortButton('综合', 'default'),
          _buildSortButton('销量', 'sales'),
          _buildSortButton('价格', 'price'),
          _buildSortButton('评分', 'rating'),
          const Spacer(),
          Text(
            '共${_products.length}件商品',
            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  /// 构建排序按钮
  Widget _buildSortButton(String text, String value) {
    final isSelected = _sortBy == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _sortBy = value;
        });
        _loadProducts();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        margin: const EdgeInsets.only(right: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue : Colors.grey[100],
          borderRadius: BorderRadius.circular(15),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: isSelected ? Colors.white : Colors.black87,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  /// 构建商品项
  Widget _buildProductItem(Map<String, dynamic> product) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // 商品图片
                Container(
                  width: 100,
                  height: 100,
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
                      // 商品标题
                      Text(
                        product['name'] as String,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      // 品牌和分类
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.blue[50],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              product['brand'] as String,
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.blue[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            product['category'] as String,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      // 价格信息
                      Row(
                        children: [
                          Text(
                            '¥${product['price'].toString()}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.red,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '¥${product['originalPrice'].toString()}',
                            style: TextStyle(
                              fontSize: 14,
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
                          Icon(Icons.star, size: 14, color: Colors.orange[300]),
                          const SizedBox(width: 2),
                          Text(
                            '${product['rating']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            '已售${product['sales']}',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          const Spacer(),
                          // 标签
                          if (product['discount'] != null)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.red[50],
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                product['discount'] as String,
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.red[700],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      // 标签
                      Wrap(
                        spacing: 4,
                        children: (product['tags'] as List)
                            .map(
                              (tag) => Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 4,
                                  vertical: 1,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.grey[100],
                                  borderRadius: BorderRadius.circular(2),
                                ),
                                child: Text(
                                  tag as String,
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// 显示搜索对话框
  void _showSearchDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('搜索商品'),
        content: TextField(
          decoration: const InputDecoration(
            hintText: '请输入商品名称',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (value) {
            Navigator.of(context).pop();
            if (value.isNotEmpty) {
              // 执行搜索
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text('搜索: $value')));
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('搜索功能开发中...')));
            },
            child: const Text('搜索'),
          ),
        ],
      ),
    );
  }

  /// 显示筛选对话框
  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '价格筛选',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                _buildFilterChip('全部', 'all'),
                _buildFilterChip('0-100', '0-100'),
                _buildFilterChip('100-500', '100-500'),
                _buildFilterChip('500-1000', '500-1000'),
                _buildFilterChip('1000以上', '1000+'),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              '品牌筛选',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                _buildFilterChip('全部品牌', 'all_brand'),
                _buildFilterChip('品牌1', 'brand1'),
                _buildFilterChip('品牌2', 'brand2'),
                _buildFilterChip('品牌3', 'brand3'),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: const Text('重置'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _loadProducts();
                    },
                    child: const Text('确定'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// 构建筛选标签
  Widget _buildFilterChip(String text, String value) {
    final isSelected = _filterPrice == value;
    return GestureDetector(
      onTap: () {
        setState(() {
          _filterPrice = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue : Colors.grey[100],
          borderRadius: BorderRadius.circular(15),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: isSelected ? Colors.white : Colors.black87,
          ),
        ),
      ),
    );
  }
}
