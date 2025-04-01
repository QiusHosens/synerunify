import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { StyledEngineProvider } from '@mui/material/styles';
import AppThemeProvider from './theme/AppThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <AppThemeProvider>
          <CssBaseline enableColorScheme />
          <Router />
        </AppThemeProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;