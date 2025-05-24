import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useThemeStore } from '@/store';
import { GlobalStyles } from '@mui/material';
import { colorSchemes, typography } from './themePrimitives';
import {
  buttonsCustomizations,
  dataGridsCustomizations,
  switchsCustomizations,
  badgesCustomizations,
} from './customizations';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, primary, fontFamily, fontSize } = useThemeStore();

  const theme = createTheme({
    // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
    cssVariables: {
      colorSchemeSelector: 'data-mui-color-scheme',
      cssVarPrefix: 'template',
    },
    // palette: {
    //   mode,
    //   primary: pri,
    //   secondary: { main: secondary },
    //   background: {
    //     default: mode === 'light' ? '#FFF' : '#141A21',
    //     paper: mode === 'light' ? '#FFF' : '#1C252E',
    //   },
    // },
    palette: {
      mode,
      ...primary
    },
    colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
    typography: {
      fontFamily,
      fontSize,
      ...typography,
    },
    components: {
      ...buttonsCustomizations,
      ...dataGridsCustomizations,
      ...switchsCustomizations,
      ...badgesCustomizations,
    },
  });

  const globalStyles = {
    // body: {
    //   backgroundColor: theme.palette.background.default,
    //   margin: 0,
    // },
    '.center-align': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
}