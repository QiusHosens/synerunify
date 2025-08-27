import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';

// 定义 props 类型
interface CustomizedTagProps {
  label: string | number;
  onDelete?: () => void;
  sx?: SxProps<Theme>;
  [key: string]: any; // 允许其他 Chip 组件支持的 props
}

// Tag 组件
const CustomizedTag: React.FC<CustomizedTagProps> = ({ label, onDelete, sx, ...props }) => {
  return (
    <Chip
      label={label}
      onDelete={onDelete}
      sx={{
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 500,
        height: 24,
        '& .MuiChip-deleteIcon': {
          fontSize: '1rem',
        },
        ...sx
      }}
      {...props}
    />
  );
};

export default CustomizedTag;