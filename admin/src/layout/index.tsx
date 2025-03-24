import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import TopNav from './TopNav';
import { useThemeStore } from '@/store';

export default function Layout() {
  const { navPosition } = useThemeStore();
  const navHeight = 64; // 顶部导航栏高度
  const leftNavWidth = 288; // 左侧导航栏宽度
  const topNavHeight = 72; // 顶部导航栏高度

  const isVertical = navPosition === 'top' || navPosition === 'bottom';
  const layoutStyles = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    minHeight: '100vh',
    width: '100%',
  };

  return (
    <>
      <TopNav leftNavWidth={leftNavWidth} height={topNavHeight} />
      <Box sx={layoutStyles}>
        <Navigation
          sx={{
            mt: navPosition === 'top' ? topNavHeight + 'px' : 0, // 动态导航在顶部时下移
            height: navPosition === 'top' || navPosition === 'bottom' ? navHeight + 'px' : '100%',
          }}
          leftNavWidth={leftNavWidth}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: navPosition === 'left' ? `calc(100% - ${leftNavWidth}px)` : '100%',
            mt: navPosition !== 'top' ? topNavHeight : 0, // 主内容偏移
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}