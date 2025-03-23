import { create } from 'zustand';

// 定义字体类型
type FontFamily = 'Roboto' | 'Poppins' | 'Inter';

// 定义状态类型
interface ThemeState {
  mode: 'light' | 'dark';
  navPosition: 'left' | 'top' | 'bottom';
  primary: string; // 直接存储颜色值
  secondary: string; // 直接存储颜色值
  fontFamily: FontFamily;
  fontSize: number;
  setThemeMode: (mode: 'light' | 'dark') => void;
  setNavPosition: (position: 'left' | 'top' | 'bottom') => void;
  setPrimary: (primary: string) => void;
  setSecondary: (secondary: string) => void;
  setFontFamily: (fontFamily: FontFamily) => void;
  setFontSize: (fontSize: number) => void;
}

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
  login: (user: string, token: string) => void;
  logout: () => void;
}

// 创建主题 store
export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  navPosition: 'left',
  primary: '#1976d2', // 默认蓝色
  secondary: '#dc004e', // 默认粉红色
  fontFamily: 'Roboto',
  fontSize: 16,
  setThemeMode: (mode) => set({ mode }),
  setNavPosition: (position) => set({ navPosition: position }),
  setPrimary: (primary) => set({ primary }),
  setSecondary: (secondary) => set({ secondary }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setFontSize: (fontSize) => set({ fontSize }),
}));

// 创建认证 store
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: (user, token) => set({ isAuthenticated: true, user, token }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));