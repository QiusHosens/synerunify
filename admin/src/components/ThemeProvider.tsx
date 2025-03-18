import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useSelector((state: RootState) => state.theme);

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}