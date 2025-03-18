import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setThemeMode, setNavPosition } from '@/store/slices/themeSlice';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navigation() {
  const dispatch = useDispatch();
  const { mode, navPosition } = useSelector((state: RootState) => state.theme);
  const { t, i18n } = useTranslation();

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

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ width: navPosition === 'left' ? 240 : '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('app_title')}
        </Typography>
        <IconButton color="inherit" onClick={handleSettingsClick}>
          <SettingsIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleThemeToggle}>
            {t('switch_theme', { mode: mode === 'light' ? 'Dark' : 'Light' })}
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('left')}>
            {t('nav_position', { position: 'Left' })}
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('top')}>
            {t('nav_position', { position: 'Top' })}
          </MenuItem>
          <MenuItem onClick={() => handleNavPosition('bottom')}>
            {t('nav_position', { position: 'Bottom' })}
          </MenuItem>
          {/* 语言切换 */}
          <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('fr')}>Français</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('zh')}>中文</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}