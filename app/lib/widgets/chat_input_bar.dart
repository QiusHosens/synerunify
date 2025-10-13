import 'package:flutter/material.dart';

class ChatInputBar extends StatefulWidget {
  final TextEditingController controller;
  final Function(String) onSend;
  final VoidCallback? onAttachment;

  const ChatInputBar({
    super.key,
    required this.controller,
    required this.onSend,
    this.onAttachment,
  });

  @override
  State<ChatInputBar> createState() => _ChatInputBarState();
}

class _ChatInputBarState extends State<ChatInputBar> {
  bool _isComposing = false;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onTextChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onTextChanged);
    super.dispose();
  }

  void _onTextChanged() {
    setState(() {
      _isComposing = widget.controller.text.trim().isNotEmpty;
    });
  }

  void _handleSend() {
    if (widget.controller.text.trim().isNotEmpty) {
      widget.onSend(widget.controller.text);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
            // 语音输入按钮
            IconButton(
              icon: const Icon(Icons.mic, color: Colors.grey),
              onPressed: () {
                // 语音输入功能
                _showVoiceInputDialog();
              },
            ),
            // 文本输入框
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(24),
                ),
                child: TextField(
                  controller: widget.controller,
                  decoration: const InputDecoration(
                    hintText: '请输入您要咨询的内容...',
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  maxLines: null,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _handleSend(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // 发送按钮
            GestureDetector(
              onTap: _isComposing ? _handleSend : null,
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _isComposing ? Colors.blue : Colors.grey[300],
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.send,
                  color: _isComposing ? Colors.white : Colors.grey[600],
                  size: 20,
                ),
              ),
            ),
            const SizedBox(width: 8),
            // 更多选项按钮
            IconButton(
              icon: const Icon(Icons.add, color: Colors.grey),
              onPressed: widget.onAttachment,
            ),
          ],
        ),
      ),
    );
  }

  /// 显示语音输入对话框
  void _showVoiceInputDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('语音输入'),
        content: const Text('语音输入功能正在开发中，敬请期待！'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }
}
