import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setThemeMode, setNavPosition } from '../../store/slices/themeSlice';

export default function Navigation() {
  const dispatch = useDispatch();
  const { mode, navPosition } = useSelector((state: RootState) => state.theme);

  return (
    <AppBar position="static" sx={{ width: navPosition === 'left' ? 240 : '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button color="inherit" onClick={() => dispatch(setThemeMode(mode === 'light' ? 'dark' : 'light'))}>
          Toggle {mode === 'light' ? 'Dark' : 'Light'}
        </Button>
        <Button color="inherit" onClick={() => dispatch(setNavPosition('left'))}>Left</Button>
        <Button color="inherit" onClick={() => dispatch(setNavPosition('top'))}>Top</Button>
        <Button color="inherit" onClick={() => dispatch(setNavPosition('bottom'))}>Bottom</Button>
      </Toolbar>
    </AppBar>
  );
}