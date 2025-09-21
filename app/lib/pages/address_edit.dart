import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/address_model.dart';

class AddressEdit extends StatefulWidget {
  final AddressModel? address;
  final Function(AddressModel) onSave;

  const AddressEdit({
    super.key,
    this.address,
    required this.onSave,
  });

  @override
  State<AddressEdit> createState() => _AddressEditState();
}

class _AddressEditState extends State<AddressEdit> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  
  String _selectedProvince = '';
  String _selectedCity = '';
  String _selectedDistrict = '';
  bool _isDefault = false;
  bool _isEditing = false;

  // 模拟省市区数据
  final Map<String, List<String>> _regionData = {
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
    '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  };

  final Map<String, List<String>> _districtData = {
    '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
    '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
    '广州市': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
    '深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
  };

  @override
  void initState() {
    super.initState();
    _isEditing = widget.address != null;
    if (_isEditing) {
      _nameController.text = widget.address!.name;
      _phoneController.text = widget.address!.phone;
      _selectedProvince = widget.address!.province;
      _selectedCity = widget.address!.city;
      _selectedDistrict = widget.address!.district;
      _addressController.text = widget.address!.address;
      _isDefault = widget.address!.isDefault;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? '编辑地址' : '添加地址'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: _saveAddress,
            child: const Text(
              '保存',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 收货人信息
            _buildSectionTitle('收货人信息'),
            _buildTextField(
              controller: _nameController,
              label: '收货人',
              hint: '请输入收货人姓名',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return '请输入收货人姓名';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            _buildTextField(
              controller: _phoneController,
              label: '手机号',
              hint: '请输入手机号',
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(11),
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return '请输入手机号';
                }
                if (value.length != 11) {
                  return '请输入正确的手机号';
                }
                final phoneRegex = RegExp(r'^1[3-9]\d{9}$');
                if (!phoneRegex.hasMatch(value)) {
                  return '请输入正确的手机号';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 24),
            
            // 收货地址
            _buildSectionTitle('收货地址'),
            _buildRegionSelector(),
            const SizedBox(height: 16),
            _buildTextField(
              controller: _addressController,
              label: '详细地址',
              hint: '请输入街道、门牌号等详细信息',
              maxLines: 3,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return '请输入详细地址';
                }
                return null;
              },
            ),
            
            const SizedBox(height: 24),
            
            // 设为默认地址
            _buildDefaultAddressSwitch(),
            
            const SizedBox(height: 32),
            
            // 保存按钮
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _saveAddress,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  _isEditing ? '保存修改' : '保存地址',
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      maxLines: maxLines,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.purple),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );
  }

  Widget _buildRegionSelector() {
    return Column(
      children: [
        // 省份选择
        _buildDropdownField(
          label: '省份',
          value: _selectedProvince,
          items: _regionData.keys.toList(),
          onChanged: (value) {
            setState(() {
              _selectedProvince = value ?? '';
              _selectedCity = '';
              _selectedDistrict = '';
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请选择省份';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        
        // 城市选择
        _buildDropdownField(
          label: '城市',
          value: _selectedCity,
          items: _selectedProvince.isNotEmpty 
              ? (_regionData[_selectedProvince] ?? [])
              : [],
          onChanged: _selectedProvince.isNotEmpty ? (String? value) {
            setState(() {
              _selectedCity = value ?? '';
              _selectedDistrict = '';
            });
          } : null,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请选择城市';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        
        // 区县选择
        _buildDropdownField(
          label: '区县',
          value: _selectedDistrict,
          items: _selectedCity.isNotEmpty 
              ? (_districtData[_selectedCity] ?? [])
              : [],
          onChanged: _selectedCity.isNotEmpty ? (String? value) {
            setState(() {
              _selectedDistrict = value ?? '';
            });
          } : null,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return '请选择区县';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String value,
    required List<String> items,
    ValueChanged<String?>? onChanged,
    String? Function(String?)? validator,
  }) {
    return DropdownButtonFormField<String>(
      value: value.isEmpty ? null : value,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.purple),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      items: items.map((String item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildDefaultAddressSwitch() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: Row(
        children: [
          const SizedBox(width: 16),
          const Icon(
            Icons.star,
            color: Colors.orange,
            size: 20,
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              '设为默认地址',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Switch(
            value: _isDefault,
            onChanged: (value) {
              setState(() {
                _isDefault = value;
              });
            },
            activeColor: Colors.purple,
          ),
          const SizedBox(width: 16),
        ],
      ),
    );
  }

  void _saveAddress() {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final address = AddressModel(
      id: _isEditing ? widget.address!.id : DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      province: _selectedProvince,
      city: _selectedCity,
      district: _selectedDistrict,
      address: _addressController.text.trim(),
      isDefault: _isDefault,
      createTime: _isEditing ? widget.address!.createTime : DateTime.now(),
      updateTime: DateTime.now(),
    );

    widget.onSave(address);
    
    Navigator.of(context).pop();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_isEditing ? '地址修改成功' : '地址添加成功'),
      ),
    );
  }
}
