import 'package:flutter/material.dart';

class AddressMap extends StatefulWidget {
  final Function(String address, String province, String city, String district)? onAddressSelected;

  const AddressMap({
    super.key,
    this.onAddressSelected,
  });

  @override
  State<AddressMap> createState() => _AddressMapState();
}

class _AddressMapState extends State<AddressMap> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedAddress = '';
  String _selectedProvince = '';
  String _selectedCity = '';
  String _selectedDistrict = '';

  // 模拟搜索结果
  final List<Map<String, String>> _searchResults = [
    {
      'name': '港汇国际中心',
      'address': '成都市武侯区益州大道南段与天府五街交叉口东南120米',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
    {
      'name': '成都高新国际创业服务大厦',
      'address': '成都市武侯区益州大道南段与天府五街交叉口西南100米',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
    {
      'name': '港汇天地',
      'address': '成都市武侯区天府五街999号',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
    {
      'name': '移动互联创业大厦',
      'address': '成都市武侯区益州大道中段1800号',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
    {
      'name': '天府软件园G1幢',
      'address': '成都市武侯区益州大道中段1800号',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
    {
      'name': '天府软件园G区南区',
      'address': '成都市武侯区天府五街与益州大道南段交叉口西南160米',
      'province': '四川省',
      'city': '成都市',
      'district': '武侯区',
    },
  ];

  @override
  void initState() {
    super.initState();
    // 设置默认选中地址
    _selectedAddress = _searchResults[0]['address']!;
    _selectedProvince = _searchResults[0]['province']!;
    _selectedCity = _searchResults[0]['city']!;
    _selectedDistrict = _searchResults[0]['district']!;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('选择地址'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {
              if (widget.onAddressSelected != null) {
                widget.onAddressSelected!(
                  _selectedAddress,
                  _selectedProvince,
                  _selectedCity,
                  _selectedDistrict,
                );
              }
              Navigator.of(context).pop();
            },
            child: const Text(
              '确定',
              style: TextStyle(color: Colors.blue),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // 搜索框
          Container(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: '搜索小区、办公楼、学校等',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Colors.blue),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (value) {
                setState(() {
                  // 这里可以实现搜索逻辑
                });
              },
            ),
          ),
          
          // 地图区域（模拟）
          Expanded(
            flex: 2,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: Stack(
                children: [
                  // 模拟地图背景
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Colors.grey[300]!, Colors.grey[400]!],
                      ),
                    ),
                  ),
                  
                  // 模拟地图标记点
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 40,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(15),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            '港汇国际中心',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // 地图提供商标识
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: Text(
                      '高德地图',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // 地址列表
          Expanded(
            flex: 3,
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 当前选中地址
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(8),
                        topRight: Radius.circular(8),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          color: Colors.blue,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '[当前位置]港汇国际中心',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue[800],
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                _selectedAddress,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.check_circle,
                          color: Colors.blue,
                          size: 20,
                        ),
                      ],
                    ),
                  ),
                  
                  // 其他地址列表
                  Expanded(
                    child: ListView.builder(
                      itemCount: _searchResults.length - 1,
                      itemBuilder: (context, index) {
                        final result = _searchResults[index + 1];
                        return ListTile(
                          leading: Icon(
                            Icons.location_on_outlined,
                            color: Colors.grey[600],
                            size: 20,
                          ),
                          title: Text(
                            result['name']!,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          subtitle: Text(
                            result['address']!,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          onTap: () {
                            setState(() {
                              _selectedAddress = result['address']!;
                              _selectedProvince = result['province']!;
                              _selectedCity = result['city']!;
                              _selectedDistrict = result['district']!;
                            });
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
