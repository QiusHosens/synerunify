import 'package:flutter/material.dart';
import '../../models/address_model.dart';

class Checkout extends StatefulWidget {
  final List<Map<String, dynamic>> cartItems;
  final double totalAmount;

  const Checkout({
    super.key,
    required this.cartItems,
    required this.totalAmount,
  });

  @override
  State<Checkout> createState() => _CheckoutState();
}

class _CheckoutState extends State<Checkout> {
  AddressModel? _selectedAddress;
  String _selectedDeliveryTime = '立即送出';
  String _selectedPaymentMethod = '微信支付';
  String _notes = '';
  bool _outOfStockContact = true;
  bool _tablewareProvided = true;

  // 模拟地址数据
  final List<AddressModel> _addresses = [
    AddressModel(
      id: '1',
      name: '张三',
      phone: '138****8888',
      province: '四川省',
      city: '成都市',
      district: '高新区',
      address: '天府大道中段1号天府软件园',
      isDefault: true,
      createTime: DateTime.now(),
      updateTime: DateTime.now(),
    ),
  ];

  @override
  void initState() {
    super.initState();
    // 设置默认地址
    _selectedAddress = _addresses.firstWhere((addr) => addr.isDefault);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('确认订单'),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        titleTextStyle: const TextStyle(
          color: Colors.black,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // 地址选择区域
                  _buildAddressSection(),
                  const SizedBox(height: 12),

                  // 商品信息区域
                  _buildProductSection(),
                  const SizedBox(height: 12),

                  // 配送信息区域
                  _buildDeliverySection(),
                  const SizedBox(height: 12),

                  // 订单选项区域
                  _buildOrderOptionsSection(),
                  const SizedBox(height: 12),

                  // 价格明细区域
                  _buildPriceSection(),
                  const SizedBox(height: 12),

                  // 支付方式区域
                  _buildPaymentSection(),
                ],
              ),
            ),
          ),

          // 底部结算栏
          _buildBottomBar(),
        ],
      ),
    );
  }

  Widget _buildAddressSection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  '地址',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _selectedAddress?.address ?? '请选择收货地址',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    if (_selectedAddress != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '${_selectedAddress!.name} ${_selectedAddress!.phone}',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: () {
                              // 跳转到地址编辑页面
                              _showAddressEditDialog();
                            },
                            child: const Text(
                              '去完善收货人信息 >',
                              style: TextStyle(color: Colors.red, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: _selectAddress,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Text(
                    '选择其他收货地址',
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                  const Spacer(),
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: Colors.grey[400],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductSection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  '外卖',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                '瑞幸咖啡(天府海创园中心店)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...widget.cartItems.map((item) => _buildProductItem(item)),
        ],
      ),
    );
  }

  Widget _buildProductItem(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          // 商品图片
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey[200],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: item['image'] != null
                  ? Image.asset(item['image'], fit: BoxFit.cover)
                  : Icon(Icons.fastfood, color: Colors.grey[400], size: 40),
            ),
          ),
          const SizedBox(width: 12),
          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['name'] ?? '商品名称',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '大杯 IIAC金奖豆,冰,不另外加糖,无气泡',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '¥${item['price']?.toStringAsFixed(1) ?? '0.0'}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.red,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      '补贴价',
                      style: TextStyle(fontSize: 12, color: Colors.red),
                    ),
                    const Spacer(),
                    Text(
                      'x${item['quantity'] ?? 1}',
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliverySection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              const Text(
                '配送',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const Spacer(),
              GestureDetector(
                onTap: _selectDeliveryTime,
                child: Row(
                  children: [
                    const Text(
                      '立即送出 >',
                      style: TextStyle(fontSize: 14, color: Colors.blue),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                '09:55-10:10送达',
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderOptionsSection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildOptionRow(
            '如遇缺货',
            '缺货时与我电话沟通 >',
            _outOfStockContact,
            (value) => setState(() => _outOfStockContact = value),
          ),
          const Divider(height: 24),
          _buildOptionRow(
            '餐具数量',
            '商家按餐量提供 >',
            _tablewareProvided,
            (value) => setState(() => _tablewareProvided = value),
          ),
          const Divider(height: 24),
          GestureDetector(
            onTap: _addNotes,
            child: Row(
              children: [
                const Text(
                  '备注(一次备注,多次使用)',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
                const Spacer(),
                Text(
                  _notes.isEmpty ? '请输入口味偏好等要求 >' : _notes,
                  style: TextStyle(
                    fontSize: 14,
                    color: _notes.isEmpty ? Colors.grey[500] : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOptionRow(
    String title,
    String subtitle,
    bool value,
    Function(bool) onChanged,
  ) {
    return Row(
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        const Spacer(),
        Text(subtitle, style: TextStyle(fontSize: 14, color: Colors.grey[600])),
      ],
    );
  }

  Widget _buildPriceSection() {
    double shippingFee = 6.0;
    double shippingDiscount = 5.5;
    double packagingFee = 1.0;
    double total =
        widget.totalAmount + shippingFee - shippingDiscount + packagingFee;

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildPriceRow('商品金额', '¥${widget.totalAmount.toStringAsFixed(2)}'),
          _buildPriceRow('运费', '¥${shippingFee.toStringAsFixed(2)}'),
          _buildPriceRow(
            '运费优惠①',
            '-¥${shippingDiscount.toStringAsFixed(2)}',
            isDiscount: true,
          ),
          _buildPriceRow('打包费①', '¥${packagingFee.toStringAsFixed(2)}'),
          const SizedBox(height: 8),
          GestureDetector(
            onTap: _selectCoupon,
            child: Row(
              children: [
                const Text(
                  '优惠券',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
                const Spacer(),
                const Text(
                  '无可用 >',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            color: Colors.grey[100],
            child: Column(
              children: [
                Row(
                  children: [
                    const Text(
                      '已隐藏本单不可使用的虚拟资产',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: _showMorePaymentMethods,
                      child: const Text(
                        '更多支付方式',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ),
                    Icon(
                      Icons.keyboard_arrow_down,
                      size: 16,
                      color: Colors.grey[400],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      '合计:¥${total.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.red,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isDiscount = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: isDiscount ? Colors.red : Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentSection() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '支付方式',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 12),
          _buildPaymentMethod(
            '微信支付',
            'assets/images/wechat_pay.png',
            _selectedPaymentMethod == '微信支付',
          ),
          const SizedBox(height: 8),
          _buildPaymentMethod(
            '支付宝',
            'assets/images/alipay.png',
            _selectedPaymentMethod == '支付宝',
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethod(String name, String iconPath, bool isSelected) {
    return GestureDetector(
      onTap: () => setState(() => _selectedPaymentMethod = name),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? Colors.blue : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(4),
              ),
              child: Icon(
                name == '微信支付' ? Icons.wechat : Icons.account_balance_wallet,
                size: 16,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(width: 12),
            Text(
              name,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const Spacer(),
            if (isSelected)
              const Icon(Icons.check_circle, color: Colors.blue, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    double total = widget.totalAmount + 6.0 - 5.5 + 1.0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '¥${total.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: Colors.red,
                  ),
                ),
                Text(
                  '实付金额以完善地址后为准',
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ],
            ),
            const Spacer(),
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: _submitOrder,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  '打白条',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _selectAddress() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '选择收货地址',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            ..._addresses.map(
              (address) => ListTile(
                title: Text(address.address),
                subtitle: Text('${address.name} ${address.phone}'),
                trailing: _selectedAddress?.id == address.id
                    ? const Icon(Icons.check, color: Colors.blue)
                    : null,
                onTap: () {
                  setState(() => _selectedAddress = address);
                  Navigator.pop(context);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _selectDeliveryTime() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '选择送达时间',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            _buildDeliveryTimeOption('立即送出', '09:55-10:10送达'),
            _buildDeliveryTimeOption('预约送达', '选择具体时间'),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliveryTimeOption(String title, String subtitle) {
    return ListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: _selectedDeliveryTime == title
          ? const Icon(Icons.check, color: Colors.blue)
          : null,
      onTap: () {
        setState(() => _selectedDeliveryTime = title);
        Navigator.pop(context);
      },
    );
  }

  void _addNotes() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('添加备注'),
        content: TextField(
          controller: TextEditingController(text: _notes),
          decoration: const InputDecoration(
            hintText: '请输入口味偏好等要求',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
          onChanged: (value) => _notes = value,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {});
              Navigator.pop(context);
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _selectCoupon() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('暂无可用优惠券')));
  }

  void _showMorePaymentMethods() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('更多支付方式')));
  }

  void _showAddressEditDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('完善收货人信息'),
        content: const Text('此功能需要跳转到地址编辑页面'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _submitOrder() {
    if (_selectedAddress == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('请选择收货地址')));
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认提交订单'),
        content: Text(
          '订单总金额: ¥${(widget.totalAmount + 6.0 - 5.5 + 1.0).toStringAsFixed(2)}',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('订单提交成功')));
              Navigator.pop(context); // 返回购物车
            },
            child: const Text('确认'),
          ),
        ],
      ),
    );
  }
}
