import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function DictManage() {
  const { t } = useTranslation();

  useEffect(() => {
    
  }, []);

  return (
    <div>
      <Typography variant="h4">{t('dict manage')}</Typography>
      <Typography>{t('welcome')}</Typography>
    </div>
  );
}