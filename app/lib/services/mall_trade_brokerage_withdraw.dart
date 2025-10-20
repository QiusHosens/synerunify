import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_brokerage_withdraw/create', // 新增
  'update': '/mall/mall_trade_brokerage_withdraw/update', // 修改
  'delete': '/mall/mall_trade_brokerage_withdraw/delete', // 删除
  'get': '/mall/mall_trade_brokerage_withdraw/get', // 单条查询
  'list': '/mall/mall_trade_brokerage_withdraw/list', // 列表查询
  'page': '/mall/mall_trade_brokerage_withdraw/page', // 分页查询
  'enable': '/mall/mall_trade_brokerage_withdraw/enable', // 启用
  'disable': '/mall/mall_trade_brokerage_withdraw/disable', // 禁用
};

class MallTradeBrokerageWithdrawRequest {
  final int id; // 编号
  final int userId; // 用户编号
  final int price; // 提现金额
  final int feePrice; // 提现手续费
  final int totalPrice; // 当前总佣金
  final int type; // 提现类型
  final String? userName; // 真实姓名
  final String? userAccount; // 账号
  final String? bankName; // 银行名称
  final String? bankAddress; // 开户地址
  final String? qrCodeUrl; // 收款码
  final int status; // 状态：0-审核中，10-审核通过 20-审核不通过；11 - 提现成功；21-提现失败
  final String? auditReason; // 审核驳回原因
  final DateTime? auditTime; // 审核时间
  final String? remark; // 备注
  final int? payTransferId; // 转账订单编号
  final String? transferChannelCode; // 转账渠道
  final DateTime? transferTime; // 转账支付时间
  final String? transferErrorMsg; // 转账错误提示
  

  MallTradeBrokerageWithdrawRequest({
    required this.id,
    required this.userId,
    required this.price,
    required this.feePrice,
    required this.totalPrice,
    required this.type,
    this.userName,
    this.userAccount,
    this.bankName,
    this.bankAddress,
    this.qrCodeUrl,
    required this.status,
    this.auditReason,
    this.auditTime,
    this.remark,
    this.payTransferId,
    this.transferChannelCode,
    this.transferTime,
    this.transferErrorMsg,
    });

  factory MallTradeBrokerageWithdrawRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageWithdrawRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      price: json['price'] as int,
      feePrice: json['fee_price'] as int,
      totalPrice: json['total_price'] as int,
      type: json['type'] as int,
      userName: json['user_name'] as String?,
      userAccount: json['user_account'] as String?,
      bankName: json['bank_name'] as String?,
      bankAddress: json['bank_address'] as String?,
      qrCodeUrl: json['qr_code_url'] as String?,
      status: json['status'] as int,
      auditReason: json['audit_reason'] as String?,
      auditTime: json['audit_time'] as DateTime?,
      remark: json['remark'] as String?,
      payTransferId: json['pay_transfer_id'] as int?,
      transferChannelCode: json['transfer_channel_code'] as String?,
      transferTime: json['transfer_time'] as DateTime?,
      transferErrorMsg: json['transfer_error_msg'] as String?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'price': price,
      'fee_price': feePrice,
      'total_price': totalPrice,
      'type': type,
      'user_name': userName,
      'user_account': userAccount,
      'bank_name': bankName,
      'bank_address': bankAddress,
      'qr_code_url': qrCodeUrl,
      'status': status,
      'audit_reason': auditReason,
      'audit_time': auditTime,
      'remark': remark,
      'pay_transfer_id': payTransferId,
      'transfer_channel_code': transferChannelCode,
      'transfer_time': transferTime,
      'transfer_error_msg': transferErrorMsg,
      };
  }
}

class MallTradeBrokerageWithdrawQueryCondition extends PaginatedRequest {
  MallTradeBrokerageWithdrawQueryCondition({
    required int page,
    required int size,
    String? keyword,
    String? sortField,
    String? sort,
    String? filterField,
    String? filterOperator,
    String? filterValue,
  }) : super(
          page: page,
          size: size,
          keyword: keyword,
          sortField: sortField,
          sort: sort,
          filterField: filterField,
          filterOperator: filterOperator,
          filterValue: filterValue,
        );
}

class MallTradeBrokerageWithdrawResponse {
  final int id; // 编号
  final int userId; // 用户编号
  final int price; // 提现金额
  final int feePrice; // 提现手续费
  final int totalPrice; // 当前总佣金
  final int type; // 提现类型
  final String? userName; // 真实姓名
  final String? userAccount; // 账号
  final String? bankName; // 银行名称
  final String? bankAddress; // 开户地址
  final String? qrCodeUrl; // 收款码
  final int status; // 状态：0-审核中，10-审核通过 20-审核不通过；11 - 提现成功；21-提现失败
  final String? auditReason; // 审核驳回原因
  final DateTime? auditTime; // 审核时间
  final String? remark; // 备注
  final int? payTransferId; // 转账订单编号
  final String? transferChannelCode; // 转账渠道
  final DateTime? transferTime; // 转账支付时间
  final String? transferErrorMsg; // 转账错误提示
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeBrokerageWithdrawResponse({
    required this.id,
    required this.userId,
    required this.price,
    required this.feePrice,
    required this.totalPrice,
    required this.type,
    this.userName,
    this.userAccount,
    this.bankName,
    this.bankAddress,
    this.qrCodeUrl,
    required this.status,
    this.auditReason,
    this.auditTime,
    this.remark,
    this.payTransferId,
    this.transferChannelCode,
    this.transferTime,
    this.transferErrorMsg,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeBrokerageWithdrawResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeBrokerageWithdrawResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      price: json['price'] as int,
      feePrice: json['fee_price'] as int,
      totalPrice: json['total_price'] as int,
      type: json['type'] as int,
      userName: json['user_name'] as String?,
      userAccount: json['user_account'] as String?,
      bankName: json['bank_name'] as String?,
      bankAddress: json['bank_address'] as String?,
      qrCodeUrl: json['qr_code_url'] as String?,
      status: json['status'] as int,
      auditReason: json['audit_reason'] as String?,
      auditTime: json['audit_time'] as DateTime?,
      remark: json['remark'] as String?,
      payTransferId: json['pay_transfer_id'] as int?,
      transferChannelCode: json['transfer_channel_code'] as String?,
      transferTime: json['transfer_time'] as DateTime?,
      transferErrorMsg: json['transfer_error_msg'] as String?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'price': price,
      'fee_price': feePrice,
      'total_price': totalPrice,
      'type': type,
      'user_name': userName,
      'user_account': userAccount,
      'bank_name': bankName,
      'bank_address': bankAddress,
      'qr_code_url': qrCodeUrl,
      'status': status,
      'audit_reason': auditReason,
      'audit_time': auditTime,
      'remark': remark,
      'pay_transfer_id': payTransferId,
      'transfer_channel_code': transferChannelCode,
      'transfer_time': transferTime,
      'transfer_error_msg': transferErrorMsg,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeBrokerageWithdrawService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeBrokerageWithdraw(MallTradeBrokerageWithdrawRequest mallTradeBrokerageWithdraw) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeBrokerageWithdraw);
    }

    Future<ApiResponse<int>> updateMallTradeBrokerageWithdraw(MallTradeBrokerageWithdrawRequest mallTradeBrokerageWithdraw) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeBrokerageWithdraw);
    }

    Future<ApiResponse<void>> deleteMallTradeBrokerageWithdraw(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeBrokerageWithdrawResponse>> getMallTradeBrokerageWithdraw(int id) async {
        return await _httpClient.get<MallTradeBrokerageWithdrawResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeBrokerageWithdrawResponse>>> listMallTradeBrokerageWithdraw() async {
        return await _httpClient.get<List<MallTradeBrokerageWithdrawResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeBrokerageWithdrawResponse>>> pageMallTradeBrokerageWithdraw(MallTradeBrokerageWithdrawQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeBrokerageWithdrawResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeBrokerageWithdraw(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeBrokerageWithdraw(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}