import { Button, TextField, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '@/api';
import SettingsButton from '@/components/SettingsButton';
import './styles.scss';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginStore } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      loginStore(username, response.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box className="login-page">
      <Box className="login-container">
        <Typography variant="h4" className="login-title">
          {t('login')}
        </Typography>
        <TextField
          label={t('username')}
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label={t('password')}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          className="login-button"
          onClick={handleLogin}
        >
          {t('login')}
        </Button>
      </Box>

      <SettingsButton />
    </Box>
  );
}