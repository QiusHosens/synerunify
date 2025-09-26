import 'package:flutter/material.dart';
import 'home.dart';
import 'cart.dart';
import 'mine.dart';

class Category extends StatefulWidget {
  const Category({super.key});

  @override
  State<Category> createState() => _CategoryState();
}

class _CategoryState extends State<Category> {
  int _currentIndex = 1; // 分类页面索引
  int _selectedCategoryIndex = 0; // 选中的分类索引

  // 主分类数据
  final List<Map<String, dynamic>> _mainCategories = [
    {'name': '为你推荐', 'isSelected': true},
    {'name': '休闲零食', 'isSelected': false},
    {'name': '水饮冲调', 'isSelected': false},
    {'name': '中外名酒', 'isSelected': false},
    {'name': '粮油调味', 'isSelected': false},
    {'name': '美妆个护', 'isSelected': false},
    {'name': '保健数码', 'isSelected': false},
    {'name': '纸品家清', 'isSelected': false},
    {'name': '母婴萌宠', 'isSelected': false},
    {'name': '家纺百货', 'isSelected': false},
    {'name': '餐饮面点', 'isSelected': false},
    {'name': '乳品烘焙', 'isSelected': false},
    {'name': '水果鲜花', 'isSelected': false},
  ];

  // 精选推荐商品数据
  final List<Map<String, dynamic>> _featuredProducts = [
    {'name': '月饼', 'image': 'assets/images/mooncake.png'},
    {'name': '中秋礼盒', 'image': 'assets/images/gift_box.png'},
    {'name': '中秋家宴', 'image': 'assets/images/feast.png'},
    {'name': '热食', 'image': 'assets/images/hot_food.png'},
    {'name': '绿叶菜', 'image': 'assets/images/vegetables.png'},
    {'name': '现烤面包', 'image': 'assets/images/bread.png'},
    {'name': '快手菜', 'image': 'assets/images/quick_dish.png'},
    {'name': '包子', 'image': 'assets/images/baozi.png'},
    {'name': '当季鲜果', 'image': 'assets/images/fruits.png'},
    {'name': '速食', 'image': 'assets/images/instant_food.png'},
    {'name': '鲜奶', 'image': 'assets/images/milk.png'},
    {'name': '青菜', 'image': 'assets/images/greens.png'},
    {'name': '薯片', 'image': 'assets/images/chips.png'},
    {'name': '水', 'image': 'assets/images/water.png'},
    {'name': '牛肉', 'image': 'assets/images/beef.png'},
    {'name': '毛豆', 'image': 'assets/images/edamame.png'},
    {'name': '啤酒', 'image': 'assets/images/beer.png'},
    {'name': '切片面包', 'image': 'assets/images/sliced_bread.png'},
  ];

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
              child: Row(
                children: [
                  // 左侧主分类列表
                  _buildCategoryList(),
                  // 右侧精选推荐
                  _buildFeaturedSection(),
                ],
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
        // 状态栏
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              // 时间显示
              const Text(
                '14:01',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(width: 8),
              const Icon(
                Icons.signal_cellular_4_bar,
                size: 16,
                color: Colors.black,
              ),
              const Spacer(),
              // 店铺位置
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Text(
                  '中和锦汇天府店',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black,
                  ),
                ),
              ),
              const Spacer(),
              // 状态栏图标
              Row(
                children: [
                  const Icon(
                    Icons.signal_cellular_4_bar,
                    size: 16,
                    color: Colors.black,
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.wifi, size: 16, color: Colors.black),
                  const SizedBox(width: 4),
                  const Icon(Icons.battery_full, size: 16, color: Colors.black),
                ],
              ),
            ],
          ),
        ),
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
          final isSelected = index == _selectedCategoryIndex;

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategoryIndex = index;
                // 更新所有分类的选中状态
                for (int i = 0; i < _mainCategories.length; i++) {
                  _mainCategories[i]['isSelected'] = i == index;
                }
              });
            },
            child: Container(
              height: 50,
              color: isSelected ? Colors.blue : Colors.transparent,
              child: Center(
                child: Text(
                  category['name'],
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

  /// 构建右侧精选推荐区域
  Widget _buildFeaturedSection() {
    return Expanded(
      child: Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 标题
            Container(
              padding: const EdgeInsets.all(16),
              child: const Text(
                '精选推荐',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
            ),
            // 商品网格
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  childAspectRatio: 0.8,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: _featuredProducts.length,
                itemBuilder: (context, index) {
                  final product = _featuredProducts[index];
                  return _buildProductItem(product);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 构建商品项
  Widget _buildProductItem(Map<String, dynamic> product) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('点击了${product['name']}')));
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
            child: const Icon(Icons.image, color: Colors.grey, size: 30),
          ),
          const SizedBox(height: 8),
          // 商品名称
          Text(
            product['name'],
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
