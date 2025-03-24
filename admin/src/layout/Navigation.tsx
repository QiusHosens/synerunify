import { AppBar, Toolbar, Typography } from '@mui/material';
import { useThemeStore } from '@/store';
import { useTranslation } from 'react-i18next';
import SettingsButton from '@/components/SettingsButton';

export default function Navigation() {
  const { navPosition } = useThemeStore();
  const { t } = useTranslation();

  return (
    <AppBar
      position="static"
      sx={{
        width: navPosition === 'left' ? 240 : '100%',
        flexShrink: 0,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('app_title')}
        </Typography>
        <SettingsButton />
      </Toolbar>
    </AppBar>
  );
}