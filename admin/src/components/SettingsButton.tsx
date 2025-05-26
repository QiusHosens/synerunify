import { IconButton, Menu, useTheme, Box, SvgIcon, Stack, Typography, Slider } from '@mui/material';
import { alpha, styled, SxProps, Theme, useColorScheme } from "@mui/material/styles";
import { useState } from 'react';
import { useThemeStore } from '@/store';
import { useTranslation } from 'react-i18next';
import SettingIcon from '@/assets/image/svg/setting.svg';
import DarkIcon from '@/assets/image/svg/dark.svg';
import LigntIcon from '@/assets/image/svg/light.svg';
import LayoutLeftIcon from '@/assets/image/svg/layout_left.svg';
import LayoutTopIcon from '@/assets/image/svg/layout_top.svg';
import LayoutLeftSmallIcon from '@/assets/image/svg/layout_left_small.svg';
import ThemeColorIcon from '@/assets/image/svg/theme_color.svg';
import FontIcon from '@/assets/image/svg/font.svg';
import { systemColorSchemes } from '@/theme/themePrimitives';

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
  const { t } = useTranslation();
  const { setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const CustomSlider = styled(Slider)(({ theme }: { theme: any }) => ({
    // minWidth: 200,
    // '& .MuiSelect-select': {
    //   padding: theme.spacing(1.5),
    // },
  }));

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
    // handleClose();
  };

  const handleTheme = (mode: 'light' | 'dark') => {
    // 直接设置模式
    setMode(mode);
    setThemeMode(mode);
    // handleClose();
  };

  const handleNavPosition = (position: 'left' | 'top' | 'bottom') => {
    setNavPosition(position);
    // handleClose();
  };

  const handlePrimaryChange = (primaryKey: string) => {
    setPrimaryKey(primaryKey);
    setPrimary(primaryKey);
    // handleClose();
  };

  const handleFontChange = (newFont: 'Public Sans' | 'Inter' | 'DM Sans' | 'Nunito Sans') => {
    setFontFamily(newFont);
    // handleClose();
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    // handleClose();
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
          // border: 'unset', // 去掉主题样式
          // backgroundColor: 'unset',
          // '&:hover': {
          //   backgroundColor: 'unset',
          //   borderColor: 'unset',
          // },
          // '&:active': {
          //   backgroundColor: 'unset',
          // },
          ...sx
        }}
        color="inherit"
        onClick={handleSettingsClick}
      >
        {/* <SettingsIcon /> */}
        <SvgIcon fontSize='medium' inheritViewBox component={SettingIcon} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ '& .MuiMenu-paper': { p: 2 } }}
      >
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h6" gutterBottom>
            {t('global.layout.setting')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t('global.layout.title.theme')}
          </Typography>
          <Stack direction="row" sx={{ gap: 2, '& .MuiBox-root': { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', width: 'calc(50% - 8px)', height: '5rem', borderRadius: 2, ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } } }}>
            <Box onClick={() => handleTheme('light')} sx={{ backgroundColor: (mode === 'light' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }}>
              <SvgIcon component={LigntIcon} inheritViewBox sx={{ color: 'primary.main' }} />
            </Box>
            <Box onClick={() => handleTheme('dark')} sx={{ backgroundColor: (mode === 'dark' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }}>
              <SvgIcon component={DarkIcon} inheritViewBox />
            </Box>
          </Stack>
          <Typography variant="body1" gutterBottom>
            {t('global.layout.title.nav')}
          </Typography>
          <Stack direction="row" sx={{ gap: 2, '& .MuiSvgIcon-root': { width: 'calc(33.333333% - 8px)', height: 'auto', cursor: 'pointer', borderRadius: 2, border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`, ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } } }}>
            <SvgIcon onClick={() => handleNavPosition('left')} width={86} height={64} component={LayoutLeftIcon} inheritViewBox sx={{ color: (navPosition === 'left' ? `${alpha(theme.palette.primary.main, 0.6)}` : theme.palette.text.disabled) }} />
            <SvgIcon onClick={() => handleNavPosition('top')} width={86} height={64} component={LayoutTopIcon} inheritViewBox sx={{ color: (navPosition === 'top' ? `${alpha(theme.palette.primary.main, 0.6)}` : theme.palette.text.disabled) }} />
            <SvgIcon onClick={() => handleNavPosition('bottom')} width={86} height={64} component={LayoutLeftSmallIcon} inheritViewBox sx={{ color: (navPosition === 'bottom' ? `${alpha(theme.palette.primary.main, 0.6)}` : theme.palette.text.disabled) }} />
          </Stack>
          <Typography variant="body1" gutterBottom>
            {t('global.layout.title.theme.system')}
          </Typography>
          <Stack direction="row" sx={{ gap: 2, '& .MuiBox-root': { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', width: 'calc(33.333333% - 8px)', height: '4.1875rem', borderRadius: 2 } }}>
            <Box onClick={() => handlePrimaryChange('green')} sx={{ backgroundColor: (primaryKey === 'green' ? `${alpha(systemColorSchemes.green.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.green.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.green.primary.main }} />
            </Box>
            <Box onClick={() => handlePrimaryChange('blue')} sx={{ backgroundColor: (primaryKey === 'blue' ? `${alpha(systemColorSchemes.blue.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.blue.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.blue.primary.main }} />
            </Box>
            <Box onClick={() => handlePrimaryChange('purple')} sx={{ backgroundColor: (primaryKey === 'purple' ? `${alpha(systemColorSchemes.purple.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.purple.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.purple.primary.main }} />
            </Box>
          </Stack>
          <Stack direction="row" sx={{ gap: 2, '& .MuiBox-root': { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', width: 'calc(33.333333% - 8px)', height: '4.1875rem', borderRadius: 2 } }}>
            <Box onClick={() => handlePrimaryChange('azure')} sx={{ backgroundColor: (primaryKey === 'azure' ? `${alpha(systemColorSchemes.azure.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.azure.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.azure.primary.main }} />
            </Box>
            <Box onClick={() => handlePrimaryChange('orange')} sx={{ backgroundColor: (primaryKey === 'orange' ? `${alpha(systemColorSchemes.orange.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.orange.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.orange.primary.main }} />
            </Box>
            <Box onClick={() => handlePrimaryChange('red')} sx={{ backgroundColor: (primaryKey === 'red' ? `${alpha(systemColorSchemes.red.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(systemColorSchemes.red.primary.main, 0.08)}` } }}>
              <SvgIcon component={ThemeColorIcon} inheritViewBox sx={{ color: systemColorSchemes.red.primary.main }} />
            </Box>
          </Stack>
          <Typography variant="body1" gutterBottom>
            {t('global.layout.title.font')}
          </Typography>
          <Stack direction="row" sx={{ gap: 2, '& .MuiBox-root': { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', width: 'calc(50% - 8px)', height: '5rem', borderRadius: 2 } }}>
            <Box onClick={() => handleFontChange('Public Sans')} sx={{ backgroundColor: (fontFamily === 'Public Sans' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } }}>
              <Stack sx={{ color: (fontFamily === 'Public Sans' ? theme.palette.primary.main : theme.palette.text.disabled) }}>
                <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SvgIcon component={FontIcon} inheritViewBox />
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontSize: '0.75rem', fontWeight: '600' }}>
                  Public Sans
                </Typography>
              </Stack>
            </Box>
            <Box onClick={() => handleFontChange('Inter')} sx={{ backgroundColor: (fontFamily === 'Inter' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } }}>
              <Stack sx={{ color: (fontFamily === 'Inter' ? theme.palette.primary.main : theme.palette.text.disabled) }}>
                <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SvgIcon component={FontIcon} inheritViewBox />
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontSize: '0.75rem', fontWeight: '600' }}>
                  Inter
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" sx={{ gap: 2, '& .MuiBox-root': { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', width: 'calc(50% - 8px)', height: '5rem', borderRadius: 2 } }}>
            <Box onClick={() => handleFontChange('DM Sans')} sx={{ backgroundColor: (fontFamily === 'DM Sans' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } }}>
              <Stack sx={{ color: (fontFamily === 'DM Sans' ? theme.palette.primary.main : theme.palette.text.disabled) }}>
                <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SvgIcon component={FontIcon} inheritViewBox />
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontSize: '0.75rem', fontWeight: '600' }}>
                  DM Sans
                </Typography>
              </Stack>
            </Box>
            <Box onClick={() => handleFontChange('Nunito Sans')} sx={{ backgroundColor: (fontFamily === 'Nunito Sans' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset'), ":hover": { backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}` } }}>
              <Stack sx={{ color: (fontFamily === 'Nunito Sans' ? theme.palette.primary.main : theme.palette.text.disabled) }}>
                <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SvgIcon component={FontIcon} inheritViewBox />
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ fontSize: '0.75rem', fontWeight: '600' }}>
                  Nunito Sans
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <Typography variant="body1" gutterBottom>
            {t('global.layout.title.font.size')}
          </Typography>
          <CustomSlider
            defaultValue={fontSize}
            aria-valuetext={'px'}
            // getAriaValueText={value => `${value}px`}
            valueLabelDisplay="on"
            valueLabelFormat={value => `${value}px`}
            shiftStep={1}
            step={1}
            marks
            min={12}
            max={20}
            onChange={(_event, value) => handleFontSizeChange(value as number)}
          />
        </Stack >
      </Menu >
    </>
  );
}