import 'package:flutter/material.dart';
import 'package:synerunify/pages/store/store.dart';
import 'package:synerunify/services/mall_product_category.dart';
import 'package:synerunify/services/mall_product_spu.dart';
import 'package:synerunify/services/system_file.dart';
import 'package:easy_refresh/easy_refresh.dart';
import '../product/product_detail.dart';
import '../../utils/date_utils.dart';

class ProductListPage extends StatefulWidget {
  final MallProductCategoryResponse category;

  const ProductListPage({super.key, required this.category});

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  final MallProductSpuService _mallProductSpuService = MallProductSpuService();
  final SystemFileService _systemFileService = SystemFileService();
  final EasyRefreshController _refreshController = EasyRefreshController(
    controlFinishRefresh: true,
    controlFinishLoad: true,
  );
  String _sortBy = '综合推荐';
  bool _isPriceAscending = false;
  String _selectedFilter = '推荐';
  List<MallProductSpuResponse> _filteredProducts = [];
  bool _isGridView = false; // 网格模式状态
  DateTime? _lastRefreshTime;

  // 商品数据，支持不同类型的商品
  List<MallProductSpuResponse> _products = [];

  // 分页相关变量
  int _currentPage = 1;
  int _pageSize = 20;
  bool _hasMoreData = true;
  bool _isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  @override
  void dispose() {
    _refreshController.dispose();
    super.dispose();
  }

  /// 根据分类名称加载对应的商品数据（刷新时重置分页）
  Future<void> _loadProducts({bool isRefresh = true}) async {
    try {
      if (isRefresh) {
        // 刷新时重置分页
        _currentPage = 1;
        _hasMoreData = true;
        _isLoadingMore = false;
      }

      final newProducts = await _getGeneralProducts(_currentPage);

      setState(() {
        if (isRefresh) {
          _products = newProducts;
        } else {
          _products.addAll(newProducts);
        }
        _filteredProducts = List.from(_products);
      });

      // 重新应用当前的筛选条件
      _filterProducts(_selectedFilter);

      // 检查是否还有更多数据
      _hasMoreData = newProducts.length >= _pageSize;

      // 如果是刷新操作，更新最后刷新时间（东八区时间）
      if (isRefresh) {
        _lastRefreshTime = DateTime.now();
      }
    } finally {
      if (isRefresh) {
        // 完成刷新
        _refreshController.finishRefresh();
      } else {
        // 完成加载更多
        _refreshController.finishLoad(
          _hasMoreData ? IndicatorResult.success : IndicatorResult.noMore,
        );
      }
    }
  }

  /// 加载更多数据
  Future<void> _loadMoreProducts() async {
    if (_isLoadingMore || !_hasMoreData) return;

    _isLoadingMore = true;
    _currentPage++;
    await _loadProducts(isRefresh: false);
    _isLoadingMore = false;
  }

  /// 通用商品数据
  Future<List<MallProductSpuResponse>> _getGeneralProducts(int page) async {
    final response = await _mallProductSpuService.pageAllMallProductSpu(
      MallProductSpuQueryCondition(
        page: page,
        size: _pageSize,
        categoryId: widget.category.id,
      ),
    );
    if (response.success) {
      return response.data?.list ?? [];
    }
    return [];
    // return [
    //   {
    //     'id': '1',
    //     'name': '${widget.categoryName}商品 1',
    //     'price': 299,
    //     'originalPrice': 399,
    //     'sales': '已售1000+',
    //     'rating': '95%好评',
    //     'store': '${widget.categoryName}专营店',
    //     'storeCustomers': '店铺回头客500',
    //     'delivery': '24小时送达',
    //     'location': '在你身边',
    //     'tags': ['热销'],
    //     'isAd': false,
    //     'image': 'assets/images/product1.png',
    //   },
    //   {
    //     'id': '2',
    //     'name': '${widget.categoryName}商品 2',
    //     'price': 599,
    //     'originalPrice': null,
    //     'sales': '已售500+',
    //     'rating': '98%好评',
    //     'store': '${widget.categoryName}自营店',
    //     'storeCustomers': '已关注',
    //     'delivery': '当日达',
    //     'location': '',
    //     'tags': ['新品'],
    //     'specs': ['高品质', '耐用', '性价比高'],
    //     'offers': ['包邮', '7天无理由退货'],
    //     'subsidy': '立减50元',
    //     'installment': '3期免息',
    //     'image': 'assets/images/product2.png',
    //   },
    // ];
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
              .where((product) => product.name.contains('好礼'))
              .toList();
          break;
        case '果切':
          // 筛选果切相关商品（这里用iPhone 15作为示例）
          _filteredProducts = _products
              .where((product) => product.name.contains('iPhone 15'))
              .toList();
          break;
        case '尝秋果':
          // 筛选秋季新品（这里用iPhone 17作为示例）
          _filteredProducts = _products
              .where((product) => product.name.contains('iPhone 17'))
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
            // 按销量排序
            return (b.salesCount ?? 0).compareTo(a.salesCount ?? 0);
          });
          break;
        case '价格':
          _filteredProducts.sort((a, b) {
            if (_isPriceAscending) {
              return a.price.compareTo(b.price);
            } else {
              return b.price.compareTo(a.price);
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
                  // _buildFilterBar(),
                  // 商品列表
                  Expanded(
                    child: _isGridView ? _buildGridView() : _buildListView(),
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
                widget.category.name,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const Spacer(),
              // 右侧图标
              IconButton(
                icon: Icon(
                  _isGridView ? Icons.view_list : Icons.grid_view,
                  color: Colors.black,
                ),
                onPressed: () {
                  setState(() {
                    _isGridView = !_isGridView;
                  });
                },
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

  /// 构建列表视图
  Widget _buildListView() {
    return EasyRefresh(
      controller: _refreshController,
      onRefresh: () async {
        await _loadProducts(isRefresh: true);
      },
      onLoad: () async {
        await _loadMoreProducts();
      },
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
      footer: ClassicFooter(
        dragText: '上拉加载',
        armedText: '释放加载',
        readyText: '正在加载...',
        processingText: '正在加载...',
        processedText: '加载完成',
        noMoreText: '没有更多数据了',
        failedText: '加载失败',
        messageText: AppDateUtils.getTimeDisplayText(_lastRefreshTime),
      ),
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _filteredProducts.length,
        itemBuilder: (context, index) {
          final product = _filteredProducts[index];
          return _buildProductCard(product);
        },
      ),
    );
  }

  /// 构建网格视图
  Widget _buildGridView() {
    return EasyRefresh(
      controller: _refreshController,
      onRefresh: () async {
        await _loadProducts(isRefresh: true);
      },
      onLoad: () async {
        await _loadMoreProducts();
      },
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
      footer: ClassicFooter(
        dragText: '上拉加载',
        armedText: '释放加载',
        readyText: '正在加载...',
        processingText: '正在加载...',
        processedText: '加载完成',
        noMoreText: '没有更多数据了',
        failedText: '加载失败',
        messageText: AppDateUtils.getTimeDisplayText(_lastRefreshTime),
      ),
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.7,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: _filteredProducts.length,
        itemBuilder: (context, index) {
          final product = _filteredProducts[index];
          return _buildGridProductCard(product);
        },
      ),
    );
  }

  /// 构建商品卡片
  Widget _buildProductCard(MallProductSpuResponse product) {
    String previewUrl = _systemFileService.getPreviewUrl(product.fileId);
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
                          // fit: BoxFit.cover,
                          // decoration: BoxDecoration(
                          //   color: Colors.grey[200],
                          //   borderRadius: BorderRadius.circular(6),
                          // ),
                          child: Image.network(previewUrl),
                          // child: Center(
                          //   child: Icon(
                          //     widget.category.name == 'iPhone'
                          //         ? Icons.phone_iphone
                          //         : Icons.shopping_bag,
                          //     size: 50,
                          //     color: Colors.grey,
                          //   ),
                          // ),
                        ),
                        // 标签
                        // if (product['tags'] != null)
                        //   ...(product['tags'] as List)
                        //       .map(
                        //         (tag) => Positioned(
                        //           top: 4,
                        //           left: 4,
                        //           child: Container(
                        //             padding: const EdgeInsets.symmetric(
                        //               horizontal: 4,
                        //               vertical: 2,
                        //             ),
                        //             decoration: BoxDecoration(
                        //               color: tag == 'HOT'
                        //                   ? Colors.red
                        //                   : Colors.orange,
                        //               borderRadius: BorderRadius.circular(3),
                        //             ),
                        //             child: Text(
                        //               tag as String,
                        //               style: const TextStyle(
                        //                 color: Colors.white,
                        //                 fontSize: 8,
                        //                 fontWeight: FontWeight.bold,
                        //               ),
                        //             ),
                        //           ),
                        //         ),
                        //       )
                        //       .toList(),
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
                            product.name,
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
                          // if (product['specs'] != null)
                          //   Wrap(
                          //     spacing: 2,
                          //     runSpacing: 2,
                          //     children: (product['specs'] as List)
                          //         .take(4)
                          //         .map(
                          //           (spec) => Container(
                          //             padding: const EdgeInsets.symmetric(
                          //               horizontal: 4,
                          //               vertical: 1,
                          //             ),
                          //             decoration: BoxDecoration(
                          //               color: Colors.grey[100],
                          //               borderRadius: BorderRadius.circular(2),
                          //             ),
                          //             child: Text(
                          //               spec as String,
                          //               style: TextStyle(
                          //                 fontSize: 8,
                          //                 color: Colors.grey[600],
                          //               ),
                          //             ),
                          //           ),
                          //         )
                          //         .toList(),
                          //   ),
                          // const SizedBox(height: 6),

                          // 价格信息
                          Row(
                            children: [
                              Text(
                                '¥${product.price}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                              if (product.marketPrice != null) ...[
                                const SizedBox(width: 6),
                                Text(
                                  '¥${product.marketPrice}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[500],
                                    decoration: TextDecoration.lineThrough,
                                  ),
                                ),
                              ],
                              const Spacer(),
                              // 广告标签
                              // if (product['isAd'] == true)
                              //   Container(
                              //     padding: const EdgeInsets.symmetric(
                              //       horizontal: 4,
                              //       vertical: 1,
                              //     ),
                              //     decoration: BoxDecoration(
                              //       color: Colors.grey[300],
                              //       borderRadius: BorderRadius.circular(2),
                              //     ),
                              //     child: const Text(
                              //       '广告',
                              //       style: TextStyle(
                              //         fontSize: 8,
                              //         color: Colors.grey,
                              //       ),
                              //     ),
                              //   ),
                            ],
                          ),
                          const SizedBox(height: 4),

                          // 销量和好评
                          Text(
                            '${product.salesCount}', // ${product['rating']}
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 4),

                          // 店铺信息
                          // Text(
                          //   '${product['storeCustomers']} ${product['store']}',
                          //   style: TextStyle(
                          //     fontSize: 11,
                          //     color: Colors.grey[600],
                          //   ),
                          // ),
                          // const SizedBox(height: 6),

                          // 优惠信息
                          // if (product['offers'] != null)
                          //   Wrap(
                          //     spacing: 2,
                          //     runSpacing: 2,
                          //     children: (product['offers'] as List)
                          //         .map(
                          //           (offer) => Container(
                          //             padding: const EdgeInsets.symmetric(
                          //               horizontal: 4,
                          //               vertical: 1,
                          //             ),
                          //             decoration: BoxDecoration(
                          //               color: Colors.blue.withValues(
                          //                 alpha: 0.1,
                          //               ),
                          //               borderRadius: BorderRadius.circular(2),
                          //             ),
                          //             child: Text(
                          //               offer as String,
                          //               style: const TextStyle(
                          //                 fontSize: 8,
                          //                 color: Colors.blue,
                          //               ),
                          //             ),
                          //           ),
                          //         )
                          //         .toList(),
                          //   ),
                          // const SizedBox(height: 6),

                          // 底部信息
                          Row(
                            children: [
                              // if (product['subsidy'] != null &&
                              //     (product['subsidy'] as String).isNotEmpty)
                              //   Container(
                              //     padding: const EdgeInsets.symmetric(
                              //       horizontal: 4,
                              //       vertical: 1,
                              //     ),
                              //     decoration: BoxDecoration(
                              //       color: Colors.green.withValues(alpha: 0.1),
                              //       borderRadius: BorderRadius.circular(2),
                              //     ),
                              //     child: Text(
                              //       product['subsidy'] as String,
                              //       style: const TextStyle(
                              //         fontSize: 8,
                              //         color: Colors.green,
                              //         fontWeight: FontWeight.w500,
                              //       ),
                              //     ),
                              //   ),
                              // if (product['subsidy'] != null &&
                              //     (product['subsidy'] as String).isNotEmpty)
                              //   const SizedBox(width: 4),
                              // if (product['installment'] != null &&
                              //     (product['installment'] as String).isNotEmpty)
                              //   Container(
                              //     padding: const EdgeInsets.symmetric(
                              //       horizontal: 4,
                              //       vertical: 1,
                              //     ),
                              //     decoration: BoxDecoration(
                              //       color: Colors.orange.withValues(alpha: 0.1),
                              //       borderRadius: BorderRadius.circular(2),
                              //     ),
                              //     child: Text(
                              //       product['installment'] as String,
                              //       style: const TextStyle(
                              //         fontSize: 8,
                              //         color: Colors.orange,
                              //         fontWeight: FontWeight.w500,
                              //       ),
                              //     ),
                              //   ),
                              const Spacer(),

                              // 进店按钮
                              GestureDetector(
                                behavior: HitTestBehavior.opaque,
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) => Store(storeId: product.tenantId),
                                    ),
                                  );
                                },
                                child: Container(
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

  /// 构建网格模式商品卡片
  Widget _buildGridProductCard(MallProductSpuResponse product) {
    String previewUrl = _systemFileService.getPreviewUrl(product.fileId);
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withValues(alpha: 0.1),
            spreadRadius: 1,
            blurRadius: 4,
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
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 商品图片
                Expanded(
                  flex: 3,
                  child: Stack(
                    children: [
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Center(
                          // child: Icon(
                          //   widget.category.name == 'iPhone'
                          //       ? Icons.phone_iphone
                          //       : Icons.shopping_bag,
                          //   size: 40,
                          //   color: Colors.grey,
                          // ),
                          child: Image.network(previewUrl),
                        ),
                      ),
                      // 标签
                      // if (product['tags'] != null)
                      //   ...(product['tags'] as List)
                      //       .map(
                      //         (tag) => Positioned(
                      //           top: 4,
                      //           left: 4,
                      //           child: Container(
                      //             padding: const EdgeInsets.symmetric(
                      //               horizontal: 4,
                      //               vertical: 2,
                      //             ),
                      //             decoration: BoxDecoration(
                      //               color: tag == 'HOT'
                      //                   ? Colors.red
                      //                   : Colors.orange,
                      //               borderRadius: BorderRadius.circular(3),
                      //             ),
                      //             child: Text(
                      //               tag as String,
                      //               style: const TextStyle(
                      //                 color: Colors.white,
                      //                 fontSize: 8,
                      //                 fontWeight: FontWeight.bold,
                      //               ),
                      //             ),
                      //           ),
                      //         ),
                      //       )
                      //       .toList(),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                // 商品名称
                Expanded(
                  flex: 2,
                  child: Text(
                    product.name,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(height: 4),
                // 价格信息
                Row(
                  children: [
                    Text(
                      '¥${product.price}',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    if (product.marketPrice != null) ...[
                      const SizedBox(width: 4),
                      Text(
                        '¥${product.marketPrice}',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.grey[500],
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                // 销量信息
                Text(
                  product.salesCount.toString(),
                  style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                ),
                const SizedBox(height: 4),
                // 进店按钮
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => Store(storeId: product.tenantId),
                      ),
                    );
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(3),
                    ),
                    child: const Text(
                      '进店>',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
