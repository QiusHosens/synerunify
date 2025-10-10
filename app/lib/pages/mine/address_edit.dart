import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/address_model.dart';
import 'address_map.dart';

class AddressEdit extends StatefulWidget {
  final AddressModel? address;
  final Function(AddressModel) onSave;

  const AddressEdit({super.key, this.address, required this.onSave});

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
  String _selectedTag = '家'; // 地址标签

  // 地址标签选项
  final List<String> _addressTags = ['家', '公司', '父母家'];

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
        title: Text(_isEditing ? '编辑地址' : '新增收货地址'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _saveAddress,
            child: const Text('保存', style: TextStyle(color: Colors.blue)),
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
            _buildAddressSelector(),
            const SizedBox(height: 16),
            _buildTextField(
              controller: _addressController,
              label: '门牌号',
              hint: '例:8号楼808室',
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return '请输入门牌号';
                }
                return null;
              },
            ),

            const SizedBox(height: 24),

            // 地址标签选择
            _buildAddressTags(),

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
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('保存', style: TextStyle(fontSize: 16)),
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
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.blue),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
      ),
    );
  }

  Widget _buildAddressSelector() {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => AddressMap(
              onAddressSelected: (address, province, city, district) {
                setState(() {
                  _selectedProvince = province;
                  _selectedCity = city;
                  _selectedDistrict = district;
                  _addressController.text = address;
                });
              },
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '收货地址',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _selectedProvince.isNotEmpty
                        ? '$_selectedProvince $_selectedCity $_selectedDistrict'
                        : '小区/写字楼/学校',
                    style: TextStyle(
                      fontSize: 16,
                      color: _selectedProvince.isNotEmpty
                          ? Colors.black87
                          : Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey[400]),
          ],
        ),
      ),
    );
  }

  Widget _buildAddressTags() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '标签',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: _addressTags.map((tag) {
            final isSelected = _selectedTag == tag;
            return Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedTag = tag;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(
                    vertical: 12,
                    horizontal: 16,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected ? Colors.blue : Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isSelected ? Colors.blue : Colors.grey[300]!,
                    ),
                  ),
                  child: Text(
                    tag,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
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
          const Icon(Icons.star, color: Colors.orange, size: 20),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              '设为默认地址',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ),
          Switch(
            value: _isDefault,
            onChanged: (value) {
              setState(() {
                _isDefault = value;
              });
            },
            activeColor: Colors.blue,
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
      id: _isEditing
          ? widget.address!.id
          : DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      province: _selectedProvince,
      city: _selectedCity,
      district: _selectedDistrict,
      address: _addressController.text.trim(),
      isDefault: _isDefault,
      tag: _selectedTag,
      createTime: _isEditing ? widget.address!.createTime : DateTime.now(),
      updateTime: DateTime.now(),
    );

    widget.onSave(address);

    Navigator.of(context).pop();

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(_isEditing ? '地址修改成功' : '地址添加成功')));
  }
}
