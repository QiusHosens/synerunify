import React, { useState, KeyboardEvent, FocusEvent, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Box, Button, SxProps, TextField, Theme, useTheme } from '@mui/material';
import CustomizedTag from './CustomizedTag';

export interface Tag {
  id?: number;
  key: string;
  label: string;
}

interface CustomizedTagsInputProps {
  canEdit?: boolean
  tags: Tag[];
  onTagsChange?: (name: string, tags: Tag[]) => void;
  name?: string;
  tagName?: string;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

// 标签输入组件
const CustomizedTagsInput: React.FC<CustomizedTagsInputProps> = ({
  canEdit = true,
  tags,
  onTagsChange,
  name = '',
  tagName = "标签",
  placeholder = `输入${tagName}内容...`,
  maxTags,
  disabled = false,
  size = 'small',
  sx,
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // 生成唯一Key
  const generateKey = (): string => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  };

  // 添加标签
  const addTag = (value: string): void => {
    const trimmedValue = value.trim();

    if (
      trimmedValue === '' ||
      tags.some(tag => tag.label === trimmedValue) ||
      (maxTags && tags.length >= maxTags)
    ) {
      setInputValue('');
      return;
    }

    const newTag: Tag = {
      key: generateKey(),
      label: trimmedValue
    };

    const newTags = [...tags, newTag];
    onTagsChange?.(name, newTags);
    setInputValue('');
    setShowInput(false);

    setTimeout(() => {
      setShowInput(true);
    }, 150);
  };

  // 删除标签
  const removeTag = (tagId: string): void => {
    const newTags = tags.filter(tag => tag.key !== tagId);
    onTagsChange?.(name, newTags);
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

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const isMaxReached = maxTags && tags.length >= maxTags;

  return (
    <Box
      sx={{
        // minHeight: 60,
        borderRadius: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        ...sx,
      }}
    >
      {/* 渲染现有标签 */}
      {tags.map((tag) => (
        <CustomizedTag label={tag.label} color='primary' onDelete={(canEdit && !disabled) ? () => removeTag(tag.key) : undefined} />
      ))}

      {/* 输入框或添加按钮 */}
      {canEdit && !isMaxReached && (
        <>
          {showInput ? (
            <TextField
              size={size}
              inputRef={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              disabled={disabled}
              sx={{
                flexGrow: 1,
                // minWidth: 120,
              }}
              autoFocus
            />
          ) : (
            <Button
              size={size}
              onClick={addNewInput}
              disabled={disabled}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Plus size={16} style={{ marginRight: 4 }} />
              添加${tagName}
            </Button>
          )}
        </>
      )}

      {tags.length === 0 && !showInput && (
        <Box sx={{ fontSize: 14, color: '#6b7280', fontStyle: 'italic' }}>
          点击"添加${tagName}"开始创建${tagName}
        </Box>
      )}

      {isMaxReached && (
        <Box sx={{ fontSize: 14, color: '#d97706', fontStyle: 'italic' }}>
          已达到最大${tagName}数量 ({maxTags})
        </Box>
      )}

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
    </Box>
  );
};

export default CustomizedTagsInput;