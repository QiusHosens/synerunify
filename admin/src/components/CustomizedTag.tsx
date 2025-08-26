import React from 'react';
import { Chip, styled } from '@mui/material';

// 定义 props 类型
interface CustomizedTagProps {
  label: string | number;
  color?: 'primary' | 'secondary' | 'default';
  onDelete?: () => void;
  [key: string]: any; // 允许其他 Chip 组件支持的 props
}

// 自定义 Chip 样式
const CustomTag = styled(Chip)<{ color?: 'primary' | 'secondary' | 'default' }>(
  ({ theme, color }) => ({
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 500,
    height: '24px',
    // padding: '0 8px',
    backgroundColor:
      color === 'primary'
        ? theme.palette.primary.main
        : color === 'secondary'
          ? theme.palette.secondary.main
          : theme.palette.grey[200],
    color:
      color === 'primary'
        ? '#fff'
        : color === 'secondary'
          ? '#fff'
          : theme.palette.text.primary,
    // '&:hover': {
    //   backgroundColor:
    //     color === 'primary'
    //       ? theme.palette.primary.main
    //       : color === 'secondary'
    //         ? theme.palette.secondary.main
    //         : theme.palette.grey[300],
    //   color: theme.palette.common.white,
    // },
    '& .MuiChip-deleteIcon': {
      fontSize: '16px',
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    ...theme.applyStyles("dark", {
      backgroundColor:
        color === 'primary'
          ? theme.palette.primary.light
          : color === 'secondary'
            ? theme.palette.secondary.light
            : theme.palette.grey[700],
    })
  })
);

// Tag 组件
const CustomizedTag: React.FC<CustomizedTagProps> = ({ label, color = 'default', onDelete, ...props }) => {
  return (
    <CustomTag
      label={label}
      color={color}
      onDelete={onDelete}
      {...props}
    />
  );
};

export default CustomizedTag;