import 'package:flutter/material.dart';
import 'home/home.dart';
import 'category/category.dart';
import 'cart/cart.dart';
import 'mine/mine.dart';
import 'instant_delivery/instant_delivery.dart';
import 'takeaway/takeaway.dart';
import 'customer_service/customer_service_chat.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const Home(),
    const InstantDelivery(),
    const Takeaway(),
    const Category(),
    const Cart(),
    const CustomerServiceChat(),
    Mine(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _pages),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '首页'),
          BottomNavigationBarItem(icon: Icon(Icons.flash_on), label: '秒送'),
          BottomNavigationBarItem(
            icon: Icon(Icons.delivery_dining),
            label: '外卖',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.category), label: '分类'),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: '购物车',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.support_agent), label: '客服'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '我的'),
        ],
      ),
    );
  }
}
