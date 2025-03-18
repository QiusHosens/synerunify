import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import ThemeProvider from './components/ThemeProvider';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;