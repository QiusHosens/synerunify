import {
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  Alert,
  FormControl,
  FormLabel,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useAuthStore, useHomeStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "@/api";
import { Md5 } from "ts-md5";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function Login() {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login: loginStore } = useAuthStore();
  const { fetchAndSetHome } = useHomeStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      setError(null);
      let password_md5 = Md5.hashStr(password);
      const response = await login({ username, password: password_md5 });
      loginStore(
        response.token_type,
        response.access_token,
        response.refresh_token
      );

      // 登录成功后获取动态路由
      await fetchAndSetHome(response.access_token);

      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || t("login_failed")); // 显示具体错误或默认消息
      } else {
        setError(t("login_failed")); // 未知错误使用默认消息
      }
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        {t("login")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">{t("username")}</FormLabel>
          <TextField
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">{t("password")}</FormLabel>
          <TextField
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        {error && (
          <Alert severity="error" sx={{ mt: "var(--spacing)" }}>
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
          {t("login")}
        </Button>
      </Box>
    </Card>
  );
}
