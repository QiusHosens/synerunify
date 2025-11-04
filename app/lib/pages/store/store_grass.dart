import 'package:flutter/material.dart';
import 'package:synerunify/services/system_tenant.dart';
import '../product/product_detail.dart';

class StoreGrass extends StatefulWidget {
  final SystemTenantResponse tenantInfo;

  const StoreGrass({super.key, required this.tenantInfo});

  @override
  State<StoreGrass> createState() => _StoreGrassState();
}

class _StoreGrassState extends State<StoreGrass> {
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _grassPosts = [];

  @override
  void initState() {
    super.initState();
    _loadGrassPosts();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  /// 加载种草秀数据
  void _loadGrassPosts() {
    _grassPosts.addAll(_generateGrassPosts());
  }

  /// 生成种草秀数据
  List<Map<String, dynamic>> _generateGrassPosts() {
    return [
      {
        'id': '1',
        'user': 'j***i',
        'avatar': 'https://via.placeholder.com/50x50',
        'date': '2024-04-17',
        'content': '一家人都习惯喝特仑苏了,口感好,价格合适。每个月都会买几箱，孩子们也爱喝。包装很结实，运输过程中没有破损。',
        'images': [
          'https://via.placeholder.com/300x300',
          'https://via.placeholder.com/300x300',
        ],
        'likes': 128,
        'comments': 23,
        'product': {
          'id': '1',
          'name': '特仑苏脱脂纯牛奶 250ml*16瓶/箱',
          'price': 44.99,
          'originalPrice': 49.99,
          'image': 'https://via.placeholder.com/100x100',
          'rating': 4.8,
          'sales': 10000,
        },
      },
      {
        'id': '2',
        'user': 'z***a',
        'avatar': 'https://via.placeholder.com/50x50',
        'date': '2024-04-21',
        'content': '发货非常快!包装完整没有破损!非常适合减脂人群!没有脂肪含量，但是味道依然很香浓。推荐给正在减肥的朋友们。',
        'images': ['https://via.placeholder.com/300x300'],
        'likes': 256,
        'comments': 45,
        'product': {
          'id': '2',
          'name': '特仑苏脱脂纯牛奶 250ml*12瓶/箱',
          'price': 39.99,
          'originalPrice': 44.99,
          'image': 'https://via.placeholder.com/100x100',
          'rating': 4.9,
          'sales': 8500,
        },
      },
      {
        'id': '3',
        'user': '邓***平',
        'avatar': 'https://via.placeholder.com/50x50',
        'date': '2024-01-25',
        'content': '特仑苏的品质一直很稳定，这次买的沙漠有机系列特别棒。有机认证让人放心，口感也比普通牛奶更醇厚。',
        'images': [
          'https://via.placeholder.com/300x300',
          'https://via.placeholder.com/300x300',
          'https://via.placeholder.com/300x300',
        ],
        'likes': 89,
        'comments': 12,
        'product': {
          'id': '3',
          'name': '特仑苏沙漠有机纯牛奶 250ml*16瓶/箱',
          'price': 89.99,
          'originalPrice': 99.99,
          'image': 'https://via.placeholder.com/100x100',
          'rating': 4.7,
          'sales': 3200,
        },
      },
      {
        'id': '4',
        'user': 'm***k',
        'avatar': 'https://via.placeholder.com/50x50',
        'date': '2024-03-15',
        'content': '迪士尼联名款太可爱了！包装设计很精美，送给小朋友当礼物非常合适。牛奶品质一如既往的好。',
        'images': ['https://via.placeholder.com/300x300'],
        'likes': 167,
        'comments': 34,
        'product': {
          'id': '4',
          'name': '特仑苏迪士尼联名款纯牛奶 250ml*12瓶/箱',
          'price': 79.99,
          'originalPrice': 89.99,
          'image': 'https://via.placeholder.com/100x100',
          'rating': 4.8,
          'sales': 5600,
        },
      },
      {
        'id': '5',
        'user': 'l***n',
        'avatar': 'https://via.placeholder.com/50x50',
        'date': '2024-02-28',
        'content': '28天鲜系列真的很新鲜！保质期短但是口感特别好，每天早上喝一杯，一天都有精神。',
        'images': [
          'https://via.placeholder.com/300x300',
          'https://via.placeholder.com/300x300',
        ],
        'likes': 203,
        'comments': 56,
        'product': {
          'id': '5',
          'name': '特仑苏28天鲜纯牛奶 250ml*10瓶/箱',
          'price': 59.99,
          'originalPrice': 69.99,
          'image': 'https://via.placeholder.com/100x100',
          'rating': 4.9,
          'sales': 7800,
        },
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: RefreshIndicator(
        onRefresh: () async {
          _loadGrassPosts();
        },
        child: GridView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.75,
          ),
          itemCount: _grassPosts.length,
          itemBuilder: (context, index) {
            final post = _grassPosts[index];
            return _buildGrassCard(post);
          },
        ),
      ),
    );
  }

  /// 构建种草卡片
  Widget _buildGrassCard(Map<String, dynamic> post) {
    return Container(
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
          // 用户分享图片
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
                  // 聊天图标（模拟互动）
                  if ((_grassPosts.indexOf(post)) % 3 == 1)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.blue[500],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.chat_bubble_outline,
                          color: Colors.white,
                          size: 16,
                        ),
                      ),
                    ),
                  // 商品数量标签
                  if ((_grassPosts.indexOf(post)) % 4 == 0)
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          '+1件商品',
                          style: TextStyle(color: Colors.white, fontSize: 10),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          // 用户信息和内容
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 用户信息
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundColor: Colors.pink[100],
                        child: const Icon(
                          Icons.person,
                          size: 16,
                          color: Colors.pink,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              post['user'] as String,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              post['date'] as String,
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[500],
                              ),
                            ),
                          ],
                        ),
                      ),
                      // 点赞按钮
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            post['likes'] = (post['likes'] as int) + 1;
                          });
                        },
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.thumb_up_outlined,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            const SizedBox(width: 2),
                            Text(
                              '${post['likes']}',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  // 分享内容
                  Text(
                    post['content'] as String,
                    style: const TextStyle(fontSize: 11, height: 1.3),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  // 相关商品信息
                  _buildRelatedProduct(post['product'] as Map<String, dynamic>),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 构建相关商品信息
  Widget _buildRelatedProduct(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        // Navigator.of(context).push(
        //   MaterialPageRoute(
        //     builder: (context) => ProductDetail(product: product),
        //   ),
        // );
      },
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.grey[50],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: Colors.grey[200]!),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Center(
                child: Icon(Icons.image, size: 16, color: Colors.grey),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product['name'] as String,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(
                        '¥${product['price'].toString()}',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '到手价 ¥${product['originalPrice'].toString()}',
                        style: TextStyle(fontSize: 9, color: Colors.grey[500]),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
