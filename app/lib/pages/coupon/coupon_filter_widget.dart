import 'package:flutter/material.dart';
import '../../models/coupon_model.dart';

/// 优惠券筛选组件
class CouponFilterWidget extends StatefulWidget {
  final CouponFilter initialFilter;
  final Function(CouponFilter) onFilterChanged;

  const CouponFilterWidget({
    super.key,
    required this.initialFilter,
    required this.onFilterChanged,
  });

  @override
  State<CouponFilterWidget> createState() => _CouponFilterWidgetState();
}

class _CouponFilterWidgetState extends State<CouponFilterWidget> {
  late CouponFilter _currentFilter;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _currentFilter = widget.initialFilter;
    _searchController.text = _currentFilter.searchKeyword ?? '';
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
          // 搜索框
          _buildSearchBar(),
          const SizedBox(height: 16),
          // 类型筛选
          _buildTypeFilter(),
          const SizedBox(height: 16),
          // 状态筛选
          _buildStatusFilter(),
          const SizedBox(height: 16),
          // 操作按钮
          _buildActionButtons(),
        ],
      ),
    );
  }

  /// 构建搜索框
  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      decoration: InputDecoration(
        hintText: '搜索优惠券名称或描述',
        prefixIcon: const Icon(Icons.search, color: Colors.grey),
        suffixIcon: _searchController.text.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear, color: Colors.grey),
                onPressed: () {
                  _searchController.clear();
                  _updateFilter(searchKeyword: '');
                },
              )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.blue),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      ),
      onChanged: (value) {
        _updateFilter(searchKeyword: value);
      },
    );
  }

  /// 构建类型筛选
  Widget _buildTypeFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '优惠券类型',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildFilterChip('全部', null, _currentFilter.type == null),
            ...CouponType.values.map((type) => _buildTypeFilterChip(type)),
          ],
        ),
      ],
    );
  }

  /// 构建类型筛选芯片
  Widget _buildTypeFilterChip(CouponType type) {
    final isSelected = _currentFilter.type == type;
    final displayName = _getTypeDisplayName(type);

    return _buildFilterChip(displayName, type, isSelected);
  }

  /// 构建状态筛选
  Widget _buildStatusFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '使用状态',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildFilterChip('全部', null, _currentFilter.status == null),
            ...CouponStatus.values.map((status) => _buildStatusFilterChip(status)),
          ],
        ),
      ],
    );
  }

  /// 构建状态筛选芯片
  Widget _buildStatusFilterChip(CouponStatus status) {
    final isSelected = _currentFilter.status == status;
    final displayName = _getStatusDisplayName(status);

    return _buildFilterChip(displayName, status, isSelected);
  }

  /// 构建筛选芯片
  Widget _buildFilterChip(String label, dynamic value, bool isSelected) {
    return GestureDetector(
      onTap: () {
        if (value is CouponType) {
          _updateFilter(type: isSelected ? null : value);
        } else if (value is CouponStatus) {
          _updateFilter(status: isSelected ? null : value);
        } else {
          // 全部选项
          if (label == '全部') {
            _updateFilter(type: null, status: null);
          }
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue : Colors.grey[100],
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? Colors.blue : Colors.grey[300]!,
            width: 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey[600],
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  /// 构建操作按钮
  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            onPressed: _resetFilter,
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: Colors.grey[300]!),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              '重置',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton(
            onPressed: _applyFilter,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              '确定',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  /// 更新筛选条件
  void _updateFilter({
    CouponType? type,
    CouponStatus? status,
    String? searchKeyword,
  }) {
    setState(() {
      _currentFilter = _currentFilter.copyWith(
        type: type,
        status: status,
        searchKeyword: searchKeyword,
      );
    });
  }

  /// 重置筛选条件
  void _resetFilter() {
    setState(() {
      _currentFilter = const CouponFilter();
      _searchController.clear();
    });
  }

  /// 应用筛选条件
  void _applyFilter() {
    widget.onFilterChanged(_currentFilter);
    Navigator.pop(context);
  }

  /// 获取类型显示名称
  String _getTypeDisplayName(CouponType type) {
    switch (type) {
      case CouponType.fullReduction:
        return '满减券';
      case CouponType.crossStore:
        return '跨店券';
      case CouponType.shipping:
        return '运费券';
      case CouponType.redEnvelope:
        return '红包';
      case CouponType.electronic:
        return '电子券';
      case CouponType.qualification:
        return '资格凭证';
      case CouponType.card:
        return '卡券';
    }
  }

  /// 获取状态显示名称
  String _getStatusDisplayName(CouponStatus status) {
    switch (status) {
      case CouponStatus.active:
        return '可用';
      case CouponStatus.used:
        return '已使用';
      case CouponStatus.expired:
        return '已过期';
      case CouponStatus.disabled:
        return '已禁用';
    }
  }
}

/// 筛选底部弹窗
class CouponFilterBottomSheet extends StatelessWidget {
  final CouponFilter initialFilter;
  final Function(CouponFilter) onFilterChanged;

  const CouponFilterBottomSheet({
    super.key,
    required this.initialFilter,
    required this.onFilterChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 拖拽指示器
          Container(
            margin: const EdgeInsets.symmetric(vertical: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // 标题
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              '筛选优惠券',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          // 筛选内容
          CouponFilterWidget(
            initialFilter: initialFilter,
            onFilterChanged: onFilterChanged,
          ),
          // 安全区域
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  /// 显示筛选底部弹窗
  static void show(
    BuildContext context, {
    required CouponFilter initialFilter,
    required Function(CouponFilter) onFilterChanged,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CouponFilterBottomSheet(
        initialFilter: initialFilter,
        onFilterChanged: onFilterChanged,
      ),
    );
  }
}
