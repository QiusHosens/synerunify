import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import ThemeProvider from './components/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;