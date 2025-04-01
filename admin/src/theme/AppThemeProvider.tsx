import { ThemeProvider, createTheme, PaletteColor, PaletteColorOptions, SimplePaletteColorOptions } from '@mui/material/styles';
import { useThemeStore } from '@/store';
import { GlobalStyles } from '@mui/material';
import { colorSchemes } from './themePrimitives';
import {
  inputsCustomizations,
  dataDisplayCustomizations,
  feedbackCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './customizations';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, primary, fontFamily, fontSize } = useThemeStore();

  let palette = {};
  if (primary) {
    palette = primary;
  }

  // debugger

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
    palette,
    colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
    typography: {
      fontFamily,
      fontSize,
    },
    components: {
      // ...inputsCustomizations,
      // ...dataDisplayCustomizations,
      // ...feedbackCustomizations,
      // ...navigationCustomizations,
      // ...surfacesCustomizations,
      // ...chartsCustomizations,
      // ...dataGridCustomizations,
      // ...datePickersCustomizations,
      // ...treeViewCustomizations,
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