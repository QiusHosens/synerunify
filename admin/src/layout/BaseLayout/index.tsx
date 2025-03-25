import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopNavFixed from './TopNavFixed';
import { useAuthStore, useThemeStore } from '@/store';
import LeftNav from './LeftNav';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import { useEffect } from 'react';
import { getHome } from '@/api';

export default function Layout() {
  const { navPosition } = useThemeStore();
  const topFixedNavHeight = 72; // 固定顶部导航栏高度
  const topNavHeight = 64; // 顶部导航栏高度
  const bottomNavHeight = 72; // 底部导航栏高度
  const leftNavWidth = 288; // 左侧导航栏宽度

  // 导航项
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ];

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
    const fetchData = async () => {
      try {
        const data = await getHome();
        console.log('home data:', data);
      } catch (error) {
        console.error('Fetch home failed:', error);
      }
    };
    fetchData();
    // setInterval(() => {
    //   fetchData();
    // }, 1000);
  }, []);

  return (
    <>
      <TopNavFixed sx={{ bgcolor: 'background.default', }} leftNavWidth={leftNavWidth} height={topFixedNavHeight} />
      <Box sx={layoutStyles}>
        {
          navPosition === 'left' ? <LeftNav sx={{
            mt: 0,
            height: '100%'
          }} navItems={navItems} leftNavWidth={leftNavWidth}></LeftNav>
            : navPosition === 'top' ? <TopNav sx={{
              mt: topFixedNavHeight + 'px',
              height: topNavHeight + 'px'
            }} navItems={navItems}></TopNav> : <BottomNav sx={{
              bottom: '24px',
              height: bottomNavHeight + 'px'
            }} navItems={navItems}></BottomNav>
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
          <Outlet />
        </Box>
      </Box>
    </>
  );
}