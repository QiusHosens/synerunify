import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { StyledEngineProvider } from '@mui/material/styles';
import AppThemeProvider from './theme/AppThemeProvider';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <AppThemeProvider>
          <Router />
        </AppThemeProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;