import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { getDashboardData } from '@/api';

export default function Dashboard() {
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        console.log('Dashboard data:', data);
      } catch (error) {
        console.error('Fetch dashboard failed:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Typography variant="h4">{t('dashboard')}</Typography>
      <Typography>{t('welcome')}</Typography>
    </div>
  );
}