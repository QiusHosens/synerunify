import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopNavFixed from './TopFixed';
import { useAuthStore, useHomeStore, useThemeStore } from '@/store';
import LeftNavigation from './LeftNavigation';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';
import { useEffect } from 'react';

interface LayoutProps {
  children?: React.ReactNode; // 添加 children 属性
}

export default function Layout({ children }: LayoutProps) {
  const { navPosition } = useThemeStore();
  const topFixedNavHeight = 72; // 固定顶部导航栏高度
  const topNavHeight = 64; // 顶部导航栏高度
  const bottomNavHeight = 72; // 底部导航栏高度
  const leftNavWidth = 288; // 左侧导航栏宽度

  const { access_token } = useAuthStore();
  const { nickname, routes, routeTree, fetchAndSetHome } = useHomeStore();

  const isVertical = navPosition === 'top' || navPosition === 'bottom';
  const layoutStyles = {
    position: 'relative',
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    minHeight: '100vh',
    width: '100%',
    // bgcolor: 'background.default'
  };

  useEffect(() => {
    fetchAndSetHome(access_token);
  }, [access_token, fetchAndSetHome]);

  return (
    <>
      <TopNavFixed sx={{ bgcolor: 'background.default', }} leftNavWidth={leftNavWidth} height={topFixedNavHeight} />
      <Box sx={layoutStyles}>
        {
          navPosition === 'left' ? <LeftNavigation sx={{
            mt: 0,
            height: '100%'
          }} routeTree={routeTree} leftNavWidth={leftNavWidth}></LeftNavigation>
            : navPosition === 'top' ? <TopNavigation sx={{
              mt: topFixedNavHeight + 'px',
              height: topNavHeight + 'px'
            }} routeTree={routeTree}></TopNavigation> : <BottomNavigation sx={{
              bottom: '24px',
              height: bottomNavHeight + 'px'
            }} routeTree={routeTree}></BottomNavigation>
        }
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: navPosition === 'left' ? `calc(100% - ${leftNavWidth}px)` : `calc(100vw - 48px)`,
            mt: navPosition !== 'top' ? topFixedNavHeight + 'px' : 0, // 主内容偏移
            minHeight: navPosition === 'top'
              ? `calc(100vh - ${topFixedNavHeight}px - ${topNavHeight}px - 48px)` // 顶部导航时调整高度（48px 为 p: 3 的上下总和）
              : `calc(100vh - ${topFixedNavHeight}px - 48px)`, // 左侧或底部导航时调整高度
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
    </>
  );
}