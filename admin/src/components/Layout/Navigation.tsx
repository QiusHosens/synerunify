import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings'; // 引入 MUI 的 Settings 图标
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setThemeMode, setNavPosition } from '@/store/slices/themeSlice';
import { useState } from 'react';

export default function Navigation() {
  const dispatch = useDispatch();
  const { mode, navPosition } = useSelector((state: RootState) => state.theme);

  // 控制 Menu 的状态
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    dispatch(setThemeMode(mode === 'light' ? 'dark' : 'light'));
    handleClose();
  };

  const handleNavPosition = (position: 'left' | 'top' | 'bottom') => {
    dispatch(setNavPosition(position));
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ width: navPosition === 'left' ? 240 : '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        {/* 设置按钮 */}
        <IconButton color="inherit" onClick={handleSettingsClick}>
          <SettingsIcon />
        </IconButton>

        {/* 设置菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleThemeToggle}>
            Switch to {mode === 'light' ? 'Dark' : 'Light'} Theme
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('left')}>
            Nav Position: Left
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('top')}>
            Nav Position: Top
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('bottom')}>
            Nav Position: Bottom
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}