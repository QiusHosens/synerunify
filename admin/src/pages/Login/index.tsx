import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  FormControl,
  FormLabel,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useRef, useState } from "react";
import { useAuthStore, useHomeStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "@/api";
import { Md5 } from "ts-md5";
import CaptchaDialog from "./captcha";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login: loginStore } = useAuthStore();
  const { fetchAndSetHome } = useHomeStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const captchaDialog = useRef(null);

  const handleOpenCaptchaDialog = () => {
    (captchaDialog.current as any).show();
  }

  const handleLogin = async (captchaKey: string) => {
    try {
      setError(null);
      const password_md5 = Md5.hashStr(password);
      const response = await login({ username, password: password_md5, captcha_key: captchaKey });
      loginStore(
        response.token_type,
        response.access_token,
        response.refresh_token
      );
      // console.log('login success');
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
        {t("gloabl.page.login")}
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
          <FormLabel htmlFor="email">{t("page.login.title.username")}</FormLabel>
          <TextField
            size="small"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">{t("page.login.title.password")}</FormLabel>
          <TextField
            size="small"
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
          onClick={handleOpenCaptchaDialog}
        >
          {t("login")}
        </Button>
        <CaptchaDialog ref={captchaDialog} onSubmit={handleLogin}></CaptchaDialog>
      </Box>
    </Card>
  );
}
