import { Button, TextField, Box, Typography, useTheme, Alert } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '@/api';
import { Md5 } from 'ts-md5';

export default function Login() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login: loginStore } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      setError(null);
      let password_md5 = Md5.hashStr(password);
      const response = await login({ username, password: password_md5 });
      loginStore(response.token_type, response.access_token, response.refresh_token);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || t('login_failed')); // 显示具体错误或默认消息
      } else {
        setError(t('login_failed')); // 未知错误使用默认消息
      }
    }
  };

  return (
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
      {error && (
        <Alert severity="error" sx={{ mt: 'var(--spacing)' }}>
          {error}
        </Alert>
      )}
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
  );
}