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
import { zhCN as coreZhCN, enUS as coreEnus, frFR as coreFrFR, arSD as coreArSD } from '@mui/material/locale';
import { zhCN as dataGridZhCN, enUS as dataGridEnus, frFR as dataGridFrFR, arSD as dataGridArSD } from '@mui/x-data-grid/locales';
import { zhCN as pickersZhCN, enUS as pickersEnus, frFR as pickersFrFR } from '@mui/x-date-pickers/locales';
import { useTranslation } from 'react-i18next';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
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
  },
    i18n.language === 'en' ? coreEnus : i18n.language === 'fr' ? coreFrFR : i18n.language === 'ar' ? coreArSD : coreZhCN,
    i18n.language === 'en' ? dataGridEnus : i18n.language === 'fr' ? dataGridFrFR : i18n.language === 'ar' ? dataGridArSD : dataGridZhCN,
    i18n.language === 'en' ? pickersEnus : i18n.language === 'fr' ? pickersFrFR : pickersZhCN,
  );

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