import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SxProps, Theme } from '@mui/material/styles';
import { useThemeStore } from '@/store';

interface MainGridProps {
  sx?: SxProps<Theme>;
  headerHeight: number;
  topMenuHeight: number;
  children?: React.ReactNode; // 添加 children 属性
}

export default function MainGrid({ sx, headerHeight, topMenuHeight, children }: MainGridProps) {
  const { navPosition } = useThemeStore();

  return (
    <>
      <Stack
        sx={{
          display: 'flex',
          width: '100%',
          height: navPosition === 'top'
            ? `calc(100vh - ${headerHeight}px - ${topMenuHeight}px)` // 顶部导航时调整高度（48px 为 p: 3 的上下总和）
            : `calc(100vh - ${headerHeight}px)`, // 左侧或底部导航时调整高度
          // left: sideMenuWidth + 'px',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          component="main"
          sx={{
            // flexGrow: 1,
            // display: 'block',
            p: 3,
            // display: 'flex',
            // justifyContent: 'center',
            // width: navPosition === 'left' ? `calc(100% - ${sideMenuWidth}px)` : `calc(100vw - 48px)`,
            // mt: navPosition !== 'top' ? headerHeight + 'px' : 0, // 主内容偏移
            width: '100%',
            maxWidth: { sm: '100%', md: '1700px' },
            height: '100%',
            // minHeight: navPosition === 'top'
            //   ? `calc(100vh - ${headerHeight}px - ${topMenuHeight}px - 48px)` // 顶部导航时调整高度（48px 为 p: 3 的上下总和）
            //   : `calc(100vh - ${headerHeight}px - 48px)`, // 左侧或底部导航时调整高度
            ...sx,
          }}
        >
          {children || <Outlet />}
        </Box>
      </Stack>
    </>
  )
}