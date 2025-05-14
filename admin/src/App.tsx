import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { StyledEngineProvider } from '@mui/material/styles';
import AppThemeProvider from './theme/AppThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { MessageProvider } from './components/GlobalMessage';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <MessageProvider>
          <AppThemeProvider>
            <CssBaseline enableColorScheme />
            <Router />
          </AppThemeProvider>
        </MessageProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;