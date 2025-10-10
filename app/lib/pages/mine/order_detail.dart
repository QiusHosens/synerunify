import 'package:flutter/material.dart';
import '../../models/order_model.dart';

class OrderDetail extends StatefulWidget {
  final OrderModel order;

  const OrderDetail({super.key, required this.order});

  @override
  State<OrderDetail> createState() => _OrderDetailState();
}

class _OrderDetailState extends State<OrderDetail> {
  late OrderModel _order;

  @override
  void initState() {
    super.initState();
    _order = widget.order;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('订单详情'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 订单状态卡片
            _buildOrderStatusCard(),

            // 收货地址卡片
            if (_order.shippingAddress != null) _buildShippingAddressCard(),

            // 商品列表卡片
            _buildOrderItemsCard(),

            // 订单信息卡片
            _buildOrderInfoCard(),

            // 底部操作按钮
            _buildBottomActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderStatusCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
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
        children: [
          // 状态图标
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Color(_order.statusColor).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              _getStatusIcon(_order.status),
              size: 30,
              color: Color(_order.statusColor),
            ),
          ),
          const SizedBox(height: 16),

          // 状态文本
          Text(
            _order.statusText,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(_order.statusColor),
            ),
          ),
          const SizedBox(height: 8),

          // 状态描述
          Text(
            _getStatusDescription(_order.status),
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildShippingAddressCard() {
    final address = _order.shippingAddress!;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
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
          Row(
            children: [
              Icon(Icons.location_on, color: Colors.red[600], size: 20),
              const SizedBox(width: 8),
              const Text(
                '收货地址',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '${address.name} ${address.phone}',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 4),
          Text(
            address.fullAddress,
            style: TextStyle(fontSize: 14, color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItemsCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
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
          Row(
            children: [
              Icon(Icons.shopping_bag, color: Colors.blue[600], size: 20),
              const SizedBox(width: 8),
              const Text(
                '商品清单',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ..._order.items.map((item) => _buildOrderItem(item)),
        ],
      ),
    );
  }

  Widget _buildOrderItem(OrderItemModel item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          // 商品图片
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.image, size: 40, color: Colors.grey),
          ),
          const SizedBox(width: 12),

          // 商品信息
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.productName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (item.specification != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    item.specification!,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '¥${item.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    Text(
                      'x${item.quantity}',
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

  Widget _buildOrderInfoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
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
          Row(
            children: [
              Icon(Icons.info_outline, color: Colors.green[600], size: 20),
              const SizedBox(width: 8),
              const Text(
                '订单信息',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('订单号', _order.orderNumber),
          _buildInfoRow('下单时间', _formatDateTime(_order.createTime)),
          if (_order.payTime != null)
            _buildInfoRow('付款时间', _formatDateTime(_order.payTime!)),
          if (_order.deliveryTime != null)
            _buildInfoRow('发货时间', _formatDateTime(_order.deliveryTime!)),
          if (_order.receiveTime != null)
            _buildInfoRow('收货时间', _formatDateTime(_order.receiveTime!)),
          if (_order.remark != null && _order.remark!.isNotEmpty)
            _buildInfoRow('备注', _order.remark!),
          const Divider(),
          _buildInfoRow('商品总价', '¥${_order.totalAmount.toStringAsFixed(2)}'),
          _buildInfoRow('运费', '¥0.00'),
          _buildInfoRow(
            '实付金额',
            '¥${_order.totalAmount.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 16 : 14,
              color: isTotal ? Colors.black : Colors.grey[600],
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: isTotal ? 18 : 14,
              color: isTotal ? Colors.red : Colors.black,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActions() {
    return Container(
      margin: const EdgeInsets.all(16),
      child: Row(children: _buildActionButtons()),
    );
  }

  List<Widget> _buildActionButtons() {
    List<Widget> buttons = [];

    switch (_order.status) {
      case 'pending':
        buttons.addAll([
          Expanded(
            child: OutlinedButton(
              onPressed: () => _cancelOrder(),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.grey,
                side: const BorderSide(color: Colors.grey),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('取消订单'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: () => _payOrder(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('立即付款'),
            ),
          ),
        ]);
        break;
      case 'paid':
        buttons.add(
          Expanded(
            child: OutlinedButton(
              onPressed: () => _refundOrder(),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.grey,
                side: const BorderSide(color: Colors.grey),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('申请退款'),
            ),
          ),
        );
        break;
      case 'shipped':
        buttons.addAll([
          Expanded(
            child: OutlinedButton(
              onPressed: () => _viewLogistics(),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.blue,
                side: const BorderSide(color: Colors.blue),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('查看物流'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: () => _confirmReceive(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('确认收货'),
            ),
          ),
        ]);
        break;
      case 'delivered':
        buttons.addAll([
          Expanded(
            child: OutlinedButton(
              onPressed: () => _refundOrder(),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.grey,
                side: const BorderSide(color: Colors.grey),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('申请退款'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: () => _rateOrder(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('评价'),
            ),
          ),
        ]);
        break;
      case 'completed':
        buttons.addAll([
          Expanded(
            child: OutlinedButton(
              onPressed: () => _buyAgain(),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.purple,
                side: const BorderSide(color: Colors.purple),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('再次购买'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: () => _rateOrder(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('评价'),
            ),
          ),
        ]);
        break;
      case 'cancelled':
        buttons.add(
          Expanded(
            child: ElevatedButton(
              onPressed: () => _buyAgain(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('再次购买'),
            ),
          ),
        );
        break;
    }

    return buttons;
  }

  // 辅助方法
  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'pending':
        return Icons.payment;
      case 'paid':
        return Icons.check_circle;
      case 'shipped':
        return Icons.local_shipping;
      case 'delivered':
        return Icons.done_all;
      case 'completed':
        return Icons.verified;
      case 'cancelled':
        return Icons.cancel;
      case 'refunded':
        return Icons.money_off;
      default:
        return Icons.help;
    }
  }

  String _getStatusDescription(String status) {
    switch (status) {
      case 'pending':
        return '订单已创建，等待付款';
      case 'paid':
        return '付款成功，等待发货';
      case 'shipped':
        return '商品已发货，正在配送中';
      case 'delivered':
        return '商品已送达，请确认收货';
      case 'completed':
        return '订单已完成，感谢您的购买';
      case 'cancelled':
        return '订单已取消';
      case 'refunded':
        return '订单已退款';
      default:
        return '未知状态';
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  // 订单操作方法
  void _cancelOrder() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('取消订单'),
        content: const Text('确定要取消这个订单吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _order.status = 'cancelled';
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('订单已取消')));
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _payOrder() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('跳转到支付页面...')));
  }

  void _refundOrder() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('申请退款功能开发中...')));
  }

  void _viewLogistics() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('查看物流功能开发中...')));
  }

  void _confirmReceive() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('确认收货'),
        content: const Text('确定已收到商品吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _order.status = 'completed';
                _order.receiveTime = DateTime.now();
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('确认收货成功')));
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _rateOrder() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('评价功能开发中...')));
  }

  void _buyAgain() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('再次购买功能开发中...')));
  }
}
