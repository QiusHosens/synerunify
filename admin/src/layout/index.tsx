import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useThemeStore } from '@/store';

export default function Layout() {
  const { navPosition } = useThemeStore();

  const layoutStyles = {
    display: 'flex',
    flexDirection: navPosition === 'top' ? 'column' : navPosition === 'bottom' ? 'column-reverse' : 'row',
    minHeight: '100vh',
  };

  return (
    <Box sx={layoutStyles}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}