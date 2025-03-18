import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h4">{t('dashboard')}</Typography>
      <Typography>{t('welcome')}</Typography>
    </div>
  );
}