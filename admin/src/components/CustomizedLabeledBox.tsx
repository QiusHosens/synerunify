import * as React from 'react';
import { Box, FormHelperText, SxProps, Theme, useTheme } from '@mui/material';

export interface CustomizedLabeledBoxProps extends React.PropsWithChildren<{}> {
  label: React.ReactNode;
  /** 边框样式 */
  variant?: 'outlined' | 'standard' | 'filled';
  /** 尺寸 */
  size?: 'small' | 'medium';
  /** 是否占满容器宽度 */
  fullWidth?: boolean;
  /** 是否禁用（样式） */
  disabled?: boolean;
  /** 是否错误（样式） */
  error?: boolean;
  /** 必填星号 */
  required?: boolean;
  /** 辅助文字 */
  helperText?: React.ReactNode;
  /** 外层 sx，可覆盖样式 */
  sx?: SxProps<Theme>;
}

/**
 * 一个通用容器组件，让任意内容（表格、按钮组、自定义控件等）拥有类似 TextField 的带 Label 外观。
 * - 支持 :focus-within 高亮，内部只要有元素获得焦点，整体就会变色。
 * - 支持 error/disabled/required/size 等常见外观。
 * - 仅做样式包装，不拦截事件。
 */
const CustomizedLabeledBox = ({
  label,
  children,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  error = false,
  required = false,
  helperText,
  sx,
}: CustomizedLabeledBoxProps) => {
  const theme = useTheme();

  const radius = 1; // theme.shape.borderRadius 的倍数
  const paddingY = size === 'small' ? 1 : 1.5;
  const paddingX = 1.5;
  const fontSize = size === 'small' ? 12 : 14;
  const labelPaddingX = 0.5;

  // 颜色选择
  const borderColor = error
    ? theme.palette.error.main
    : theme.palette.divider;

  const focusBorderColor = error
    ? theme.palette.error.main
    : theme.palette.primary.main;

  const textColor = disabled
    ? theme.palette.text.disabled
    : theme.palette.text.primary;

  const bgColor = variant === 'filled'
    ? theme.palette.action.hover
    : theme.palette.background.paper;

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
      <Box
        // 外层容器，负责边框与 label 定位
        sx={{
          position: 'relative',
          borderRadius: '8px',
          // borderRadius: theme.shape.borderRadius * radius,
          bgcolor: disabled ? theme.palette.action.disabledBackground : bgColor,
          color: textColor,
          ...(
            variant === 'outlined'
              ? {
                border: '2px dashed #d1d5db',
                // border: '1px solid',
                // borderColor,
              }
              : variant === 'standard'
                ? {
                  borderBottom: '1px solid',
                  borderColor,
                }
                : {

                  // filled: 顶部留一条边，近似 TextField filled 样式
                  borderTopLeftRadius: theme.shape.borderRadius * radius,
                  borderTopRightRadius: theme.shape.borderRadius * radius,
                  borderBottomLeftRadius: theme.shape.borderRadius * radius,
                  borderBottomRightRadius: theme.shape.borderRadius * radius,
                  borderTop: '1px solid',
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                  borderColor,
                }
          ),
          p: 1.5,
          // padding: `${paddingY}rem ${paddingX}rem`,
          transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
          pointerEvents: disabled ? 'none' : 'auto',
          '&:focus-within': {
            borderColor: focusBorderColor,
            boxShadow: variant === 'outlined' ? `0 0 0 2px ${theme.palette.primary.main}22` : undefined,
          },
          '&.Mui-error': {
            borderColor: theme.palette.error.main,
          },
        }}
        className={error ? 'Mui-error' : undefined}
      >
        {/* Label */}
        {label && (
          <Box
            component="label"
            sx={{
              position: 'absolute',
              top: -10, // 将标签放到边框上方，形成“漂浮”效果
              left: 12,
              px: labelPaddingX,
              fontSize,
              lineHeight: 1,
              transformOrigin: 'left top',
              bgcolor: disabled ? theme.palette.action.disabledBackground : theme.palette.background.paper,
              color: error ? theme.palette.error.main : theme.palette.text.secondary,
              pointerEvents: 'none',
            }}
          >
            {label}
            {required && (
              <Box component="span" aria-hidden sx={{ ml: 0.25, color: error ? theme.palette.error.main : theme.palette.error.main }}>*</Box>
            )}
          </Box>
        )}

        {/* 内容区域 */}
        <Box sx={{ display: 'block' }}>
          {children}
        </Box>
      </Box>

      {/* 辅助文字 */}
      {helperText && (
        <FormHelperText error={error} sx={{ ml: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CustomizedLabeledBox;

// ================== 使用示例 ==================
// import { Button, Stack, TextField } from '@mui/material';
//
// export default function Demo() {
//   return (
//     <Stack spacing={2} sx={{ p: 2, maxWidth: 560 }}>
//       <CustomizedLabeledBox label="筛选条件" helperText="这只是一个容器，不是输入控件">
//         <Stack direction="row" spacing={1}>
//           <TextField size="small" label="关键字" />
//           <TextField size="small" label="分类" />
//           <Button variant="contained">查询</Button>
//         </Stack>
//       </CustomizedLabeledBox>
//
//       <CustomizedLabeledBox label="只读区域" variant="filled" size="small" disabled>
//         <Box>这里可以放任意内容，比如选择结果摘要或标签列表。</Box>
//       </CustomizedLabeledBox>
//
//       <CustomizedLabeledBox label="错误示例" error required helperText="请完善内容">
//         <Box tabIndex={0}>把可聚焦的元素放进来，试试 focus-within 高亮~</Box>
//       </CustomizedLabeledBox>
//     </Stack>
//   );
// }
