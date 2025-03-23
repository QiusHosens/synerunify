import { IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import { useThemeStore } from '@/store';
import { useTranslation } from 'react-i18next';
import './styles.scss';

export default function SettingsButton() {
  const { mode, navPosition, setThemeMode, setNavPosition } = useThemeStore();
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
    setThemeMode(mode === 'light' ? 'dark' : 'light');
    handleClose();
  };

  const handleNavPosition = (position: 'left' | 'top' | 'bottom') => {
    setNavPosition(position);
    handleClose();
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <>
      <IconButton
        className="settings-button"
        color="inherit"
        onClick={handleSettingsClick}
      >
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
        <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('fr')}>Français</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('zh')}>中文</MenuItem>
      </Menu>
    </>
  );
}