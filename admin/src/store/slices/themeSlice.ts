import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark';
type NavPosition = 'left' | 'top' | 'bottom';

interface ThemeState {
  mode: ThemeMode;
  navPosition: NavPosition;
}

const initialState: ThemeState = {
  mode: 'light',
  navPosition: 'left',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    setNavPosition(state, action: PayloadAction<NavPosition>) {
      state.navPosition = action.payload;
    },
  },
});

export const { setThemeMode, setNavPosition } = themeSlice.actions;
export default themeSlice.reducer;