import React, { useState, KeyboardEvent, FocusEvent, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

export interface Tag {
  id: string;
  label: string;
}

interface CustomizedTagsInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

// 标签输入组件
const CustomizedTagsInput: React.FC<CustomizedTagsInputProps> = ({
  tags,
  onTagsChange,
  placeholder = "输入标签内容...",
  maxTags,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // 生成唯一ID
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // 添加标签
  const addTag = (value: string): void => {
    const trimmedValue = value.trim();

    // 检查是否为空、已存在或超过最大数量
    if (
      trimmedValue === '' ||
      tags.some(tag => tag.label === trimmedValue) ||
      (maxTags && tags.length >= maxTags)
    ) {
      setInputValue('');
      return;
    }

    const newTag: Tag = {
      id: generateId(),
      label: trimmedValue
    };

    const newTags = [...tags, newTag];
    onTagsChange(newTags);
    setInputValue('');
    setShowInput(false);

    // 延迟显示新的输入框，创造替换效果
    setTimeout(() => {
      setShowInput(true);
    }, 150);
  };

  // 删除标签
  const removeTag = (tagId: string): void => {
    const newTags = tags.filter(tag => tag.id !== tagId);
    onTagsChange(newTags);
  };

  // 处理键盘事件
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(inputValue);
    }
  };

  // 处理失去焦点事件
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    addTag(inputValue);
  };

  // 添加新标签输入框
  const addNewInput = (): void => {
    setShowInput(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // 当输入框重新显示时自动聚焦
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // 检查是否达到最大标签数量
  const isMaxReached = maxTags && tags.length >= maxTags;

  return (
    <div
      style={{
        minHeight: '60px',
        padding: '12px',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center'
      }}
    >
      {/* 渲染现有标签 */}
      {tags.map((tag, index) => (
        <span
          key={tag.id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {tag.label}
          {!disabled && (
            <button
              onClick={() => removeTag(tag.id)}
              style={{
                marginLeft: '6px',
                padding: '2px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#bfdbfe';
                e.currentTarget.style.color = '#1e3a8a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#1e40af';
              }}
              title={`删除标签: ${tag.label}`}
            >
              <X size={12} />
            </button>
          )}
        </span>
      ))}

      {/* 输入框或添加按钮 */}
      {!isMaxReached && (
        <>
          {showInput ? (
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              // onBlur={handleBlur}
              disabled={disabled}
              style={{
                flexGrow: 1,
                minWidth: '120px',
                padding: '8px 12px',
                border: '1px solid #3b82f6',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                handleBlur(e);
              }}
              autoFocus
            />
          ) : (
            <button
              onClick={addNewInput}
              disabled={disabled}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 12px',
                border: '2px dashed #3b82f6',
                borderRadius: '16px',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                textTransform: 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                  e.currentTarget.style.borderColor = '#2563eb';
                }
              }}
              onMouseOut={(e) => {
                if (!disabled) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
            >
              <Plus size={16} style={{ marginRight: '4px' }} />
              添加标签
            </button>
          )}
        </>
      )}

      {/* 空状态或最大数量提示 */}
      {tags.length === 0 && !showInput && (
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          点击"添加标签"开始创建标签
        </span>
      )}

      {isMaxReached && (
        <span style={{
          fontSize: '14px',
          color: '#d97706',
          fontStyle: 'italic'
        }}>
          已达到最大标签数量 ({maxTags})
        </span>
      )}

      {/* CSS动画 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomizedTagsInput;