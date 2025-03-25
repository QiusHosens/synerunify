import { getHome, HomeMenuResponse } from '@/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义字体类型
type FontFamily = 'Roboto' | 'Poppins' | 'Inter';

// 主题状态
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

// 授权状态
interface AuthState {
  isAuthenticated: boolean;
  token_type: string | null; // token类型
  access_token: string | null;
  refresh_token: string | null;
  login: (token_type: string, access_token: string, refresh_token: string) => void;
  logout: () => void;
}

// 主页状态,包括nickname,memus
interface HomeState {
  nickname: string | null; // 昵称
  routes: HomeMenuResponse[];
  setNickname: (nickname: string) => void;
  setRoutes: (routes: HomeMenuResponse[]) => void;
  fetchAndSetHome: (token: string | null) => Promise<void>;
}

// 创建主题 store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
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
    }), {
    name: 'theme-storage', // localStorage 中的键名
    // partialize: (state) => ({
    //   mode: state.mode,
    //   navPosition: state.navPosition,
    //   primary: state.primary,
    //   secondary: state.secondary,
    //   fontFamily: state.fontFamily,
    //   // fontSize 未包含，将不持久化
    // }),
    // storage: {
    //   getItem: (name) => {
    //     const value = localStorage.getItem(name);
    //     return value ? JSON.parse(value) : null;
    //   },
    //   setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
    //   removeItem: (name) => localStorage.removeItem(name),
    // },
  }));

// 创建认证 store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token_type: null, // token类型
      access_token: null,
      refresh_token: null,
      login: (token_type: string, access_token: string, refresh_token: string) => set({ isAuthenticated: true, token_type, access_token, refresh_token }),
      logout: () => set({ isAuthenticated: false, token_type: null, access_token: null, refresh_token: null }),
    }), {
    name: 'auth-storage', // localStorage 中的键名
  }));

  export const useHomeStore = create<HomeState>((set) => ({
    nickname: null,
    routes: [],
    setNickname: (nickname) => set({ nickname }),
    setRoutes: (routes) => set({ routes }),
    fetchAndSetHome: async (token) => {
      if (token) {
        try {
          const routeData = await getHome();
          set({ nickname: routeData.nickname });
          set({ routes: routeData.menus });
        } catch (error) {
          console.error('Failed to fetch routes:', error);
          set({ routes: [] }); // 获取失败时清空路由
        }
      } else {
        set({ routes: [] }); // 无 token 时清空路由
      }
    },
  }));