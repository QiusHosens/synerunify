import { IconButton, Menu, MenuItem, Divider, useTheme, Box, SvgIcon, Stack } from '@mui/material';
import { styled, SxProps, Theme, useColorScheme } from "@mui/material/styles";
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store';
import { useTranslation } from 'react-i18next';
import DarkIcon from '@/assets/image/svg/dark.svg';
import LigntIcon from '@/assets/image/svg/light.svg';
import LayoutLeftIcon from '@/assets/image/svg/layout_left.svg';
import LayoutTopIcon from '@/assets/image/svg/layout_top.svg';
import LayoutLeftSmallIcon from '@/assets/image/svg/layout_left_small.svg';
import ThemeColorIcon from '@/assets/image/svg/theme_color.svg';
import FontIcon from '@/assets/image/svg/font.svg';

interface SettingsButtonProps {
  sx?: SxProps<Theme>;
}

export default function SettingsButton({ sx }: SettingsButtonProps) {
  const theme = useTheme();
  const {
    mode,
    navPosition,
    primaryKey,
    primary,
    fontFamily,
    fontSize,
    setThemeMode,
    setNavPosition,
    setPrimaryKey,
    setPrimary,
    setFontFamily,
    setFontSize,
  } = useThemeStore();
  const { t, i18n } = useTranslation();
  const { setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // useEffect(() => {
  //     handleSettingsClick();
  //   }, []);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    // 直接设置模式
    setMode(mode === 'light' ? 'dark' : 'light');
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

  const handlePrimaryChange = (primaryKey: string) => {
    setPrimaryKey(primaryKey);
    setPrimary(primaryKey);
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
          // color: theme.palette.text.primary,
          animation: 'spin 5s linear infinite', // 添加旋转动画
          '@keyframes spin': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          border: 'unset', // 去掉主题样式
          backgroundColor: 'unset',
          '&:hover': {
            backgroundColor: 'unset',
            borderColor: 'unset',
          },
          '&:active': {
            backgroundColor: 'unset',
          },
          ...sx
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
        <Stack direction="row" sx={{ gap: 3, '& .MuiBox-root': { p: 4 } }}>
          <Box>
            <SvgIcon inheritViewBox>
              <DarkIcon />
            </SvgIcon>
          </Box>
          <Box>
            <SvgIcon inheritViewBox sx={{ color: 'primary.main' }}>
              <LigntIcon />
            </SvgIcon>
          </Box>
        </Stack>
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
        <MenuItem onClick={() => handlePrimaryChange('default')}>
          Primary: Default {primaryKey === 'default' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('green')}>
          Primary: Green {primaryKey === 'green' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('blue')}>
          Primary: Blue {primaryKey === 'blue' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('purple')}>
          Primary: Purple {primaryKey === 'purple' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('azure')}>
          Primary: Azure {primaryKey === 'azure' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('orange')}>
          Primary: Orange {primaryKey === 'orange' && '(Selected)'}
        </MenuItem>
        <MenuItem onClick={() => handlePrimaryChange('red')}>
          Primary: Red {primaryKey === 'red' && '(Selected)'}
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