import { create } from 'zustand';

// 定义状态类型
interface ThemeState {
  mode: 'light' | 'dark';
  navPosition: 'left' | 'top' | 'bottom';
  setThemeMode: (mode: 'light' | 'dark') => void;
  setNavPosition: (position: 'left' | 'top' | 'bottom') => void;
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
  setThemeMode: (mode) => set({ mode }),
  setNavPosition: (position) => set({ navPosition: position }),
}));

// 创建认证 store
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: (user, token) => set({ isAuthenticated: true, user, token }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));