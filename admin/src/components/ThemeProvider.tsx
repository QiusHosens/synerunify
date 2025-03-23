import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useThemeStore } from '@/store';
import { GlobalStyles } from '@mui/material';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, primary, secondary, fontFamily, fontSize } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: secondary },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#141A21',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily,
      fontSize,
    },
  });

  const globalStyles = {
    body: {
      backgroundColor: theme.palette.background.default,
      margin: 0,
    },
    '.center-align': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles styles={globalStyles} />
      {children}
    </MuiThemeProvider>
  );
}