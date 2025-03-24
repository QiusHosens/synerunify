import { Button, TextField, Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '@/api';
import LoginLayout from '@/layout/LoginLayout';

export default function Login() {
  const theme = useTheme();
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
    <LoginLayout>
      <Box
        sx={{
          maxWidth: 400,
          width: '100%',
          p: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
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
          sx={{
            mt: 2,
          }}
          onClick={handleLogin}
        >
          {t('login')}
        </Button>
      </Box>
    </LoginLayout>
  );
}