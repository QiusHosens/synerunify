import { IconButton, Menu, MenuItem, Divider, useTheme, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import { useThemeStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function SettingsButton() {
  const theme = useTheme();
  const {
    mode,
    navPosition,
    primary,
    secondary,
    fontFamily,
    fontSize,
    setThemeMode,
    setNavPosition,
    setPrimary,
    setSecondary,
    setFontFamily,
    setFontSize,
  } = useThemeStore();
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

  const handlePrimaryChange = (newColor: string) => {
    setPrimary(newColor);
    handleClose();
  };

  const handleSecondaryChange = (newColor: string) => {
    setSecondary(newColor);
    handleClose();
  };

  const handleFontChange = (newFont: 'Roboto' | 'Poppins' | 'Inter') => {
    setFontFamily(newFont);
    handleClose();
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    handleClose();
  };

  return (
    <>
      <IconButton
        sx={{
          color: theme.palette.text.primary,
          animation: 'spin 5s linear infinite', // 添加旋转动画
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
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
        {/* 主题模式 */}
        <MenuItem onClick={handleThemeToggle}>
          {t('switch_theme', { mode: mode === 'light' ? 'Dark' : 'Light' })}
        </MenuItem>

        {/* 导航位置 */}
        <MenuItem onClick={() => handleNavPosition('left')}>
          {t('nav_position', { position: 'Left' })}
        </MenuItem>
        <MenuItem onClick={() => handleNavPosition('top')}>
          {t('nav_position', { position: 'Top' })}
        </MenuItem>
        <MenuItem onClick={() => handleNavPosition('bottom')}>
          {t('nav_position', { position: 'Bottom' })}
        </MenuItem>

        <Divider />

        {/* Primary 颜色 */}
        <MenuItem onClick={() => handlePrimaryChange('#1976d2')}>
          Primary: Blue {primary === '#1976d2' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('#2e7d32')}>
          Primary: Green {primary === '#2e7d32' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('#7b1fa2')}>
          Primary: Purple {primary === '#7b1fa2' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('#d32f2f')}>
          Primary: Red {primary === '#d32f2f' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('#f57c00')}>
          Primary: Orange {primary === '#f57c00' && '(Selected)'}
        </MenuItem>

        <Divider />

        {/* Secondary 颜色 */}
        <MenuItem onClick={() => handleSecondaryChange('#dc004e')}>
          Secondary: Pink {secondary === '#dc004e' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleSecondaryChange('#0288d1')}>
          Secondary: Light Blue {secondary === '#0288d1' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleSecondaryChange('#388e3c')}>
          Secondary: Green {secondary === '#388e3c' && '(Selected)'}
        </MenuItem>

        <Divider />

        {/* 字体 */}
        <MenuItem onClick={() => handleFontChange('Roboto')}>
          Font: Roboto {fontFamily === 'Roboto' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontChange('Poppins')}>
          Font: Poppins {fontFamily === 'Poppins' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontChange('Inter')}>
          Font: Inter {fontFamily === 'Inter' && '(Selected)'}
        </MenuItem>

        <Divider />

        {/* 字体大小 */}
        <MenuItem onClick={() => handleFontSizeChange(12)}>
          Font Size: 12px {fontSize === 12 && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontSizeChange(14)}>
          Font Size: 14px {fontSize === 14 && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontSizeChange(16)}>
          Font Size: 16px {fontSize === 16 && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontSizeChange(18)}>
          Font Size: 18px {fontSize === 18 && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleFontSizeChange(20)}>
          Font Size: 20px {fontSize === 20 && '(Selected)'}
        </MenuItem>

        <Divider />

        {/* 语言 */}
        <MenuItem onClick={() => handleLanguageChange('en')}>
          English {i18n.language === 'en' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('fr')}>
          Français {i18n.language === 'fr' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('zh')}>
          中文 {i18n.language === 'zh' && '(Selected)'}
        </MenuItem>
      </Menu>
    </>
  );
}