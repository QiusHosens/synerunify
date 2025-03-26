import SettingsButton from '@/components/SettingsButton';
import { useThemeStore } from '@/store';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface TopNavProps {
  sx?: SxProps<Theme>;
  leftNavWidth: number;
  height: number;
}

export default function TopNav({ sx, leftNavWidth, height }: TopNavProps) {
  const { navPosition } = useThemeStore();
  const { t } = useTranslation();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: navPosition === 'left' ? 'calc(100% - ' + leftNavWidth + 'px)' : '100%',
        height: height,
        translate: 'unset',
        boxShadow: 'unset',
        ...sx,
      }}
    >
      <Toolbar
        sx={{
          height: height + 'px', // 设置固定高度
          minHeight: height + 'px !important', // 覆盖默认 minHeight
        }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('app_name')} {/* 假设翻译中有 app_name */}
        </Typography>
        <SettingsButton />
        <Button color="inherit">{t('logout')}</Button> {/* 示例按钮 */}
      </Toolbar>
    </AppBar>
  );
}