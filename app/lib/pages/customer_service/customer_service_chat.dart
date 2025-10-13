import 'package:flutter/material.dart';
import '../../models/chat_message_model.dart';
import '../../services/chat_service.dart';
import '../../widgets/chat_message_bubble.dart';
import '../../widgets/chat_input_bar.dart';
import '../../widgets/product_card_widget.dart';
import '../../widgets/coupon_card_widget.dart';

class CustomerServiceChat extends StatefulWidget {
  const CustomerServiceChat({super.key});

  @override
  State<CustomerServiceChat> createState() => _CustomerServiceChatState();
}

class _CustomerServiceChatState extends State<CustomerServiceChat> {
  final ChatService _chatService = ChatService();
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadInitialMessages();
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  /// 加载初始消息
  void _loadInitialMessages() {
    setState(() {
      _messages.addAll(_chatService.getInitialMessages());
    });
    _scrollToBottom();
  }

  /// 发送文本消息
  void _sendTextMessage(String text) {
    if (text.trim().isEmpty) return;

    final userMessage = ChatMessage.userText(
      content: text.trim(),
      userId: 'user_001',
      userName: '用户',
      userAvatar: 'https://via.placeholder.com/40',
    );

    setState(() {
      _messages.add(userMessage);
    });

    _textController.clear();
    _scrollToBottom();

    // 模拟客服回复
    _simulateCustomerServiceReply(text.trim());
  }

  /// 模拟客服回复
  void _simulateCustomerServiceReply(String userMessage) {
    setState(() {
      _isLoading = true;
    });

    // 模拟网络延迟
    Future.delayed(const Duration(seconds: 1), () {
      final reply = _chatService.generateReply(userMessage);
      
      setState(() {
        _messages.add(reply);
        _isLoading = false;
      });
      
      _scrollToBottom();
    });
  }

  /// 滚动到底部
  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  /// 构建消息列表
  Widget _buildMessageList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length + (_isLoading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _messages.length && _isLoading) {
          return _buildTypingIndicator();
        }
        
        final message = _messages[index];
        return _buildMessageItem(message);
      },
    );
  }

  /// 构建消息项
  Widget _buildMessageItem(ChatMessage message) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: _buildMessageBubble(message),
    );
  }

  /// 构建消息气泡
  Widget _buildMessageBubble(ChatMessage message) {
    switch (message.type) {
      case MessageType.text:
        return ChatMessageBubble(message: message);
      case MessageType.product:
        return ProductCardWidget(message: message);
      case MessageType.coupon:
        return CouponCardWidget(message: message);
      default:
        return ChatMessageBubble(message: message);
    }
  }

  /// 构建输入指示器
  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: Colors.grey[300],
            child: const Icon(Icons.support_agent, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTypingDot(0),
                const SizedBox(width: 4),
                _buildTypingDot(1),
                const SizedBox(width: 4),
                _buildTypingDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// 构建输入点动画
  Widget _buildTypingDot(int index) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      builder: (context, value, child) {
        return Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            color: Colors.grey[400]?.withOpacity(0.3 + (value * 0.7)),
            shape: BoxShape.circle,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.orange,
              child: const Icon(Icons.support_agent, size: 16, color: Colors.white),
            ),
            const SizedBox(width: 8),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '客服小助手',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  '在线服务中',
                  style: TextStyle(fontSize: 12, color: Colors.green),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined),
            onPressed: () {
              // 跳转到购物车
            },
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: () {
              _showMoreOptions();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(child: _buildMessageList()),
          ChatInputBar(
            controller: _textController,
            onSend: _sendTextMessage,
            onAttachment: _showAttachmentOptions,
          ),
        ],
      ),
    );
  }

  /// 显示更多选项
  void _showMoreOptions() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('聊天记录'),
              onTap: () {
                Navigator.pop(context);
                // 查看聊天记录
              },
            ),
            ListTile(
              leading: const Icon(Icons.rate_review),
              title: const Text('服务评价'),
              onTap: () {
                Navigator.pop(context);
                // 服务评价
              },
            ),
            ListTile(
              leading: const Icon(Icons.info_outline),
              title: const Text('关于客服'),
              onTap: () {
                Navigator.pop(context);
                // 关于客服
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 显示附件选项
  void _showAttachmentOptions() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo),
              title: const Text('相册'),
              onTap: () {
                Navigator.pop(context);
                // 选择图片
              },
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('拍照'),
              onTap: () {
                Navigator.pop(context);
                // 拍照
              },
            ),
            ListTile(
              leading: const Icon(Icons.shopping_bag),
              title: const Text('商品链接'),
              onTap: () {
                Navigator.pop(context);
                // 发送商品链接
              },
            ),
          ],
        ),
      ),
    );
  }
}
