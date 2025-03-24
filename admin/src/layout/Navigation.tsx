import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store';
import { SxProps, Theme } from '@mui/material/styles';

interface NavigationProps {
  sx?: SxProps<Theme>;
  leftNavWidth: number;
}

export default function Navigation({ sx, leftNavWidth }: NavigationProps) {
  const { navPosition } = useThemeStore();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' },
  ];

  const isVertical = navPosition === 'top' || navPosition === 'bottom';

  return (
    <>
      {navPosition === 'left' ? (
        <Drawer
          variant="permanent"
          sx={{
            width: leftNavWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: leftNavWidth,
              boxSizing: 'border-box',
            },
            ...sx, // 合并外部传入的 sx
          }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      ) : (
        <Box
          sx={{
            width: '100%',
            backgroundColor: (theme) => theme.palette.grey[200],
            ...sx, // 合并外部传入的 sx
          }}
        >
          <List sx={{ display: isVertical ? 'flex' : 'block' }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
}