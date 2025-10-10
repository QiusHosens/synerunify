import 'package:flutter/material.dart';
import '../../models/address_model.dart';
import 'address_edit.dart';

class AddressList extends StatefulWidget {
  const AddressList({super.key});

  @override
  State<AddressList> createState() => _AddressListState();
}

class _AddressListState extends State<AddressList> {
  // 模拟地址数据
  List<AddressModel> _addresses = [
    AddressModel(
      id: '1',
      name: '张哥',
      phone: '18224017456',
      province: '四川省',
      city: '成都市',
      district: '武侯区',
      address: '碧桂园·沁云里1栋504',
      isDefault: true,
      tag: '家',
      createTime: DateTime.now().subtract(const Duration(days: 30)),
      updateTime: DateTime.now().subtract(const Duration(days: 30)),
    ),
    AddressModel(
      id: '2',
      name: '李四',
      phone: '13900139000',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      address: '陆家嘴环路1000号',
      isDefault: false,
      tag: '公司',
      createTime: DateTime.now().subtract(const Duration(days: 15)),
      updateTime: DateTime.now().subtract(const Duration(days: 15)),
    ),
    AddressModel(
      id: '3',
      name: '王五',
      phone: '13700137000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      address: '科技园南区深南大道10000号',
      isDefault: false,
      tag: '父母家',
      createTime: DateTime.now().subtract(const Duration(days: 7)),
      updateTime: DateTime.now().subtract(const Duration(days: 7)),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('我的地址'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => AddressEdit(
                    onSave: (address) {
                      setState(() {
                        _addresses.add(address);
                      });
                    },
                  ),
                ),
              );
            },
            child: const Text('新增收货地址', style: TextStyle(color: Colors.blue)),
          ),
        ],
      ),
      body: _addresses.isEmpty ? _buildEmptyState() : _buildAddressList(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => AddressEdit(
                onSave: (address) {
                  setState(() {
                    _addresses.add(address);
                  });
                },
              ),
            ),
          );
        },
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.location_off, size: 100, color: Colors.grey[400]),
          const SizedBox(height: 20),
          Text(
            '暂无收货地址',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          const SizedBox(height: 10),
          Text(
            '添加收货地址，让购物更便捷',
            style: TextStyle(fontSize: 14, color: Colors.grey[500]),
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => AddressEdit(
                    onSave: (address) {
                      setState(() {
                        _addresses.add(address);
                      });
                    },
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
            ),
            child: const Text('添加地址'),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressList() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _addresses.length,
      itemBuilder: (context, index) {
        final address = _addresses[index];
        return _buildAddressCard(address, index);
      },
    );
  }

  Widget _buildAddressCard(AddressModel address, int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => AddressEdit(
                address: address,
                onSave: (updatedAddress) {
                  setState(() {
                    _addresses[index] = updatedAddress;
                  });
                },
              ),
            ),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 地址头部信息
              Row(
                children: [
                  // 地址标签
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      address.tag,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // 默认标签
                  if (address.isDefault)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        '默认',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  if (address.isDefault) const SizedBox(width: 8),

                  // 收货人信息
                  Expanded(
                    child: Row(
                      children: [
                        Text(
                          address.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          address.phone,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 编辑按钮
                  IconButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => AddressEdit(
                            address: address,
                            onSave: (updatedAddress) {
                              setState(() {
                                _addresses[index] = updatedAddress;
                              });
                            },
                          ),
                        ),
                      );
                    },
                    icon: const Icon(Icons.edit, size: 20),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),

              const SizedBox(height: 8),

              // 地址信息
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      address.fullAddress,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[700],
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // 操作按钮
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // 设为默认按钮
                  if (!address.isDefault)
                    TextButton(
                      onPressed: () => _setAsDefault(index),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text('设为默认', style: TextStyle(fontSize: 12)),
                    ),

                  if (!address.isDefault) const SizedBox(width: 8),

                  // 删除按钮
                  TextButton(
                    onPressed: () => _deleteAddress(index),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: const Text('删除', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 设为默认地址
  void _setAsDefault(int index) {
    setState(() {
      // 先将所有地址设为非默认
      for (int i = 0; i < _addresses.length; i++) {
        _addresses[i].isDefault = false;
      }
      // 设置当前地址为默认
      _addresses[index].isDefault = true;
      _addresses[index].updateTime = DateTime.now();
    });

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('已设为默认地址')));
  }

  // 删除地址
  void _deleteAddress(int index) {
    final address = _addresses[index];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('删除地址'),
        content: Text('确定要删除"${address.name}"的收货地址吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _addresses.removeAt(index);
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('地址已删除')));
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }
}
