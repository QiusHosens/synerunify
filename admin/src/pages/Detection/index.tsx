import { Box, Drawer, ListItem, ListItemButton, ListItemText, Stack, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const menuItems = [
  {
    label: '图片识别',
    path: '/detection/image-recognition',
    key: 'image-recognition',
  },
  {
    label: '图片转换',
    path: '/detection/image-convert',
    key: 'image-convert',
  },
  {
    label: '目标检测',
    path: '/detection/object-detection',
    key: 'object-detection',
  },
];

export default function Detection() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // 当访问 /detection 时，默认跳转到图片识别页面
  useEffect(() => {
    if (location.pathname === '/detection') {
      navigate('/detection/image-recognition', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(63, 81, 181, 0.15), rgba(13, 71, 161, 0.05))',
      }}>
      {/* 左侧导航栏 */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
          },
        }}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Stack>
        </Box>
      </Drawer>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
        }}>
        <Outlet />
      </Box>
    </Box>
  );
}